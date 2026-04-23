import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = __dirname;
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const server = http.createServer((req, res) => {
  let u = decodeURIComponent((req.url || "").split("?")[0]);
  if (u === "/") u = "/index.html";
  const rel = u.startsWith("/") ? u.slice(1) : u;
  const p = path.join(root, rel);
  if (!p.startsWith(root)) {
    res.writeHead(403);
    return res.end();
  }
  fs.stat(p, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404);
      return res.end("Not found");
    }
    const ext = path.extname(p);
    res.setHeader("Content-Type", mime[ext] || "application/octet-stream");
    fs.createReadStream(p).pipe(res);
  });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
server.listen(PORT, "127.0.0.1", () => {
  console.log(`http://127.0.0.1:${PORT}/          (index.html)`);
  console.log(`http://127.0.0.1:${PORT}/brewo.html`);
});
