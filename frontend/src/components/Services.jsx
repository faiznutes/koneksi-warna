import { motion } from "framer-motion";
import { Camera, Heart, Star, Users, Loader } from "lucide-react";
import { useState, useEffect } from "react";

const iconMap = { Camera: <Camera size={24} />, Heart: <Heart size={24} />, Star: <Star size={24} />, Users: <Users size={24} /> };

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/services")
      .then(r => r.json()).then(d => { setServices(d.data); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, []);

  return (
    <motion.section className="py-24" id="services" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, ease: "easeOut" }}>
      <div className="container text-center px-4">
        <div class="w-12 h-0.5 bg-accent/60 mx-auto mb-4 rounded-full"></div><h2 class="mb-2 font-display text-3xl uppercase tracking-[0.12em] text-gray-500 font-light">LAYANAN FOTOGRAFI</h2>
        <h3 className="mb-12 font-display text-4xl font-bold tracking-tight">Pilih Momenmu</h3>
        {loading ? <Loader className="animate-spin mx-auto text-surabaya-gold" size={32} /> : (
        <div className="grid gap-8 md:grid-cols-3">
          {services.map((s) => (
            <motion.article key={s.id} className="relative min-h-72 rounded-xl overflow-hidden bg-white rounded-xl shadow-md border border-gray-100"
              whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(255,255,255,0.2)", borderColor: "#D4A029" }} transition={{ type: "spring", stiffness: 300 }}>
              <div className="absolute inset-0 bg-cover bg-center opacity-85 transition-transform duration-500" style={{ backgroundImage: `url(${s.image_url?.startsWith("/") ? "http://localhost:3001" + s.image_url : s.image_url})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-black/60" />
              <div className="relative flex min-h-72 flex-col justify-end p-8 text-center">
                <div className="mb-4 flex justify-center text-accent">{iconMap[s.icon] || <Camera size={24} />}</div>
                <h4 className="mb-2 font-display text-xl text-white">{s.title}</h4>
                <p className="text-sm text-gray-600">{s.description}</p>
              </div>
            </motion.article>
          ))}
        </div>)}
      </div>
    </motion.section>
  );
}







