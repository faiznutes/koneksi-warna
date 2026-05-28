import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/packages")
      .then(r => r.json()).then(d => { setPackages(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <motion.section className="py-24" id="packages" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, ease: "easeOut" }}>
      <div className="container text-center px-4">
        <h2 className="mb-2 font-display text-3xl uppercase tracking-wider text-gray-400">PAKET FOTO</h2>
        <h3 className="mb-12 font-display text-4xl font-bold tracking-tight">Pilih Paket Sesuai Kebutuhanmu</h3>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center items-stretch">
          {packages.map(p => (
            <motion.article key={p.id}
              className={`flex-1 rounded-2xl bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-surabaya-gold/30 text-center border border-white/5 flex flex-col justify-between ${p.featured ? "border-surabaya-gold/40 scale-[1.02] lg:scale-105" : ""}`}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,.6)" }} transition={{ type: "spring", stiffness: 300 }}>
              <div>
                <div className="w-16 h-1 bg-surabaya-gold mx-auto mb-6 rounded-full" />
                <h4 className="mb-2 font-display text-2xl text-primary">{p.title}</h4>
                {p.featured ? <span className="inline-block px-3 py-1 rounded-full bg-surabaya-gold/20 text-surabaya-gold text-xs font-semibold mb-4">Paling Populer</span> : null}
                <p className="text-3xl font-bold text-surabaya-gold mb-6">{p.price}</p>
                <ul className="mb-8 text-left space-y-3 text-sm text-gray-600">
                  {(p.benefits || []).map(b => <li key={b} className="flex items-start gap-3"><span className="text-surabaya-gold mt-0.5">✓</span>{b}</li>)}
                </ul>
              </div>
              <a href={`https://wa.me/6289681047082?text=${encodeURIComponent("Halo Koneksi Warna, saya tertarik dengan paket " + p.title + ". Bisa diskusi lebih lanjut?")}`} target="_blank" rel="noreferrer"
                className="inline-block rounded-full bg-primary px-8 py-3 font-medium text-white tracking-wide hover:bg-primary/90 transition-all duration-300 hover:scale-105">Pesan Sekarang</a>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}







