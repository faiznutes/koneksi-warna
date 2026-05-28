import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState, useEffect } from "react";

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const VISIBLE = 3;

  useEffect(() => {
    fetch("/api/testimonials")
      .then(r => r.json()).then(d => setReviews(d.data || []))
      .catch(() => {});
  }, []);

  // Auto-roll
  useEffect(() => {
    if (paused || reviews.length === 0) return;
    const t = setInterval(() => setIndex(i => (i + 1) % reviews.length), 4500);
    return () => clearInterval(t);
  }, [reviews.length, paused]);

  if (reviews.length === 0) return null;

  const visible = [];
  for (let i = 0; i < VISIBLE; i++) {
    const idx = (index + i) % reviews.length;
    visible.push({ ...reviews[idx], idx });
  }

  return (
    <motion.section className="py-24 bg-bg-light overflow-hidden"
      id="testimonials"
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, ease: "easeOut" }}>
      <div className="container px-4 text-center"
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div class="w-12 h-0.5 bg-accent/60 mx-auto mb-4 rounded-full"></div><h2 class="mb-2 font-display text-3xl uppercase tracking-[0.12em] text-gray-500 font-light">TESTIMONI</h2>
        <h3 className="mb-12 font-display text-4xl font-bold tracking-tight">Kata Mereka</h3>

        {/* Desktop: 3 columns */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 min-h-[200px]">
          <AnimatePresence mode="popLayout">
            {visible.map((r, i) => (
              <motion.div key={r.id + "-" + (index + i)}
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -10 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 text-left flex flex-col">
                <Quote className="text-accent/30 mb-3" size={28} />
                <p className="flex-1 text-gray-700 leading-relaxed mb-4 text-sm italic">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="font-semibold text-sm text-gray-800">{r.author}</span>
                  <div className="flex gap-0.5">
                    {[...Array(r.rating)].map((_, s) => (
                      <Star key={s} size={14} className="text-accent fill-accent" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Mobile: 1 card */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            {reviews.map((r, i) => i === index && (
              <motion.div key={r.id}
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
                className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 text-left">
                <Quote className="text-accent/30 mb-3" size={24} />
                <p className="text-gray-700 leading-relaxed mb-4 italic">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="font-semibold text-sm text-gray-800">{r.author}</span>
                  <div className="flex gap-0.5">
                    {[...Array(r.rating)].map((_, s) => (
                      <Star key={s} size={14} className="text-accent fill-accent" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button onClick={() => setIndex(i => (i - 1 + reviews.length) % reviews.length)}
            className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-accent hover:border-accent/30 transition-all">
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-2">
            {reviews.map((_, i) => (
              <button key={i} onClick={() => setIndex(i)}
                className={"w-2.5 h-2.5 rounded-full transition-all duration-300 " +
                  (i === index ? "bg-accent w-6" : "bg-gray-300 hover:bg-gray-400")} />
            ))}
          </div>

          <button onClick={() => setIndex(i => (i + 1) % reviews.length)}
            className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-accent hover:border-accent/30 transition-all">
            <ChevronRight size={18} />
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-3">Arahkan kursor ke atas untuk pause</p>
      </div>
    </motion.section>
  );
}

