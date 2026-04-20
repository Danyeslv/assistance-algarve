const fs = require("fs");
const p = require("path").join(__dirname, "../blog/vie-retraite-algarve-temoignages/index.html");
let s = fs.readFileSync(p, "utf8");
const reps = [
  [
    `          <h2>1. à On a sous-estimé l'enchaînement des démarches à ? Nathalie, 64, Faro</h2>`,
    `          <h2>1. « On a sous-estimé l'enchaînement des démarches » — Nathalie, 64, Faro</h2>`,
  ],
  [
    `          <h2>2. à Le NIF m'a stressée avant même l'avion à ? Henri, 68, Lagos</h2>`,
    `          <h2>2. « Le NIF m'a stressée avant même l'avion » — Henri, 68, Lagos</h2>`,
  ],
  [
    `          <h2>3. à La santé : pas compliquée, mais il faut oser demander à ? Claire, 61, Tavira</h2>`,
    `          <h2>3. « La santé : pas compliquée, mais il faut oser demander » — Claire, 61, Tavira</h2>`,
  ],
  [
    `          <h2>4. à La voiture : notre montagne à ? Jean-Luc &amp; Martine, Portimão</h2>`,
    `          <h2>4. « La voiture : notre montagne » — Jean-Luc &amp; Martine, Portimão</h2>`,
  ],
  [
    `          <h2>5. à Le certificat de vie : une formalité qui devient urgente à ? Élise, 70, Albufeira</h2>`,
    `          <h2>5. « Le certificat de vie : une formalité qui devient urgente » — Élise, 70, Albufeira</h2>`,
  ],
];
for (const [a, b] of reps) {
  if (!s.includes(a)) throw new Error("Missing fragment:\n" + a);
  s = s.split(a).join(b);
}
fs.writeFileSync(p, s, "utf8");
console.log("Patched", p);
