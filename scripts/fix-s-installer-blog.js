/**
 * Restores French accents in blog article where U+FFFD replaced mojibake.
 * Run from repo root: node expatalgarve-fr/scripts/fix-s-installer-blog.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const htmlPath = path.join(
  root,
  "blog/s-installer-algarve-retraite-francais-guide-2026/index.html"
);
const badPath = path.join(root, "tools-tokens.json");
const goodPath = path.join(__dirname, "s-installer-good-words.txt");

const bad = JSON.parse(fs.readFileSync(badPath, "utf8"));
const good = fs.readFileSync(goodPath, "utf8").trim().split(/\r?\n/);

if (bad.length !== good.length) {
  console.error("Length mismatch", bad.length, good.length);
  process.exit(1);
}

let s = fs.readFileSync(htmlPath, "utf8");

const pairs = bad.map((b, i) => [b, good[i]]).sort((a, b) => b[0].length - a[0].length);

for (const [b, g] of pairs) {
  if (b === g) continue;
  if (!s.includes(b)) continue;
  s = s.split(b).join(g);
}

/* Remaining spaced FFFD: mostly "à", except footer dash */
s = s.replace(/Expat Algarve Assistance \uFFFD Mention/g, "Expat Algarve Assistance — Mention");
s = s.replace(/ \uFFFD /g, " à ");

/* Copyright line */
s = s.replace(/^(\s*)\uFFFD <span id="year"/m, "$1© <span id=\"year\"");

/* Step headings & FAQ */
s = s.replace(/<h2>étape/gi, "<h2>Étape");
s = s.replace(/Étape ([1-7]) \? le/g, "Étape $1 — le");
s = s.replace(/Étape ([1-7]) \? la/g, "Étape $1 — la");
s = s.replace(/<h2>FAQ \? les/g, "<h2>FAQ : les");

/* Week ranges */
s = s.replace(/Semaine 1\?2/g, "Semaine 1–2");
s = s.replace(/Semaine 3\?6/g, "Semaine 3–6");
s = s.replace(/Semaine 7\?12/g, "Semaine 7–12");

/* Inline punctuation (question mark used as dash) */
s = s.replace(/\) \? sans/g, ") — sans");
s = s.replace(/coup \? ou/g, "coup — ou");
s = s.replace(/début \? mais/g, "début — mais");
s = s.replace(/fréquentes \? puis/g, "fréquentes ; puis");
s = s.replace(/profils différents \? elles/g, "profils différents : elles");
s = s.replace(/plus présente \? sans/g, "plus présente — sans");
s = s.replace(/si vous en avez les moyens \? ce/g, "si vous en avez les moyens — ce");
s = s.replace(/sur vos instructions \? sans/g, "sur vos instructions — sans");
s = s.replace(/a dit \? sans/g, "a dit — sans");
s = s.replace(/Portugal \? préparation/g, "Portugal — préparation");
s = s.replace(/certificat de vie \? service/g, "certificat de vie ; service");
s = s.replace(/compte bancaire Portugal \? service/g, "compte bancaire Portugal ; service");
s = s.replace(/l'angoisse \? sans/g, "l'angoisse — sans");
s = s.replace(/rendez-vous \? pas de/g, "rendez-vous — pas de");
s = s.replace(/risque moyen \/ risque \uFFFDlev\uFFFD/g, "risque moyen / risque élevé");
s = s.replace(/risque élevé" \? pas/g, "risque élevé\" — pas");

const left = (s.match(/\uFFFD/g) || []).length;
if (left) console.warn("Remaining U+FFFD count:", left);

fs.writeFileSync(htmlPath, s, "utf8");
console.log("Updated", htmlPath);
