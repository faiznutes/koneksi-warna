

const navItems = [
  { label: "Beranda", href: "#hero" },
  { label: "Tentang", href: "#about" },
  { label: "Layanan", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Paket", href: "#packages" },
  { label: "Testimoni", href: "#testimonials" },
  { label: "Kontak", href: "#contact" },
];

export default function Navbar() {
  const handleClick = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="hidden lg:block fixed inset-x-0 top-0 z-50 h-16 bg-white/90 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
      <nav className="container mx-auto flex items-center justify-between h-full px-4">
        <a href="#hero" onClick={(e) => { e.preventDefault(); handleClick("#hero"); }} className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold text-primary">Koneksi <span className="text-accent">Warna</span></span>
          <span className="text-accent text-xs font-normal hidden sm:inline border-l border-gray-300 pl-2">Fotografi</span>
        </a>
        <ul className="flex items-center gap-1">
          {navItems.map(item => (
            <li key={item.label}>
              <a href={item.href} onClick={(e) => { e.preventDefault(); handleClick(item.href); }} className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-accent hover:bg-amber-50 transition-all duration-200">{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

