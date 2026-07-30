dilSeciciOlustur("dil-secici");
applyI18n();

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));
const plaj = PLAJLAR.find(p => p.id === id);

const basligEl = document.getElementById("plaj-baslik");
const ilceEl = document.getElementById("plaj-ilce");
const icerikEl = document.getElementById("detay-icerik");

if (!plaj) {
  basligEl.textContent = t("beachNotFoundTitle");
  icerikEl.innerHTML = `<div class="bos-durum">${t("beachNotFoundMsg")}</div>`;
} else {
  basligEl.textContent = plaj.isim;
  ilceEl.textContent = plaj.ilce + " / " + plaj.il;

  const fotografHtml = (plaj.fotograflar && plaj.fotograflar.length > 0)
    ? `<div class="foto-galeri">
        ${plaj.fotograflar.map(src => `<img src="${src}" alt="${plaj.isim}" loading="lazy">`).join("")}
      </div>`
    : `<div class="gorsel-yer-tutucu">🏖️</div>`;

  const kaynakRozetHtml = plaj.kaynak === "internet"
    ? `<div class="kaynak-uyari">${t("sourceDisclaimer")}</div>`
    : "";

  const dilNotuHtml = getLang() !== "tr"
    ? `<div class="kaynak-uyari">${t("contentTrOnlyNotice")}</div>`
    : "";

  icerikEl.innerHTML = `
    ${fotografHtml}

    ${kaynakRozetHtml}

    ${dilNotuHtml}

    <div class="fiyat-politikasi">${t("priceNoticeDetail")}</div>

    ${(plaj.zemin && plaj.zemin !== "Bilinmiyor") || (plaj.derinlik && plaj.derinlik !== "Bilinmiyor") ? `
    <div class="bilgi-karti">
      <h3>${t("generalInfo")}</h3>
      ${plaj.zemin && plaj.zemin !== "Bilinmiyor" ? `<div class="bilgi-satir"><span class="etiket">${t("ground")}</span><span class="deger">${trValue("zemin", plaj.zemin)}</span></div>` : ""}
      ${plaj.derinlik && plaj.derinlik !== "Bilinmiyor" ? `<div class="bilgi-satir"><span class="etiket">${t("depth")}</span><span class="deger">${trValue("derinlik", plaj.derinlik)}</span></div>` : ""}
    </div>` : ""}

    ${plaj.parkNotu ? `
    <div class="bilgi-karti">
      <h3>${t("parkingStatus")}</h3>
      <p class="not-metni">${plaj.parkNotu}</p>
    </div>` : ""}

    ${tesisKartiOlustur(plaj)}

    ${konforKartiOlustur(plaj)}

    ${plaj.notlar ? `
    <div class="bilgi-karti">
      <h3>${t("otherNotes")}</h3>
      <p class="not-metni">${plaj.notlar}</p>
    </div>` : ""}

    <a class="harita-buton" href="${plaj.haritaLinki}" target="_blank" rel="noopener">${t("directions")}</a>

    ${plaj.kaynaklar && plaj.kaynaklar.length > 0 ? `<div class="kaynak-mini">${t("sourcePrefix")} ${plaj.kaynaklar.join(", ")}</div>` : ""}
  `;

  document.querySelectorAll(".foto-galeri img").forEach((img, i) => {
    img.addEventListener("click", () => acLightbox(plaj.fotograflar, i));
  });
}

function tesisKartiOlustur(plaj) {
  const bilinenler = [
    [t("shower"), plaj.dus],
    [t("toilet"), plaj.tuvalet],
    [t("cabin"), plaj.kabin]
  ].filter(([, deger]) => typeof deger === "boolean");

  if (bilinenler.length === 0 && !plaj.tuvaletNotu) return "";

  return `
    <div class="bilgi-karti">
      <h3>${t("facilitiesTitle")}</h3>
      ${bilinenler.map(([etiket, deger]) => `
        <div class="bilgi-satir"><span class="etiket">${etiket}</span><span class="deger">${deger ? t("yes") : t("no")}</span></div>
      `).join("")}
      ${plaj.tuvaletNotu ? `<p class="not-metni">${plaj.tuvaletNotu}</p>` : ""}
    </div>`;
}

function konforKartiOlustur(plaj) {
  const satirlar = [
    [t("walkDistance"), plaj.yayaMesafe, "🚶"],
    [t("sunbed"), plaj.sezlong, "⛱️"],
    [t("waveCondition"), plaj.dalgaDurumu, "🌊"],
    [t("shopping"), plaj.aliverisYemeIcme, "🛍️"],
    [t("childFriendly"), plaj.cocukUygun, "🧒"],
    [t("crowdLevel"), plaj.kalabalik, "👥"],
    [t("cleanliness"), plaj.temizlik, "🧹"]
  ].filter(([, deger]) => deger);

  if (satirlar.length === 0) return "";

  return `
    <div class="bilgi-karti">
      <h3>${t("beachComfort")}</h3>
      ${satirlar.map(([etiket, deger, ikon]) => `
        <div class="konfor-satir">
          <span class="konfor-ikon">${ikon}</span>
          <div>
            <div class="konfor-etiket">${etiket}</div>
            <div class="konfor-deger">${deger}</div>
          </div>
        </div>
      `).join("")}
    </div>`;
}

function acLightbox(fotograflar, baslangicIndex) {
  let index = baslangicIndex;

  const kapak = document.createElement("div");
  kapak.className = "lightbox";
  kapak.innerHTML = `
    <div class="lightbox-sayac">${index + 1} / ${fotograflar.length}</div>
    <img src="${fotograflar[index]}" alt="">
    <button type="button" class="lightbox-kapat">${t("lightboxClose")}</button>
  `;

  const img = kapak.querySelector("img");
  const sayac = kapak.querySelector(".lightbox-sayac");
  const kapatButon = kapak.querySelector(".lightbox-kapat");

  img.addEventListener("click", (e) => {
    e.stopPropagation();
    index = (index + 1) % fotograflar.length;
    img.src = fotograflar[index];
    sayac.textContent = `${index + 1} / ${fotograflar.length}`;
  });

  kapatButon.addEventListener("click", (e) => {
    e.stopPropagation();
    kapak.remove();
  });

  document.body.appendChild(kapak);
}
