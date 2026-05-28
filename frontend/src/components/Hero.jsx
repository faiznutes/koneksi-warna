import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Hero() {
  const [bg, setBg] = useState("https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920");
  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json()).then(d => { if (d.data?.hero_bg) setBg(d.data.hero_bg); })
      .catch(() => {});
  }, []);

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-start overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105" style={{ backgroundImage: `url(${bg})` }} />
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-surabaya-dark/60 via-transparent to-black/30" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-surabaya-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-10 w-64 h-64 bg-surabaya-gold/5 rounded-full blur-2xl" />
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 w-full px-6 md:px-12 lg:px-20 max-w-3xl">
        <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          className="inline-block mb-3 text-xs sm:text-sm uppercase tracking-[0.3em] font-light text-surabaya-gold font-medium">Koneksi Warna</motion.span>
        <h1 className="mb-5 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight leading-[1.05] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">CAPTURE<br />YOUR BEST<br />MOMENTS</h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-10 text-base sm:text-lg text-gray-200/90 font-light max-w-xl leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <span className="text-surabaya-gold font-semibold">di Surabaya</span> &mdash; Fotografer lepas untuk
          wisuda, prewedding, wedding, event, dan portrait pribadi.</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }} className="flex flex-col sm:flex-row gap-4">
          <a href="https://wa.me/6289681047082?text=Halo%20Koneksi%20Warna%2C%20saya%20tertarik%20dengan%20layanan%20fotografi.%20Bisa%20diskusi%20lebih%20lanjut%3F" target="_blank" rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 font-medium text-white tracking-wide shadow-[0_8px_30px_rgba(212,160,41,0.35)] hover:shadow-[0_12px_40px_rgba(212,160,41,0.5)] hover:bg-primary/90 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-black/10 hover:shadow-xl active:scale-95 text-sm sm:text-base tracking-wide">Pesan Sekarang</a>
          <a href="#portfolio"
            className="inline-flex items-center justify-center rounded-full border-2 border-surabaya-gold/40 px-10 py-4 font-bold text-surabaya-gold hover:bg-surabaya-gold/10 hover:border-surabaya-gold/60 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm text-sm sm:text-base tracking-wide">Lihat Portfolio</a>
        </motion.div>
      </motion.div>
    </section>
  );
}




