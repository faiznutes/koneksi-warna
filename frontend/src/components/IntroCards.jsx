import { motion } from "framer-motion";

const cards = [
  {
    title: "Sesi Wisuda",
    desc: "Abadikan momen kelulusan dengan gaya elegan. Pose natural, hasil glowing, siap di-upload.",
    cat: "wisuda",
  },
  {
    title: "Cerita Prewedding",
    desc: "Dari lamaran sampai hari bahagia — setiap detik layak diabadikan dengan sinematik.",
    cat: "prewedding",
  },
  {
    title: "Momen Wedding",
    desc: "Liputan penuh cinta, detail tak terlewat. Kenangan yang bisa kamu nikmati selamanya.",
    cat: "wedding",
  },
];

function handleJelajahi(cat) {
  // Scroll ke portfolio
  const el = document.getElementById("portfolio");
  if (el) el.scrollIntoView({ behavior: "smooth" });
  // Kirim event ke Portfolio component
  window.dispatchEvent(new CustomEvent("portfolio-filter", { detail: { category: cat } }));
}

export default function IntroCards() {
  return (
    <section className="relative -mt-20 z-20 container mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {cards.map((c, i) => (
          <motion.article key={c.title}
            className="flex-1 rounded-2xl bg-white/90 backdrop-blur-lg p-6 md:p-8 border border-gray-200/60 shadow-lg shadow-black/5 hover:border-accent/30 hover:shadow-xl transition-all duration-500 cursor-default"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }} whileHover={{ y: -6, scale: 1.02 }}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/15 to-transparent border border-gray-200 flex items-center justify-center mb-4">
              <span className="text-accent text-lg font-bold">0{i+1}</span>
            </div>
            <h3 className="mb-2 text-xl font-display text-primary">{c.title}</h3>
            <p className="mb-5 text-sm text-gray-600 leading-relaxed">{c.desc}</p>
            <button onClick={() => handleJelajahi(c.cat)}
              className="inline-flex items-center gap-2 text-accent text-sm font-medium hover:text-accent/80 transition-all duration-300 group cursor-pointer">
              <span>Jelajahi</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
            </button>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
