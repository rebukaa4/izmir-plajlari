const TANINMISLIK_DESENI = /en ünlü|en popüler|en tanınmış|dünyaca ünlü|en gözde|en meşhur|\bödül|zoover|lonely planet/;
const NEGATIF_DESENI = /\bkirli\b|bakımsız|\bpis\b|temiz değil|şikayet/;

function plajMetniBirlestir(p) {
  return [p.temizlik, p.tuvaletNotu, p.notlar, p.kalabalik].filter(Boolean).join(" ").toLocaleLowerCase("tr-TR");
}

function plajYildizHesapla(p) {
  const metin = plajMetniBirlestir(p);
  let puan = 3;
  const maviBayrak = /mavi bayrak/.test(metin);
  const taninmis = TANINMISLIK_DESENI.test(metin);
  const negatif = NEGATIF_DESENI.test(metin);

  if (maviBayrak) puan += 1;
  if (taninmis) puan += 1;
  if (negatif) puan -= 1;

  puan = Math.max(2, Math.min(5, puan));
  return puan;
}

function yildizHtmlOlustur(yildizSayisi) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += i <= yildizSayisi ? "★" : "☆";
  }
  return html;
}
