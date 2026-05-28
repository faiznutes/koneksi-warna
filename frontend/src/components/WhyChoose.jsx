import { motion } from "framer-motion";
import { Edit, MapPin, Users, DollarSign } from "lucide-react";

const features = [
  { icon: <Edit size={24} />, title: "Editing Profesional", desc: "Post-processing teliti untuk tampilan premium." },
  { icon: <MapPin size={24} />, title: "Lokasi Fleksibel", desc: "Studio indoor atau spot outdoor Surabaya." },
  { icon: <Users size={24} />, title: "Arahan Ramah", desc: "Panduan agar Anda merasa natural." },
  { icon: <DollarSign size={24} />, title: "Paket Terjangkau", desc: "Kualitas premium dengan harga lepas." },
];

export default function WhyChoose() {
  return (
    <motion.section className="py-24" id="about" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, ease: "easeOut" }}>
      <div className="container text-center px-4">
        <h2 className="mb-2 font-display text-3xl uppercase tracking-wider text-gray-400">MENGAPA SAYA</h2>
        <h3 className="mb-12 font-display text-4xl font-bold tracking-tight">Karena Anda pantas mendapatkan yang terbaik</h3>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map(f => (
            <motion.article key={f.title} className="rounded-xl bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:border-surabaya-gold/20 text-center" whileHover={{ y: -6, boxShadow: "0 10px 30px rgba(0,0,0,.4)" }} transition={{ duration: 0.2 }}>
              <div className="mb-4 flex justify-center text-accent">{f.icon}</div>
              <h4 className="mb-2 font-display text-xl text-primary">{f.title}</h4>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}










