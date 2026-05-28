const Database = require("better-sqlite3");
const db = new Database("/app/koneksi.db");
console.log("Seeding...");

// Packages
const ip = db.prepare("INSERT INTO packages (title, price, benefits, featured) VALUES (?,?,?,?)");
ip.run("Basic Session","Mulai Rp 500.000",JSON.stringify(["1 jam sesi","1 lokasi","20 foto edited"]),0);
ip.run("Couple / Prewedding","Mulai Rp 1.200.000",JSON.stringify(["2-3 jam sesi","2 lokasi","50+ foto edited","Album digital"]),1);
ip.run("Wedding / Event","Mulai Rp 2.500.000",JSON.stringify(["Full day","Unlimited foto","400+ edited","Album cetak"]),1);

// Testimonials
const it = db.prepare("INSERT INTO testimonials (text, author, rating) VALUES (?,?,?)");
for (const t of [
  ["Hasil fotonya bening dan natural! Recommended!","Sari A.",5],
  ["Sesi prewedding jadi momen tak terlupakan.","Rina & Budi",5],
  ["Basic session cepet, rapi, harga bersahabat.","Dimas P.",4],
  ["Dokumentasi wedding keren abis!","Maya & Adi",5],
  ["Fotografer ramah, hasil elegan.","Tika R.",5],
  ["Anak-anak betah difoto, hasil candid natural.","Bunda Eva",4],
  ["Proses cepat, hasil premium!","Gilang S.",5],
]) it.run(t[0],t[1],t[2]);

// Works
const cats = db.prepare("SELECT id, slug FROM categories").all();
const cmap = {}; cats.forEach(function(c){ cmap[c.slug] = c.id; });
const iw = db.prepare("INSERT INTO works (title, category_id, image_url, featured, sort_order) VALUES (?,?,?,?,?)");
const seeds = {
  wisuda: ["https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600","https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600","https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600","https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600","https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600"],
  prewedding: ["https://images.unsplash.com/photo-1519741497674-611481863552?w=600","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600","https://images.unsplash.com/photo-1529636798458-92182e662485?w=600"],
  wedding: ["https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600","https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600","https://images.unsplash.com/photo-1795409834-ef04bbd61622?w=600","https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600"],
  event: ["https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600","https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600","https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600"],
  portrait: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600","https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600","https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600"],
};
let order = 0;
for (const slug of Object.keys(seeds)) {
  const urls = seeds[slug];
  for (let i = 0; i < urls.length; i++) {
    const title = slug.charAt(0).toUpperCase() + slug.slice(1) + " " + (i+1);
    iw.run(title, cmap[slug], urls[i] + "&sig=" + i, i < 2 ? 1 : 0, order++);
  }
}
console.log("Works:", db.prepare("SELECT COUNT(*) as c FROM works").get().c);
console.log("Packages:", db.prepare("SELECT COUNT(*) as c FROM packages").get().c);
console.log("Testimonials:", db.prepare("SELECT COUNT(*) as c FROM testimonials").get().c);
