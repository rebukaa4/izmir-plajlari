// Her plaj fotoğrafı için hızlı yüklenen küçük kopya (images/<plaj>/k/<ad>.webp)
// ve kapak fotoğrafları için minik bulanık önizleme (js/kapaklar.js) üretir.
// Kullanım: node araclar/kucuk-foto-uret.js   (ffmpeg gerekir; var olanları atlar)
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const KOK = path.join(__dirname, "..");
const kaynak = fs.readFileSync(path.join(KOK, "js/data.js"), "utf8").replace(/^const PLAJLAR/m, "var PLAJLAR");
const PLAJLAR = new Function(kaynak + "; return PLAJLAR;")();

const kucukYol = f => f.replace(/^images\/([^/]+)\/(.+)\.\w+$/, "images/$1/k/$2.webp");
const ff = (girdi, cikti, genislik, kalite) =>
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", girdi, "-vf", `scale='min(${genislik},iw)':-2`, "-q:v", String(kalite), cikti]);

let uretilen = 0;
const kapaklar = {};
for (const p of PLAJLAR) {
  (p.fotograflar || []).forEach((f, i) => {
    const giris = path.join(KOK, f), cikis = path.join(KOK, kucukYol(f));
    if (!fs.existsSync(giris)) return console.warn("Eksik foto:", f);
    if (!fs.existsSync(cikis)) {
      fs.mkdirSync(path.dirname(cikis), { recursive: true });
      ff(giris, cikis, 720, 72);
      uretilen++;
    }
    if (i === 0) {
      const tmp = path.join(require("os").tmpdir(), "lqip.webp");
      ff(giris, tmp, 24, 50);
      kapaklar[f] = "data:image/webp;base64," + fs.readFileSync(tmp).toString("base64");
    }
  });
}
fs.writeFileSync(path.join(KOK, "js/kapaklar.js"),
  "// Otomatik üretildi (araclar/kucuk-foto-uret.js) — elle düzenlemeyin\nconst KAPAK_ONIZLEME = " + JSON.stringify(kapaklar) + ";\n" +
  String.raw`function kucukFoto(f) { return f.replace(/^images\/([^/]+)\/(.+)\.\w+$/, "images/$1/k/$2.webp"); }` + "\n");
console.log("Üretilen küçük foto:", uretilen, "| kapak önizleme:", Object.keys(kapaklar).length);
