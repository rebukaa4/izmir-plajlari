const listeEl = document.getElementById("plaj-liste");
const sonucSayisiEl = document.getElementById("sonuc-sayisi");
const filtrelerEl = document.getElementById("filtreler");
const aramaInput = document.getElementById("liste-arama-input");

dilSeciciOlustur("dil-secici");
applyI18n();

// Şehir → kart rengi eşlemesi (ana sayfadaki şehir kartlarıyla aynı)
const SEHIR_RENK = { "İzmir": "r5", "Aydın": "r2", "Muğla": "r7", "Antalya": "r8" };

const PARK_SIRASI = ["ucretsiz", "kismi", "ucretli", "bilinmiyor"];

// Seçili filtre durumu
const secili = { il: "", ilce: "", zemin: "", derinlik: "", park: "" };
let gelismisAcik = false;

function aktifGelismisSayisi() {
  return ["zemin", "derinlik", "park"].filter(k => secili[k]).length;
}

function parkRozetSinifi(park) {
  if (park === "ucretsiz") return "ucretsiz";
  if (park === "kismi") return "kismi";
  if (park === "ucretli") return "kismi";
  if (park === "bilinmiyor") return "kaynak";
  return "yok";
}

function parkRozetMetni(park) {
  if (park === "ucretsiz") return t("parkFree");
  if (park === "kismi") return t("parkPartial");
  if (park === "ucretli") return t("parkPaid");
  if (park === "bilinmiyor") return t("parkUnknown");
  return t("parkNone");
}

function kartRozetAdaylari(p) {
  const adaylar = [];
  if (p.derinlik && p.derinlik !== "Bilinmiyor") adaylar.push([IKON.dalga, trValue("derinlik", p.derinlik)]);
  if (p.zemin && p.zemin !== "Bilinmiyor") adaylar.push([IKON.zemin, trValue("zemin", p.zemin)]);
  if (p.dus === true) adaylar.push([IKON.dus, t("showerYes")]);
  if (p.tuvalet === true) adaylar.push([IKON.tuvalet, t("toiletYes")]);
  if (p.park === "ucretsiz") adaylar.push([IKON.park, parkRozetMetni(p.park)]);
  return adaylar.slice(0, 2);
}

function kartOlustur(p) {
  const a = document.createElement("a");
  a.href = `plaj.html?id=${p.id}`;
  const kapakFoto = p.fotograflar && p.fotograflar.length > 0 ? p.fotograflar[0] : null;

  if (!kapakFoto) {
    // Fotoğrafı olmayan plajlar için eski (renkli blok) kart
    a.className = `plaj-kart ${SEHIR_RENK[p.il] || "r1"}`;
    a.innerHTML = `
      <div class="plaj-kart-baslik">
        <h2>${p.isim}</h2>
        <span class="ilce-etiket">${p.ilce} / ${p.il}</span>
      </div>
      <div class="yildiz-rozet">${yildizHtmlOlustur(plajYildizHesapla(p))}</div>
      <div class="rozet-satir">
        ${p.zemin && p.zemin !== "Bilinmiyor" ? `<span class="rozet">${trValue("zemin", p.zemin)}</span>` : ""}
        ${p.derinlik && p.derinlik !== "Bilinmiyor" ? `<span class="rozet">${trValue("derinlik", p.derinlik)}</span>` : ""}
        ${p.park && p.park !== "bilinmiyor" ? `<span class="rozet ${parkRozetSinifi(p.park)}">${parkRozetMetni(p.park)}</span>` : ""}
        ${p.dus === true ? `<span class="rozet ucretsiz">${t("showerYes")}</span>` : ""}
        ${p.tuvalet === true ? `<span class="rozet ucretsiz">${t("toiletYes")}</span>` : (p.tuvalet === false ? `<span class="rozet yok">${t("toiletNo")}</span>` : "")}
      </div>
    `;
    return a;
  }

  a.className = "plaj-kart-foto";
  const onizleme = (typeof KAPAK_ONIZLEME !== "undefined" && KAPAK_ONIZLEME[kapakFoto]) || "";
  if (onizleme) a.style.backgroundImage = `url(${onizleme})`;
  const rozetler = kartRozetAdaylari(p);
  a.innerHTML = `
    <img class="plaj-kart-img" src="${kucukFoto(kapakFoto)}" alt="${p.isim}" loading="lazy" decoding="async"
      onload="this.classList.add('yuklendi')" onerror="this.onerror=null;this.src='${kapakFoto}'">
    <div class="plaj-kart-scrim"></div>
    <div class="plaj-kart-puan">${IKON.yildiz}${plajYildizHesapla(p)}</div>
    <div class="plaj-kart-icerik">
      <div class="plaj-kart-konum">${p.ilce.toUpperCase()} &middot; ${p.il.toUpperCase()}</div>
      <h2>${p.isim}</h2>
      <div class="plaj-kart-rozetler">
        ${rozetler.map(([ikon, metin]) => `<span class="plaj-kart-rozet">${ikon}${metin}</span>`).join("")}
      </div>
    </div>
  `;
  return a;
}

