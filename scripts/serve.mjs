// Serve the production static export. No runtime server/database is required.
import http from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";
const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const root = path.resolve("out");
if (!existsSync(path.join(root, "index.html"))) {
  console.error("Run npm run build before starting the production preview.");
  process.exit(1);
}
const port = Number(flag("--port", process.env.PORT || "3000"));
const host = flag("--host", process.env.HOST || "0.0.0.0");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
};
http
  .createServer((req, res) => {
    try {
      const pathname = decodeURIComponent(
        new URL(req.url || "/", "http://localhost").pathname,
      );
      let file = path.resolve(root, "." + pathname);
      if (file !== root && !file.startsWith(root + path.sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      if (existsSync(file) && statSync(file).isDirectory())
        file = path.join(file, "index.html");
      if (!existsSync(file) || !statSync(file).isFile()) {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        createReadStream(path.join(root, "404.html")).pipe(res);
        return;
      }
      res.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
        "Content-Length": statSync(file).size,
      });
      if (req.method === "HEAD") res.end();
      else createReadStream(file).pipe(res);
    } catch {
      res.writeHead(400);
      res.end("Bad request");
    }
  })
  .listen(port, host, () =>
    console.log(`Wedding invitation available at http://${host}:${port}`),
  );
