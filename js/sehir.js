// Şehir sayfası: ilçeler + "Nasıl bir plaj istersiniz?" filtreleri.
// Filtre seçildikçe, uyan plajı olmayan ilçeler gizlenir; kalanların sayısı güncellenir.

dilSeciciOlustur("dil-secici");
applyI18n();

const params = new URLSearchParams(location.search);
const il = params.get("il") || "";
const sehirPlajlari = PLAJLAR.filter(p => p.il === il);
if (!sehirPlajlari.length) location.replace("index.html");

// Şehir başlık fotoğrafları (manzara, yüz yok) — ana sayfadaki şehir seçimiyle aynı
const SEHIR_FOTO = { "İzmir": [2, 0], "Aydın": [43, 0], "Muğla": [55, 0], "Antalya": [74, 0] };

let secili = filtreParametresiOku(params);

// ---------- Başlık ----------
document.getElementById("sehir-adi").textContent = il;
document.getElementById("sehir-alt").textContent = `${sehirPlajlari.length} ${t("beachSuffix")}`;
document.title = `${il} — ${document.title}`;
const baslik = document.getElementById("sehir-baslik");
const fotoSecimi = SEHIR_FOTO[il];
const kapakPlaj = fotoSecimi ? PLAJLAR.find(p => p.id === fotoSecimi[0]) : sehirPlajlari.find(p => p.fotograflar && p.fotograflar.length);
const kapak = kapakPlaj && kapakPlaj.fotograflar[fotoSecimi ? fotoSecimi[1] : 0];
if (kapak) {
  const tam = src => `url("${new URL(src, location.href).href}")`;
  if (KAPAK_ONIZLEME[kapak]) baslik.style.setProperty("--kapak", `url(${KAPAK_ONIZLEME[kapak]})`);
  const im = new Image();
  im.onload = () => baslik.style.setProperty("--kapak", tam(im.src));
  im.src = kucukFoto(kapak);
}

// ---------- İlçeler (en çok plajı olan önce) ----------
const ilceler = [...new Set(sehirPlajlari.map(p => p.ilce))]
  .map(ilce => ({ ilce, plajlar: sehirPlajlari.filter(p => p.ilce === ilce) }))
  .sort((a, b) => b.plajlar.length - a.plajlar.length || a.ilce.localeCompare(b.ilce, "tr"));

const ilceKutusu = document.getElementById("ilce-kartlari");
const ilceKartlari = ilceler.map(({ ilce, plajlar }, i) => {
  const a = document.createElement("a");
  a.className = "ilce-karti";
  a.style.setProperty("--sira", i);
  const foto = (plajlar.find(p => p.fotograflar && p.fotograflar.length) || {}).fotograflar;
  a.innerHTML = `
    ${foto ? `<img src="${kucukFoto(foto[0])}" alt="" loading="lazy" decoding="async" onload="this.classList.add('yuklendi')">` : ""}
    <span class="ilce-karti-ad">${ilce}</span>
    <span class="ilce-karti-sayi"></span>`;
  ilceKutusu.appendChild(a);
  return { a, ilce, plajlar };
});

// ---------- Filtre çipleri ----------
const cipKutusu = document.getElementById("filtre-cipleri");
const temizle = document.getElementById("filtre-temizle");
const tumuButon = document.getElementById("tum-sehir-plajlari");
const bosMesaj = document.getElementById("filtre-bos");

PLAJ_FILTRELERI.forEach(f => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "filtre-cip";
  b.dataset.anahtar = f.anahtar;
  b.innerHTML = `<span class="filtre-cip-ikon">${f.ikon}</span><span>${t(f.etiket)}</span><span class="filtre-cip-sayi"></span>`;
  b.addEventListener("click", () => {
    if (secili.includes(f.anahtar)) secili = secili.filter(a => a !== f.anahtar);
    else secili = secili.filter(a => !(f.karsit || []).includes(a)).concat(f.anahtar);
    guncelle();
  });
  cipKutusu.appendChild(b);
});

temizle.addEventListener("click", () => { secili = []; guncelle(); });

function filtreSorgusu(liste) {
  return liste.length ? `&ozellik=${liste.join(",")}` : "";
}

function guncelle() {
  const uyanlar = sehirPlajlari.filter(p => plajFiltreyeUyar(p, secili));
  let gorunen = 0;

  ilceKartlari.forEach(({ a, ilce, plajlar }) => {
    const n = plajlar.filter(p => plajFiltreyeUyar(p, secili)).length;
    a.classList.toggle("gizli", n === 0);
    a.setAttribute("aria-hidden", n === 0 ? "true" : "false");
    a.tabIndex = n === 0 ? -1 : 0;
    a.querySelector(".ilce-karti-sayi").textContent = `${n} ${t("beachSuffix")}`;
    a.href = `liste.html?il=${encodeURIComponent(il)}&ilce=${encodeURIComponent(ilce)}${filtreSorgusu(secili)}`;
    if (n) gorunen++;
  });

  // Her çipin yanında: bu şehirde o özelliğe sahip plaj sayısı (diğer seçimlerden bağımsız, sabit)
  cipKutusu.querySelectorAll(".filtre-cip").forEach(b => {
    const a = b.dataset.anahtar;
    const acik = secili.includes(a);
    const n = sehirPlajlari.filter(p => plajFiltreyeUyar(p, [a])).length;
    b.classList.toggle("secili", acik);
    b.classList.toggle("bos", n === 0);
    b.disabled = !acik && n === 0;
    b.setAttribute("aria-pressed", acik ? "true" : "false");
    b.querySelector(".filtre-cip-sayi").textContent = n;
  });

  bosMesaj.hidden = gorunen > 0;
  temizle.hidden = secili.length === 0;
  tumuButon.textContent = t("showAllBeaches", uyanlar.length);
  tumuButon.href = `liste.html?il=${encodeURIComponent(il)}${filtreSorgusu(secili)}`;
  tumuButon.classList.toggle("pasif", uyanlar.length === 0);

  // Adres çubuğu da güncel kalsın (geri gelindiğinde seçim korunur)
  const u = new URL(location.href);
  if (secili.length) u.searchParams.set("ozellik", secili.join(",")); else u.searchParams.delete("ozellik");
  history.replaceState(null, "", u);
}

guncelle();
