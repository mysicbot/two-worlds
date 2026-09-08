import { copyFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2] || "dist/client";
const index = join(dir, "index.html");
const shell = join(dir, "_shell.html");

if (!existsSync(index) && existsSync(shell)) {
  copyFileSync(shell, index);
}

if (!existsSync(index)) {
  throw new Error(`GitHub Pages build is missing ${index}`);
}

copyFileSync(index, join(dir, "404.html"));
writeFileSync(join(dir, ".nojekyll"), "");
console.log(`GitHub Pages bundle ready in ${dir}`);
