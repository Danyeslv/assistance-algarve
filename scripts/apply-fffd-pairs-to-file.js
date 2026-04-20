/** Usage: node apply-fffd-pairs-to-file.js <relative-path-from-expatalgarve-fr> */
const fs = require("fs");
const path = require("path");
const extraPairs = require("./blog-fffd-extra-pairs");

const root = path.join(__dirname, "..");
const rel = process.argv[2];
if (!rel) {
  console.error("Missing path arg");
  process.exit(1);
}
const htmlPath = path.join(root, rel);
const bad = JSON.parse(fs.readFileSync(path.join(root, "tools-tokens.json"), "utf8"));
const good = fs.readFileSync(path.join(__dirname, "s-installer-good-words.txt"), "utf8").trim().split(/\r?\n/);
const pairMap = new Map(bad.map((b, i) => [b, good[i]]));
for (const [b, g] of extraPairs) pairMap.set(b, g);
const pairs = [...pairMap.entries()].sort((a, b) => b[0].length - a[0].length);

let s = fs.readFileSync(htmlPath, "utf8");
const before = (s.match(/\uFFFD/g) || []).length;
for (const [b, g] of pairs) {
  if (b === g) continue;
  if (s.includes(b)) s = s.split(b).join(g);
}
s = s.replace(/Expat Algarve Assistance \uFFFD Mention/g, "Expat Algarve Assistance — Mention");
s = s.replace(/ \uFFFD /g, " à ");
s = s.replace(/^(\s*)\uFFFD <span id="year"/m, "$1© <span id=\"year\"");
const after = (s.match(/\uFFFD/g) || []).length;
fs.writeFileSync(htmlPath, s, "utf8");
console.log(htmlPath, "FFFD", before, "->", after);
