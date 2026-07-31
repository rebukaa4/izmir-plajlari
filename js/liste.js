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

function kartOlustur(p) {
  const a = document.createElement("a");
  a.className = `plaj-kart ${SEHIR_RENK[p.il] || "r1"}`;
  a.href = `plaj.html?id=${p.id}`;
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

function aktifFiltreler(haric) {
  return {
    il: haric === "il" ? "" : secili.il,
    ilce: haric === "ilce" ? "" : secili.ilce,
    zemin: haric === "zemin" ? "" : secili.zemin,
    derinlik: haric === "derinlik" ? "" : secili.derinlik,
    park: haric === "park" ? "" : secili.park
  };
}

function eslesenler(f) {
  return PLAJLAR.filter(p => {
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
  filtrelerEl.appendChild(chipGrubuOlustur("il", "allCities", v => v));
  filtrelerEl.appendChild(chipGrubuOlustur("ilce", "allDistricts", v => v));
  filtrelerEl.appendChild(chipGrubuOlustur("zemin", "allGrounds"));
  filtrelerEl.appendChild(chipGrubuOlustur("derinlik", "allDepths"));
  filtrelerEl.appendChild(chipGrubuOlustur("park", "allParking", parkRozetMetni, PARK_SIRASI));
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

filtreleVeCiz();
