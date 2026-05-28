import { Camera, Image, Package, Phone, MessageCircle } from "lucide-react";

const items = [
  { icon: <Camera size={20} />, label: "Layanan", href: "#services" },
  { icon: <Image size={20} />, label: "Portfolio", href: "#portfolio" },
  { icon: <Package size={20} />, label: "Paket", href: "#packages" },
  { icon: <Phone size={20} />, label: "Kontak", href: "#contact" },
  { icon: <MessageCircle size={20} />, label: "WhatsApp", href: "https://wa.me/6289681047082?text=Halo%20Koneksi%20Warna%2C%20saya%20tertarik%20dengan%20layanan%20fotografi." },
];

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200/60 shadow-[0_-2px_20px_rgba(0,0,0,.05)] safe-area-bottom">
      <ul className="flex items-center justify-around h-16 px-2">
        {items.map(item => (
          <li key={item.label} className="flex-1">
            <a href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="flex flex-col items-center gap-0.5 py-1 text-gray-500 hover:text-accent active:text-accent transition-colors duration-150 rounded-lg group">
              <span className="transition-transform duration-200 group-active:scale-90">{item.icon}</span>
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

