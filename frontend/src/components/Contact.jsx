import { Mail, Phone, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function buildWaText(wa, form) {
  const lines = [
    "Halo Koneksi Warna,",
    "saya tertarik dengan layanan fotografi.",
    "",
    "Berikut detail pemesanan saya:",
    "",
    "Nama: " + form.name,
    "Layanan: " + form.service,
    "Tanggal: " + form.date,
    "Pesan: " + (form.message || "-"),
    "",
    "Terima kasih.",
  ];
  return "https://wa.me/" + wa + "?text=" + encodeURIComponent(lines.join("\n"));
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", service: "", date: "", message: "" });
  const [s, setS] = useState({ wa_number: "6289681047082", instagram: "koneksiwarna" });
  useEffect(() => { fetch("/api/settings").then(r=>r.json()).then(d=>{ if(d.data) setS(d.data); }).catch(()=>{}); }, []);

  const waUrl = buildWaText(s.wa_number, form);
  const waDirect = "https://wa.me/" + s.wa_number + "?text=Halo%20Koneksi%20Warna%2C%20saya%20ingin%20tanya%20lebih%20lanjut%20tentang%20layanan%20fotografi.";
  const igUrl = "https://instagram.com/" + (s.instagram || "koneksiwarna");

  return (
    <motion.section className="py-24 bg-bg-light text-center" id="contact" initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, ease: "easeOut" }}>
      <div className="container max-w-2xl px-4">
        <span className="inline-block mb-3 text-sm uppercase tracking-[0.2em] text-accent font-medium">MARI CIPTAKAN MOMENMU</span>
        <h2 className="mb-4 font-display text-4xl md:text-5xl font-bold text-primary">Pesan Sesi</h2>
        <p className="mb-8 text-gray-500">Tersedia untuk Surabaya dan sekitarnya.</p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
          <a href={waDirect} target="_blank" rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 font-medium text-white tracking-wide transition-all duration-300 hover:bg-primary/90 hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-black/10 hover:shadow-xl">
            <Phone size={20} /> WhatsApp
          </a>
          <a href={igUrl} target="_blank" rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 font-semibold text-gray-700 border border-gray-200 shadow-sm hover:bg-amber-50 hover:text-accent transition-all duration-300">
            <Mail size={20} /> Instagram
          </a>
        </div>

        <form className="space-y-4 text-left" onSubmit={(e) => { e.preventDefault(); window.open(waUrl, "_blank"); }}>
          <input type="text" placeholder="Nama Anda" required value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            className="w-full rounded-xl bg-white p-4 text-gray-800 border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-200" />
          <select required value={form.service} onChange={e => setForm({...form, service: e.target.value})}
            className="w-full rounded-xl bg-white p-4 text-gray-800 border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-200">
            <option value="" disabled>Pilih Layanan</option>
            <option value="Foto Wisuda">Foto Wisuda</option>
            <option value="Foto Prewedding">Foto Prewedding</option>
            <option value="Dokumentasi Wedding">Dokumentasi Wedding</option>
            <option value="Sesi Engagement">Sesi Engagement</option>
            <option value="Portrait Keluarga">Portrait Keluarga</option>
            <option value="Foto Event">Foto Event</option>
          </select>
          <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})}
            className="w-full rounded-xl bg-white p-4 text-gray-800 border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-200" />
          <textarea rows={4} placeholder="Detail tambahan..." value={form.message} onChange={e => setForm({...form, message: e.target.value})}
            className="w-full rounded-xl bg-white p-4 text-gray-800 border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-200" />
          <button type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-medium text-white tracking-wide transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10 hover:shadow-xl">
            <Send size={18} /> Kirim ke WhatsApp
          </button>
        </form>
      </div>
    </motion.section>
  );
}

