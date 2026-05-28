import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function StorySection() {
  return (
    <section className="relative h-[70vh] flex items-center justify-start overflow-hidden bg-cover bg-center text-white px-6 md:px-16 lg:px-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1920&auto=format')" }}>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
      <motion.div className="relative z-10 max-w-xl" initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <h2 className="mb-4 font-display text-4xl sm:text-5xl font-bold">SETIAP FOTO<br />PUNYA CERITA</h2>
        <button className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-primary hover:bg-accent/80">
          <Play size={20} /> Tonton Behind The Scene
        </button>
      </motion.div>
      <div className="absolute bottom-8 right-8 flex gap-4">
        {[1, 2].map(n => (
          <motion.div key={n} className="w-32 h-20 rounded-xl overflow-hidden bg-surface backdrop-blur-xs" whileHover={{ scale: 1.08 }}>
            <img src={`https://picsum.photos/seed/story${n}/200/130`} alt={`preview ${n}`} className="h-full w-full object-cover" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
