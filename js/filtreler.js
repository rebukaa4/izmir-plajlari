// Kullanıcı dostu plaj filtreleri — şehir sayfası ve plaj listesi aynı tanımları kullanır.
// Birden fazla filtre seçilirse plaj HEPSİNE uymalı. "karsit" olan iki filtre aynı anda seçilemez.
const SIG = p => p.derinlik === "Sığ" || p.derinlik === "Çok Sığ";
const COCUGA_UYGUN_DEGIL = /uygun değil|pek tercih edilmiyor|tercih edilmiyor|zorlayıcı/i;

const PLAJ_FILTRELERI = [
  { anahtar: "kumlu", ikon: "🏖️", etiket: "fSandy", test: p => /kum/i.test(p.zemin || "") },
  { anahtar: "tasli", ikon: "🪨", etiket: "fRocky", test: p => /taşlık|çakıl/i.test(p.zemin || "") },
  { anahtar: "sig", ikon: "🌊", etiket: "fShallow", karsit: "derin", test: SIG },
  { anahtar: "derin", ikon: "🤿", etiket: "fDeep", karsit: "sig", test: p => p.derinlik === "Derin" },
  { anahtar: "cocuk", ikon: "👨‍👩‍👧", etiket: "qKids", test: p => SIG(p) && !COCUGA_UYGUN_DEGIL.test(p.cocukUygun || "") },
  { anahtar: "park", ikon: "🅿️", etiket: "qFreePark", test: p => p.park === "ucretsiz" },
  { anahtar: "dus", ikon: "🚿", etiket: "qShower", test: p => p.dus === true },
  { anahtar: "mavi", ikon: "🏳️", etiket: "qBlueFlag", test: p => /mavi bayrak/i.test(`${p.temizlik} ${p.notlar}`) }
];

// Eski bağlantılar (ana sayfa kısayolları) bozulmasın
const FILTRE_TAKMA_AD = { kumsal: "kumlu" };

function filtreBul(anahtar) {
  anahtar = FILTRE_TAKMA_AD[anahtar] || anahtar;
  return PLAJ_FILTRELERI.find(f => f.anahtar === anahtar);
}

function plajFiltreyeUyar(p, anahtarlar) {
  return anahtarlar.every(a => { const f = filtreBul(a); return !f || f.test(p); });
}

function filtreParametresiOku(params) {
  return (params.get("ozellik") || "").split(",").map(a => FILTRE_TAKMA_AD[a] || a).filter(a => filtreBul(a));
}
