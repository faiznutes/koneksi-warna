const express = require("express");
const Database = require("better-sqlite3");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;
const UPLOADS_DIR = path.join(__dirname, "uploads");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

// === DATABASE ===
const db = new Database(path.join(__dirname, "koneksi.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
  CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL);
  CREATE TABLE IF NOT EXISTS works (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL DEFAULT "", category_id INTEGER, image_url TEXT NOT NULL DEFAULT "", featured INTEGER DEFAULT 0, sort_order INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime("now")), FOREIGN KEY (category_id) REFERENCES categories(id));
  CREATE TABLE IF NOT EXISTS services (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL DEFAULT "", description TEXT DEFAULT "", icon TEXT DEFAULT "Camera", image_url TEXT DEFAULT "", sort_order INTEGER DEFAULT 0);
  CREATE TABLE IF NOT EXISTS packages (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL DEFAULT "", price TEXT DEFAULT "", benefits TEXT DEFAULT "[]", featured INTEGER DEFAULT 0, sort_order INTEGER DEFAULT 0);
  CREATE TABLE IF NOT EXISTS testimonials (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT DEFAULT "", author TEXT DEFAULT "", rating INTEGER DEFAULT 5);
`);

function seed() {
  if (db.prepare("SELECT COUNT(*) as c FROM categories").get().c === 0) {
    const ins = db.prepare("INSERT INTO categories (name, slug) VALUES (?, ?)");
    for (const c of ["wisuda","prewedding","wedding","event","portrait"]) ins.run(c.charAt(0).toUpperCase() + c.slice(1), c);
  }
  if (db.prepare("SELECT COUNT(*) as c FROM services").get().c === 0) {
    const ins = db.prepare("INSERT INTO services (title, description, icon, image_url) VALUES (?,?,?,?)");
    const d = [
      ["Foto Wisuda","Potret wisuda elegan","Camera","https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800"],
      ["Foto Prewedding","Foto romantis di Surabaya","Heart","https://images.unsplash.com/photo-1529636798458-92182e662485?w=800"],
      ["Dokumentasi Wedding","Liputan sinematik","Star","https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800"],
      ["Sesi Engagement","Momen tunangan","Heart","https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800"],
      ["Portrait Keluarga","Kehangatan keluarga","Users","https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800"],
      ["Foto Event","Dokumentasi acara","Camera","https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800"],
    ];
    for (const s of d) ins.run(...s);
  }
}
seed();

// === MULTER ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")),
});
const upload = multer({ storage });

// Helper: auto-convert to WebP after multer
async function webpify(file) {
  if (!file) return file;
  const ext = path.extname(file.path).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".tiff", ".bmp"].includes(ext)) return file;
  const wp = file.path.substring(0, file.path.lastIndexOf(".")) + ".webp";
  try {
    await sharp(file.path).webp({ quality: 82 }).toFile(wp);
    fs.unlinkSync(file.path);
    file.path = wp;
    file.filename = path.basename(wp);
    file.mimetype = "image/webp";
  } catch (e) { console.error("WebP:", e.message); }
  return file;
}

// === HELPERS ===
function ok(res, data) { res.json({ ok: true, data }); }
function fail(res, msg, code = 400) { res.status(code).json({ ok: false, error: msg }); }

// === ROUTES ===
app.get("/api/settings", (req, res) => {
  const rows = db.prepare("SELECT key, value FROM settings").all();
  const obj = {}; for (const r of rows) obj[r.key] = r.value;
  obj.categories = db.prepare("SELECT * FROM categories ORDER BY id").all();
  ok(res, obj);
});
app.post("/api/settings", (req, res) => {
  if (!req.body.key) return fail(res, "key required");
  db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(req.body.key, String(req.body.value));
  ok(res, { key: req.body.key });
});
app.post("/api/settings/batch", (req, res) => {
  if (!req.body.settings) return fail(res, "settings required");
  const upsert = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
  db.transaction(() => { for (const [k, v] of Object.entries(req.body.settings)) upsert.run(k, String(v)); })();
  ok(res, { updated: Object.keys(req.body.settings).length });
});

app.get("/api/categories", (req, res) => ok(res, db.prepare("SELECT * FROM categories ORDER BY id").all()));
app.post("/api/categories", (req, res) => {
  try { const r = db.prepare("INSERT INTO categories (name, slug) VALUES (?,?)").run(req.body.name, req.body.slug); ok(res, { id: r.lastInsertRowid }); }
  catch (e) { fail(res, "Slug must be unique"); }
});
app.delete("/api/categories/:id", (req, res) => {
  db.prepare("DELETE FROM categories WHERE id = ?").run(req.params.id);
  db.prepare("UPDATE works SET category_id = NULL WHERE category_id = ?").run(req.params.id);
  ok(res, { deleted: req.params.id });
});

app.get("/api/works", (req, res) => {
  let sql = "SELECT w.*, c.name as category_name FROM works w LEFT JOIN categories c ON w.category_id = c.id WHERE 1=1";
  const p = [];
  if (req.query.category) { sql += " AND c.slug = ?"; p.push(req.query.category); }
  if (req.query.featured === "1") sql += " AND w.featured = 1";
  sql += " ORDER BY w.sort_order ASC, w.created_at DESC";
  ok(res, db.prepare(sql).all(...p));
});
app.get("/api/works/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM works WHERE id = ?").get(req.params.id);
  if (!row) return fail(res, "Not found", 404);
  ok(res, row);
});
app.post("/api/works", upload.single("image"), async (req, res) => {
  await webpify(req.file);
  const img = req.file ? "/uploads/" + req.file.filename : (req.body.image_url || "");
  const r = db.prepare("INSERT INTO works (title, category_id, image_url, featured, sort_order) VALUES (?,?,?,?,?)").run(
    req.body.title || "", req.body.category_id || null, img, req.body.featured === "1" ? 1 : 0, req.body.sort_order || 0
  );
  ok(res, { id: r.lastInsertRowid });
});
app.put("/api/works/:id", upload.single("image"), async (req, res) => {
  const e = db.prepare("SELECT * FROM works WHERE id = ?").get(req.params.id);
  if (!e) return fail(res, "Not found", 404);
  await webpify(req.file);
  const img = req.file ? "/uploads/" + req.file.filename : (req.body.image_url !== undefined ? req.body.image_url : e.image_url);
  db.prepare("UPDATE works SET title=?, category_id=?, image_url=?, featured=?, sort_order=? WHERE id=?").run(
    req.body.title || e.title, req.body.category_id ?? e.category_id, img, req.body.featured === "1" ? 1 : (req.body.featured === "0" ? 0 : e.featured), req.body.sort_order ?? e.sort_order, req.params.id
  );
  ok(res, { id: Number(req.params.id) });
});
app.delete("/api/works/:id", (req, res) => {
  const row = db.prepare("SELECT image_url FROM works WHERE id = ?").get(req.params.id);
  if (row && row.image_url && row.image_url.startsWith("/uploads/")) {
    const fp = path.join(UPLOADS_DIR, path.basename(row.image_url));
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
  db.prepare("DELETE FROM works WHERE id = ?").run(req.params.id);
  ok(res, { deleted: req.params.id });
});

app.get("/api/services", (req, res) => ok(res, db.prepare("SELECT * FROM services ORDER BY sort_order ASC, id ASC").all()));
app.post("/api/services", upload.single("image"), async (req, res) => {
  await webpify(req.file);
  const img = req.file ? "/uploads/" + req.file.filename : (req.body.image_url || "");
  const r = db.prepare("INSERT INTO services (title, description, icon, image_url) VALUES (?,?,?,?)").run(req.body.title, req.body.description, req.body.icon || "Camera", img);
  ok(res, { id: r.lastInsertRowid });
});
app.put("/api/services/:id", upload.single("image"), async (req, res) => {
  const e = db.prepare("SELECT * FROM services WHERE id = ?").get(req.params.id);
  if (!e) return fail(res, "Not found", 404);
  await webpify(req.file);
  const img = req.file ? "/uploads/" + req.file.filename : (req.body.image_url !== undefined ? req.body.image_url : e.image_url);
  db.prepare("UPDATE services SET title=?, description=?, icon=?, image_url=? WHERE id=?").run(
    req.body.title || e.title, req.body.description ?? e.description, req.body.icon || e.icon, img, req.params.id
  );
  ok(res, { id: Number(req.params.id) });
});
app.delete("/api/services/:id", (req, res) => { db.prepare("DELETE FROM services WHERE id = ?").run(req.params.id); ok(res, { deleted: req.params.id }); });

app.get("/api/packages", (req, res) => {
  ok(res, db.prepare("SELECT * FROM packages ORDER BY sort_order ASC, id ASC").all().map(r => ({ ...r, benefits: JSON.parse(r.benefits) })));
});
app.post("/api/packages", (req, res) => {
  const r = db.prepare("INSERT INTO packages (title, price, benefits, featured) VALUES (?,?,?,?)").run(
    req.body.title, req.body.price || "", JSON.stringify(req.body.benefits || []), req.body.featured ? 1 : 0
  );
  ok(res, { id: r.lastInsertRowid });
});
app.put("/api/packages/:id", (req, res) => {
  const e = db.prepare("SELECT * FROM packages WHERE id = ?").get(req.params.id);
  if (!e) return fail(res, "Not found", 404);
  db.prepare("UPDATE packages SET title=?, price=?, benefits=?, featured=? WHERE id=?").run(
    req.body.title || e.title, req.body.price ?? e.price, JSON.stringify(req.body.benefits ?? JSON.parse(e.benefits)),
    req.body.featured !== undefined ? (req.body.featured ? 1 : 0) : e.featured, req.params.id
  );
  ok(res, { id: Number(req.params.id) });
});
app.delete("/api/packages/:id", (req, res) => { db.prepare("DELETE FROM packages WHERE id = ?").run(req.params.id); ok(res, { deleted: req.params.id }); });

app.get("/api/testimonials", (req, res) => ok(res, db.prepare("SELECT * FROM testimonials ORDER BY id ASC").all()));
app.post("/api/testimonials", (req, res) => {
  const r = db.prepare("INSERT INTO testimonials (text, author, rating) VALUES (?,?,?)").run(req.body.text, req.body.author, req.body.rating || 5);
  ok(res, { id: r.lastInsertRowid });
});
app.put("/api/testimonials/:id", (req, res) => {
  const e = db.prepare("SELECT * FROM testimonials WHERE id = ?").get(req.params.id);
  if (!e) return fail(res, "Not found", 404);
  db.prepare("UPDATE testimonials SET text=?, author=?, rating=? WHERE id=?").run(
    req.body.text ?? e.text, req.body.author ?? e.author, req.body.rating ?? e.rating, req.params.id
  );
  ok(res, { id: Number(req.params.id) });
});
app.delete("/api/testimonials/:id", (req, res) => { db.prepare("DELETE FROM testimonials WHERE id = ?").run(req.params.id); ok(res, { deleted: req.params.id }); });

app.use("/admin", express.static(path.join(__dirname, "admin")));

app.listen(PORT, () => console.log("Koneksi Warna API on http://localhost:" + PORT));

