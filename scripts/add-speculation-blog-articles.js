const fs = require("fs");
const path = require("path");

const block = `    <script type="speculationrules">
      {
        "prerender": [{ "where": { "href_matches": "/contact/*" }, "eagerness": "moderate" }],
        "prefetch": [
          {
            "where": { "and": [{ "href_matches": "/*" }, { "not": { "href_matches": "/contact/merci/*" } }] },
            "eagerness": "conservative"
          }
        ]
      }
    </script>
`;

const dir = path.join(__dirname, "../blog");
const needleRe = /\s*<link rel="stylesheet" href="\.\.\/\.\.\/assets\/css\/styles\.css" \/>\r?\n/;

for (const name of fs.readdirSync(dir)) {
  if (name === "index.html") continue;
  const p = path.join(dir, name, "index.html");
  if (!fs.existsSync(p)) continue;
  let s = fs.readFileSync(p, "utf8");
  if (s.includes("speculationrules")) continue;
  if (!needleRe.test(s)) {
    console.warn("Unexpected layout:", p);
    continue;
  }
  s = s.replace(needleRe, (m) => m + block);
  fs.writeFileSync(p, s);
  console.log("Updated", path.relative(path.join(__dirname, ".."), p));
}