function aktifFiltreler(haric) {
  return {
    il: haric === "il" ? "" : secili.il,
    ilce: haric === "ilce" ? "" : secili.ilce,
    zemin: haric === "zemin" ? "" : secili.zemin,
    derinlik: haric === "derinlik" ? "" : secili.derinlik,
    park: haric === "park" ? "" : secili.park
  };
}

// Ana sayfadaki "Ne arıyorsun?" kısayolları (liste.html?ozellik=...)
const OZELLIKLER = {
  cocuk: { etiket: "qKids", ikon: "👨‍👩‍👧", test: p => p.derinlik === "Sığ" || p.derinlik === "Çok Sığ" },
  park: { etiket: "qFreePark", ikon: "🅿️", test: p => p.park === "ucretsiz" },
  kumsal: { etiket: "qSand", ikon: "🏖️", test: p => p.zemin === "Kumsal" || p.zemin === "Kum" },
  dus: { etiket: "qShower", ikon: "🚿", test: p => p.dus === true },
  mavi: { etiket: "qBlueFlag", ikon: "🏳️", test: p => /mavi bayrak/i.test(`${p.temizlik} ${p.notlar}`) }
};
let ozellik = "";

function eslesenler(f) {
  return PLAJLAR.filter(p => {
    if (ozellik && OZELLIKLER[ozellik] && !OZELLIKLER[ozellik].test(p)) return false;
    if (f.il && p.il !== f.il) return false;
    if (f.ilce && p.ilce !== f.ilce) return false;
    if (f.zemin && p.zemin !== f.zemin) return false;
    if (f.derinlik && p.derinlik !== f.derinlik) return false;
    if (f.park && p.park !== f.park) return false;
    return true;
  });
}

function chipGrubuOlustur(alanAdi, tumAnahtar, etiketFn, siraliDeger) {
  const adaylar = eslesenler(aktifFiltreler(alanAdi));

  let degerler;
  if (siraliDeger) {
    const mevcutSet = new Set(adaylar.map(p => p[alanAdi]).filter(Boolean));
    degerler = siraliDeger.filter(d => mevcutSet.has(d));
  } else {
    degerler = [];
    adaylar.forEach(p => {
      const v = p[alanAdi];
      if (v && !degerler.includes(v)) degerler.push(v);
    });
  }

  // Seçili değer artık mevcut değilse sıfırla
  if (secili[alanAdi] && !degerler.includes(secili[alanAdi])) secili[alanAdi] = "";

  const grup = document.createElement("div");
  grup.className = "filtre-grup";

  const tumChip = document.createElement("button");
  tumChip.type = "button";
  tumChip.className = "chip" + (secili[alanAdi] === "" ? " secili" : "");
  tumChip.textContent = t(tumAnahtar);
  tumChip.addEventListener("click", () => {
    secili[alanAdi] = "";
    filtreleVeCiz();
  });
  grup.appendChild(tumChip);

  degerler.forEach(d => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip" + (secili[alanAdi] === d ? " secili" : "");
    chip.textContent = etiketFn ? etiketFn(d) : trValue(alanAdi, d);
    chip.addEventListener("click", () => {
      secili[alanAdi] = secili[alanAdi] === d ? "" : d;
      filtreleVeCiz();
    });
    grup.appendChild(chip);
  });

  return grup;
}

