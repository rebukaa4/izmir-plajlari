// Sade ana sayfa: arkada kayan plaj fotoğrafları, önde "Hangi şehirde?" sorusu ve şehir düğmeleri.

dilSeciciOlustur("dil-secici");

// Şehir sırası (uygulamada plajı olan şehirler bu sırayla gösterilir)
const SEHIR_SIRASI = ["İzmir", "Aydın", "Muğla", "Antalya"];

// ---------- Kayan vitrin fotoğrafları (elle seçilmiş manzaralar: [plaj id, fotoğraf sırası, kadraj]) ----------
const VITRIN_SECIMI = [[34, 0], [55, 0], [74, 0], [43, 0, "center 88%"], [2, 0], [51, 5], [70, 4]];
const vitrinFotolari = VITRIN_SECIMI
  .map(([id, i, konum]) => {
    const p = PLAJLAR.find(x => x.id === id);
    return p && p.fotograflar && p.fotograflar[i] ? { foto: p.fotograflar[i], konum } : null;
  })
  .filter(Boolean);

const slaytKutusu = document.getElementById("vitrin-slaytlar");
let aktifSlayt = 0, slaytZamani = null;

vitrinFotolari.forEach((v, i) => {
  const s = document.createElement("div");
  s.className = "vitrin-slayt";
  if (v.konum) s.style.backgroundPosition = v.konum;
  const onizleme = typeof KAPAK_ONIZLEME !== "undefined" && KAPAK_ONIZLEME[v.foto];
  if (onizleme) s.style.backgroundImage = `url(${onizleme})`;
  const img = new Image();
  img.decoding = "async";
  img.onload = () => {
    s.style.backgroundImage = `url(${img.src})`;
    s.classList.add("hazir");
    if (i === 0) perdeyiKapat();
  };
  if (i === 0) {
    img.fetchPriority = "high";
    img.src = kucukFoto(v.foto);
    const buyuk = new Image();
    buyuk.onload = () => { s.style.backgroundImage = `url(${buyuk.src})`; };
    setTimeout(() => { buyuk.src = v.foto; }, 1200);
  } else {
    setTimeout(() => { img.src = v.foto; }, 1500 + i * 400);
  }
  slaytKutusu.appendChild(s);
});

function slaytGoster(i) {
  aktifSlayt = i;
  slaytKutusu.querySelectorAll(".vitrin-slayt").forEach((s, j) => s.classList.toggle("aktif", j === i));
}

function slaytZamanla() {
  clearInterval(slaytZamani);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  slaytZamani = setInterval(() => slaytGoster((aktifSlayt + 1) % vitrinFotolari.length), 5200);
}

if (vitrinFotolari.length) { slaytGoster(0); slaytZamanla(); }

// ---------- Açılış perdesi: ilk fotoğraf gelince (en geç 1.6 sn) yumuşakça kalkar ----------
const perde = document.getElementById("giris-perde");
let perdeKapandi = false;
function perdeyiKapat() {
  if (perdeKapandi || !perde) return;
  perdeKapandi = true;
  document.body.classList.add("acildi");
  perde.classList.add("kapandi");
  setTimeout(() => perde.remove(), 700);
}
setTimeout(perdeyiKapat, 1600);

// ---------- Şehir düğmeleri ----------
const sehirKutusu = document.getElementById("sehir-dugmeleri");
const veriliSehirler = SEHIR_SIRASI.filter(il => PLAJLAR.some(p => p.il === il))
  .concat([...new Set(PLAJLAR.map(p => p.il))].filter(il => !SEHIR_SIRASI.includes(il)));

veriliSehirler.forEach((il, i) => {
  const sayi = PLAJLAR.filter(p => p.il === il).length;
  const a = document.createElement("a");
  a.className = "sehir-dugme";
  a.style.setProperty("--sira", i);
  a.href = `sehir.html?il=${encodeURIComponent(il)}`;
  a.innerHTML = `<span class="sehir-dugme-ad">${il}</span><span class="sehir-dugme-sayi">${sayi} ${t("beachSuffix")}</span><span class="sehir-dugme-ok" aria-hidden="true">›</span>`;
  sehirKutusu.appendChild(a);
});
