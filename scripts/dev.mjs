import { spawn } from "node:child_process";
const incoming = process.argv.slice(2);
// Managed preview supplies --strictPort; inspect the production export there.
// Normal `npm run dev` still starts the Next.js development server.
const managedPreview = incoming.includes("--strictPort");
const args = incoming.filter((arg) => arg !== "--strictPort");
const command = managedPreview
  ? ["scripts/serve.mjs", ...args]
  : [
      "node_modules/next/dist/bin/next",
      "dev",
      "--webpack",
      ...args.map((arg) => (arg === "--host" ? "--hostname" : arg)),
    ];
const child = spawn(process.execPath, command, {
  stdio: "inherit",
  env: process.env,
});
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code ?? 0));