function filtreleriCiz() {
  filtrelerEl.innerHTML = "";
  if (ozellik && OZELLIKLER[ozellik]) {
    const o = OZELLIKLER[ozellik];
    const aktif = document.createElement("button");
    aktif.type = "button";
    aktif.className = "ozellik-aktif";
    aktif.innerHTML = `<span>${o.ikon} ${t(o.etiket)}</span><span class="ozellik-kapat" aria-label="${t("clearQuick")}">✕</span>`;
    aktif.addEventListener("click", () => {
      ozellik = "";
      const u = new URL(location.href);
      u.searchParams.delete("ozellik");
      history.replaceState(null, "", u);
      filtreleVeCiz();
    });
    filtrelerEl.appendChild(aktif);
  }
  filtrelerEl.appendChild(chipGrubuOlustur("il", "allCities", v => v));
  filtrelerEl.appendChild(chipGrubuOlustur("ilce", "allDistricts", v => v));

  const sayi = aktifGelismisSayisi();
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "gelismis-filtre-toggle" + (gelismisAcik ? " acik" : "");
  toggle.innerHTML = `
    <span>${t("moreFilters")}</span>
    ${sayi > 0 ? `<span class="gelismis-rozet">${sayi}</span>` : ""}
    <span class="gelismis-ok">▾</span>
  `;
  toggle.addEventListener("click", () => {
    gelismisAcik = !gelismisAcik;
    filtreleriCiz();
  });
  filtrelerEl.appendChild(toggle);

  const gelismisKapsayici = document.createElement("div");
  gelismisKapsayici.className = "gelismis-filtreler" + (gelismisAcik ? " acik" : "");
  gelismisKapsayici.appendChild(chipGrubuOlustur("zemin", "allGrounds"));
  gelismisKapsayici.appendChild(chipGrubuOlustur("derinlik", "allDepths"));
  gelismisKapsayici.appendChild(chipGrubuOlustur("park", "allParking", parkRozetMetni, PARK_SIRASI));
  filtrelerEl.appendChild(gelismisKapsayici);
}

function turkceKucuk(s) {
  return s.toLocaleLowerCase("tr-TR");
}

function filtreleVeCiz() {
  filtreleriCiz();

  const q = turkceKucuk((aramaInput.value || "").trim());

  const sonuclar = eslesenler(aktifFiltreler(null))
    .filter(p => !q || turkceKucuk(p.isim).includes(q) || turkceKucuk(p.ilce).includes(q) || turkceKucuk(p.il).includes(q))
    .sort((a, b) => plajYildizHesapla(b) - plajYildizHesapla(a) || a.isim.localeCompare(b.isim, "tr"));

  listeEl.innerHTML = "";

  if (sonuclar.length === 0) {
    listeEl.innerHTML = `<div class="bos-durum">${t("noMatch")}</div>`;
  } else {
    sonuclar.forEach(p => listeEl.appendChild(kartOlustur(p)));
  }

  sonucSayisiEl.textContent = t("resultsCount", sonuclar.length);
}

aramaInput.addEventListener("input", filtreleVeCiz);

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("il")) secili.il = urlParams.get("il");
if (urlParams.get("ilce")) secili.ilce = urlParams.get("ilce");
if (OZELLIKLER[urlParams.get("ozellik")]) ozellik = urlParams.get("ozellik");

filtreleVeCiz();
