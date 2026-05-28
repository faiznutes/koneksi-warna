import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PER_PAGE = 9;

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState(["Semua"]);
  const [filter, setFilter] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const changeFilter = useCallback((f) => { setFilter(f); setPage(1); }, []);

  useEffect(() => {
    fetch("/api/works")
      .then(r => r.json()).then(d => { setItems(d.data); setLoading(false); })
      .catch(() => setLoading(false));
    fetch("/api/categories")
      .then(r => r.json()).then(d => { setCategories(["Semua", ...d.data.map(c => c.slug)]); })
      .catch(() => {});

    function onFilter(e) { setFilter(e.detail.category); setPage(1); }
    window.addEventListener("portfolio-filter", onFilter);
    return () => window.removeEventListener("portfolio-filter", onFilter);
  }, []);

  const catLabel = { Semua:"Semua", wisuda:"Wisuda", prewedding:"Prewedding", wedding:"Wedding", event:"Event", portrait:"Portrait" };

  const filtered = items
    .filter(i => filter === "Semua" || i.category_name?.toLowerCase() === filter)
    .sort((a, b) => (b.featured || 0) - (a.featured || 0) || (a.sort_order || 0) - (b.sort_order || 0));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  function imgUrl(url) {
    if (!url || url.startsWith("/uploads/")) return url || "";
    return url;
  }

  function imgErr(e) {
    e.target.onerror = null;
    e.target.src = "data:image/svg+xml," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect fill='%23EDE6DF' width='400' height='300'/><text x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'>Foto tidak tersedia</text></svg>");
  }

  return (
    <motion.section className="py-24" id="portfolio"
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, ease: "easeOut" }}>
      <div className="container px-4">
        <div className="text-center mb-12">
          <div className="w-12 h-0.5 bg-accent/60 mx-auto mb-4 rounded-full"></div>
          <h2 className="mb-2 font-display text-3xl uppercase tracking-[0.12em] text-gray-500 font-light">KARYA TERPILIH</h2>
          <h3 className="font-display text-4xl font-bold tracking-tight">Cerita yang Saya Abadikan</h3>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(c => (
            <button key={c} onClick={() => changeFilter(c)}
              className={"px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 " +
                (filter === c ? "bg-primary text-white shadow-md shadow-black/15" : "bg-surface-muted text-gray-600 hover:bg-gray-200")}>
              {catLabel[c] || c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[1,2,3,4,5,6].map(n => (
              <div key={n} className="rounded-xl bg-gray-100 animate-pulse h-64" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">Belum ada karya di kategori ini.</p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div key={filter + "-" + safePage}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {paged.map(i => (
                  <motion.article key={i.id}
                    className="relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow group"
                    layout>
                    <div className="aspect-[4/3] overflow-hidden bg-gray-50">
                      <img loading="lazy"
                        src={imgUrl(i.image_url)}
                        alt={i.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={imgErr} />
                    </div>
                    {i.featured ? (
                      <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">★ Featured</span>
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      flex flex-col justify-end p-5 text-left pointer-events-none">
                      <h4 className="text-white font-display text-lg">{i.title}</h4>
                      <p className="text-gray-200 text-sm capitalize">{i.category_name || "Karya"}</p>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-12">
                <button onClick={() => setPage(safePage - 1)} disabled={safePage <= 1}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    disabled:opacity-30 disabled:cursor-not-allowed
                    bg-surface-muted text-gray-600 hover:bg-gray-200">
                  &larr; Sebelumnya
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                  Math.max(0, safePage - 3), Math.min(totalPages, safePage + 2)
                ).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={"w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 " +
                      (p === safePage
                        ? "bg-primary text-white shadow-md shadow-black/15"
                        : "bg-surface-muted text-gray-600 hover:bg-gray-200")}>
                    {p}
                  </button>
                ))}

                <button onClick={() => setPage(safePage + 1)} disabled={safePage >= totalPages}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    disabled:opacity-30 disabled:cursor-not-allowed
                    bg-surface-muted text-gray-600 hover:bg-gray-200">
                  Selanjutnya &rarr;
                </button>
              </div>
            )}

            <div className="text-center mt-4 text-sm text-gray-400">
              {filtered.length} karya &mdash; Halaman {safePage} dari {totalPages}
            </div>
          </>
        )}
      </div>
    </motion.section>
  );
}


