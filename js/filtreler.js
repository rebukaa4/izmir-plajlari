// Kullanıcı dostu plaj filtreleri — şehir sayfası ve plaj listesi aynı tanımları kullanır.
// Birden fazla filtre seçilirse plaj HEPSİNE uymalı. "karsit" listesindeki filtrelerle aynı anda seçilemez.
const SIG = p => p.derinlik === "Sığ" || p.derinlik === "Çok Sığ";

// Çocuklu aileye uygunluk: önce plajın çocuklarla ilgili araştırılmış notu okunur, not yoksa derinliğe bakılır.
const COCUK_DERIN_UYARI = /(hızlı|hemen|çabuk|hızla) derinleş(?!mi)|uygun değil|pratik bir seçenek değil/i;
const COCUK_OLUMSUZ = /dikkat|pek tercih edilmiyor|tercih edilmiyor|zorlayıcı|çelişkili/i;
const COCUK_SIG_IFADE = /sığ|derinleşmiyor|yavaş (yavaş )?derinleş|hafifçe derinleş|kademeli|göğse kadar|bel hizası/i;
const COCUK_OLUMLU = /uygun|ideal|tercih ediliyor|güvenli|avantaj|aile/i;

function cocugaUygun(p) {
  const not = p.cocukUygun || "";
  if (COCUK_DERIN_UYARI.test(not) && !SIG(p)) return false;   // deniz hızlı derinleşiyorsa hayır (plaj genelinde sığ değilse)
  if (COCUK_SIG_IFADE.test(not)) return true;      // not açıkça sığ diyorsa evet
  if (COCUK_OLUMSUZ.test(not)) return false;
  if (COCUK_OLUMLU.test(not) && p.derinlik !== "Derin") return true;
  if (!not) return SIG(p);
  return false;
}

const PLAJ_FILTRELERI = [
  { anahtar: "kumlu", ikon: "🏖️", etiket: "fSandy", test: p => /kum/i.test(p.zemin || "") },
  { anahtar: "tasli", ikon: "🪨", etiket: "fRocky", test: p => /taşlık|çakıl/i.test(p.zemin || "") },
  { anahtar: "sig", ikon: "🌊", etiket: "fShallow", karsit: ["derin"], test: SIG },
  { anahtar: "derin", ikon: "🤿", etiket: "fDeep", karsit: ["sig", "cocuk"], test: p => p.derinlik === "Derin" },
  { anahtar: "cocuk", ikon: "👨‍👩‍👧", etiket: "qKids", karsit: ["derin"], test: cocugaUygun },
  { anahtar: "park", ikon: "🅿️", etiket: "qFreePark", test: p => p.park === "ucretsiz" },
  { anahtar: "dus", ikon: "🚿", etiket: "qShower", test: p => p.dus === true },
  { anahtar: "mavi", ikon: "🏳️", etiket: "qBlueFlag", test: p => /mavi bayrak/i.test(`${p.temizlik} ${p.notlar}`) }
];

// Eski bağlantılar (önceki ana sayfa kısayolları) bozulmasın
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
