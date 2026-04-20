/**
 * Repair U+FFFD mojibake in blog HTML files (UTF-8).
 * node expatalgarve-fr/scripts/fix-blog-fffd.js
 */
const fs = require("fs");
const path = require("path");
const extraPairs = require("./blog-fffd-extra-pairs");

const root = path.join(__dirname, "..");
const badPath = path.join(root, "tools-tokens.json");
const goodPath = path.join(__dirname, "s-installer-good-words.txt");

const bad = JSON.parse(fs.readFileSync(badPath, "utf8"));
const good = fs.readFileSync(goodPath, "utf8").trim().split(/\r?\n/);
if (bad.length !== good.length) {
  console.error("Length mismatch", bad.length, good.length);
  process.exit(1);
}

const basePairs = bad.map((b, i) => [b, good[i]]);
const pairMap = new Map(basePairs);
for (const [b, g] of extraPairs) {
  pairMap.set(b, g);
}
const pairs = [...pairMap.entries()].sort((a, b) => b[0].length - a[0].length);

function applyWordPairs(s) {
  for (const [b, g] of pairs) {
    if (b === g) continue;
    if (!s.includes(b)) continue;
    s = s.split(b).join(g);
  }
  return s;
}

function commonBlogFooter(s) {
  s = s.replace(/Expat Algarve Assistance \uFFFD Mention/g, "Expat Algarve Assistance — Mention");
  s = s.replace(/ \uFFFD /g, " à ");
  s = s.replace(/^(\s*)\uFFFD <span id="year"/m, "$1© <span id=\"year\"");
  return s;
}

function fixSInstallerArticle(s) {
  s = s.replace(/<h2>étape/gi, "<h2>Étape");
  s = s.replace(/Étape ([1-7]) \? le/g, "Étape $1 — le");
  s = s.replace(/Étape ([1-7]) \? la/g, "Étape $1 — la");
  s = s.replace(/<h2>FAQ \? les/g, "<h2>FAQ : les");
  s = s.replace(/Semaine 1\?2/g, "Semaine 1–2");
  s = s.replace(/Semaine 3\?6/g, "Semaine 3–6");
  s = s.replace(/Semaine 7\?12/g, "Semaine 7–12");
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
  return s;
}

function fixTemoignages(s) {
  s = s.replace(/<h2>(\d+)\. \uFFFD /g, "<h2>$1. « ");
  s = s.replace(/ \uFFFD \? /g, " » — ");
  return s;
}

function fixCrueCompteCert(s) {
  s = s.replace(/sans confusion \? et/g, "sans confusion — et");
  s = s.replace(/o\uFFFD prendre/g, "où prendre");
  s = s.replace(/tous les deux \? mais/g, "tous les deux — mais");
  s = s.replace(/existent \? la banque/g, "existent — la banque");
  s = s.replace(/Pack installation<\/a> \uFFFD/g, "Pack installation</a> —");
  s = s.replace(/T\uFFFDmoignages \(blog\)<\/a> \uFFFD/g, "Témoignages (blog)</a> —");
  s = s.replace(/une m\uFFFDthode \? et/g, "une méthode — et");
  return s;
}

const jobs = [
  {
    rel: "blog/s-installer-algarve-retraite-francais-guide-2026/index.html",
    beforeCommon: null,
    post: fixSInstallerArticle,
  },
  {
    rel: "blog/vie-retraite-algarve-temoignages/index.html",
    beforeCommon: fixTemoignages,
    post: null,
  },
  {
    rel: "blog/crue-portugal-guide-francais/index.html",
    beforeCommon: null,
    post: fixCrueCompteCert,
  },
  {
    rel: "blog/compte-bancaire-portugal-expatrie/index.html",
    beforeCommon: null,
    post: fixCrueCompteCert,
  },
  {
    rel: "blog/certificat-vie-portugal-retraite/index.html",
    beforeCommon: null,
    post: fixCrueCompteCert,
  },
];

for (const { rel, beforeCommon, post } of jobs) {
  const htmlPath = path.join(root, rel);
  if (!fs.existsSync(htmlPath)) {
    console.warn("Skip missing", rel);
    continue;
  }
  let s = fs.readFileSync(htmlPath, "utf8");
  if (!s.includes("\uFFFD")) {
    console.log("OK (no FFFD)", rel);
    continue;
  }
  s = applyWordPairs(s);
  if (beforeCommon) s = beforeCommon(s);
  s = commonBlogFooter(s);
  if (post) s = post(s);
  const left = (s.match(/\uFFFD/g) || []).length;
  if (left) console.warn("Remaining FFFD", left, rel);
  fs.writeFileSync(htmlPath, s, "utf8");
  console.log("Updated", rel);
}
