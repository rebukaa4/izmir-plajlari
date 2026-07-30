const listeEl = document.getElementById("plaj-liste");
const sonucSayisiEl = document.getElementById("sonuc-sayisi");
const filtreIl = document.getElementById("filtre-il");
const filtreIlce = document.getElementById("filtre-ilce");
const filtreZemin = document.getElementById("filtre-zemin");
const filtreDerinlik = document.getElementById("filtre-derinlik");
const filtrePark = document.getElementById("filtre-park");

dilSeciciOlustur("dil-secici");
applyI18n();

const KART_RENKLERI = ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"];

const PARK_SIRASI = ["ucretsiz", "kismi", "ucretli", "bilinmiyor"];

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

function kartOlustur(p, index) {
  const a = document.createElement("a");
  a.className = `plaj-kart ${KART_RENKLERI[index % KART_RENKLERI.length]}`;
  a.href = `plaj.html?id=${p.id}`;
  a.innerHTML = `
    <div class="plaj-kart-baslik">
      <h2>${p.isim}</h2>
      <span class="ilce-etiket">${p.ilce} / ${p.il}</span>
    </div>
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
    il: haric === "il" ? "" : filtreIl.value,
    ilce: haric === "ilce" ? "" : filtreIlce.value,
    zemin: haric === "zemin" ? "" : filtreZemin.value,
    derinlik: haric === "derinlik" ? "" : filtreDerinlik.value,
    park: haric === "park" ? "" : filtrePark.value
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

function secenekleriGuncelle(selectEl, alanAdi, haric, varsayilanAnahtar, etiketFn, siraliDeger) {
  const oncekiDeger = selectEl.dataset.beklenenDeger || selectEl.value;
  delete selectEl.dataset.beklenenDeger;
  const adaylar = eslesenler(aktifFiltreler(haric));

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

  selectEl.innerHTML = "";
  const varsayilanOpt = document.createElement("option");
  varsayilanOpt.value = "";
  varsayilanOpt.textContent = t(varsayilanAnahtar);
  selectEl.appendChild(varsayilanOpt);

  degerler.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = etiketFn ? etiketFn(d) : trValue(alanAdi, d);
    selectEl.appendChild(opt);
  });

  selectEl.value = degerler.includes(oncekiDeger) ? oncekiDeger : "";
}

function tumSecenekleriGuncelle() {
  secenekleriGuncelle(filtreIl, "il", "il", "allCities");
  secenekleriGuncelle(filtreIlce, "ilce", "ilce", "allDistricts");
  secenekleriGuncelle(filtreZemin, "zemin", "zemin", "allGrounds");
  secenekleriGuncelle(filtreDerinlik, "derinlik", "derinlik", "allDepths");
  secenekleriGuncelle(filtrePark, "park", "park", "allParking", parkRozetMetni, PARK_SIRASI);
}

function filtreleVeCiz() {
  tumSecenekleriGuncelle();

  const sonuclar = eslesenler(aktifFiltreler(null));

  listeEl.innerHTML = "";

  if (sonuclar.length === 0) {
    listeEl.innerHTML = `<div class="bos-durum">${t("noMatch")}</div>`;
  } else {
    sonuclar.forEach((p, i) => listeEl.appendChild(kartOlustur(p, i)));
  }

  sonucSayisiEl.textContent = t("resultsCount", sonuclar.length);
}

[filtreIl, filtreIlce, filtreZemin, filtreDerinlik, filtrePark].forEach(el => {
  el.addEventListener("change", filtreleVeCiz);
});

const urlParams = new URLSearchParams(window.location.search);
const secilenIl = urlParams.get("il");
if (secilenIl) {
  filtreIl.dataset.beklenenDeger = secilenIl;
}
const secilenIlce = urlParams.get("ilce");
if (secilenIlce) {
  filtreIlce.dataset.beklenenDeger = secilenIlce;
}

filtreleVeCiz();
