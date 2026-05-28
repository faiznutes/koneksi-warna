import { Camera, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-primary text-gray-300 py-12">
      <div className="container mx-auto flex flex-col items-center gap-6 text-center px-4">
        <motion.a href="#" className="font-display text-3xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          Koneksi <span className="text-accent">Warna</span>
        </motion.a>
        <p className="text-sm text-gray-400 max-w-md">Fotografer profesional yang mengabadikan momen terbaik Anda di Surabaya dan sekitarnya.</p>
        <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
          {["Beranda","Tentang","Layanan","Portfolio","Paket","Testimoni","Kontak"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-gray-400 hover:text-accent transition-colors duration-200">{l}</a>
          ))}
        </nav>
        <div className="flex gap-4">
          <a href="https://instagram.com/yourphotography" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-accent/20 hover:text-accent transition-all duration-200"><Camera size={20} /></a>
          <a href="https://wa.me/6289681047082" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-accent/20 hover:text-accent transition-all duration-200"><MessageCircle size={20} /></a>
        </div>
        <p className="text-xs text-gray-500">&copy; 2026 Koneksi Warna. Hak cipta dilindungi.</p>
      </div>
    </footer>
  );
}

