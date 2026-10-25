dilSeciciOlustur("dil-secici");
applyI18n();

function lc(plaj, alan) {
  const lang = getLang();
  if (lang !== "tr" && plaj.ceviriler && plaj.ceviriler[lang] && plaj.ceviriler[lang][alan]) {
    return plaj.ceviriler[lang][alan];
  }
  return plaj[alan];
}

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
  ilceEl.innerHTML = `${plaj.ilce} / ${plaj.il} &nbsp;<span class="yildiz-rozet">${yildizHtmlOlustur(plajYildizHesapla(plaj))}</span>`;

  const fotografHtml = (plaj.fotograflar && plaj.fotograflar.length > 0)
    ? `<div class="foto-galeri">
        ${plaj.fotograflar.map((src, i) => {
          const kucuk = typeof kucukFoto === "function" ? kucukFoto(src) : src;
          const onizleme = i === 0 && typeof KAPAK_ONIZLEME !== "undefined" && KAPAK_ONIZLEME[src];
          return `<img src="${kucuk}" alt="${plaj.isim}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"
            ${onizleme ? `style="background:url(${onizleme}) center/cover"` : ""} onerror="this.onerror=null;this.src='${src}'">`;
        }).join("")}
      </div>`
    : `<div class="gorsel-yer-tutucu">${IKON.plaj}</div>`;

  const kaynakRozetHtml = plaj.kaynak === "internet"
    ? `<div class="kaynak-uyari">${t("sourceDisclaimer")}</div>`
    : "";

  const dilNotuHtml = (getLang() !== "tr" && !(plaj.ceviriler && plaj.ceviriler[getLang()]))
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
      <p class="not-metni">${lc(plaj, "parkNotu")}</p>
    </div>` : ""}

    ${tesisKartiOlustur(plaj)}

    ${konforKartiOlustur(plaj)}

    ${plaj.notlar ? `
    <div class="bilgi-karti">
      <h3>${t("otherNotes")}</h3>
      <p class="not-metni">${lc(plaj, "notlar")}</p>
    </div>` : ""}

    <a class="harita-buton" href="${plaj.haritaLinki}" target="_blank" rel="noopener">${t("directions")}</a>

    ${plaj.kaynaklar && plaj.kaynaklar.length > 0 ? `<div class="kaynak-mini">${t("sourcePrefix")} ${plaj.kaynaklar.join(", ")}</div>` : ""}

    <a class="geri-bildirim-link" href="mailto:rebukaa4@gmail.com?subject=${encodeURIComponent(t("feedbackSubject") + " — " + plaj.isim)}&body=${encodeURIComponent(t("feedbackBody") + plaj.isim + " (" + plaj.ilce + " / " + plaj.il + ")\n\n")}">${t("feedbackLink")}</a>
  `;

  document.querySelectorAll(".foto-galeri img").forEach((img, i) => {
    img.addEventListener("click", () => acLightbox(plaj.fotograflar, i));
  });
}

function tesisKartiOlustur(plaj) {
  const ikonlar = { [t("shower")]: IKON.dus, [t("toilet")]: IKON.tuvalet, [t("cabin")]: IKON.kabin };
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
        <div class="ikon-satir">
          <span class="ikon-cip${deger ? "" : " olumsuz"}">${ikonlar[etiket]}</span>
          <div>
            <div class="konfor-etiket">${etiket}</div>
            <div class="konfor-deger">${deger ? t("yes") : t("no")}</div>
          </div>
        </div>
      `).join("")}
      ${plaj.tuvaletNotu ? `<p class="not-metni">${lc(plaj, "tuvaletNotu")}</p>` : ""}
    </div>`;
}

function konforKartiOlustur(plaj) {
  const satirlar = [
    [t("walkDistance"), lc(plaj, "yayaMesafe"), IKON.yurume],
    [t("sunbed"), lc(plaj, "sezlong"), IKON.semsiye],
    [t("waveCondition"), lc(plaj, "dalgaDurumu"), IKON.dalga],
    [t("shopping"), lc(plaj, "aliverisYemeIcme"), IKON.torba],
    [t("childFriendly"), lc(plaj, "cocukUygun"), IKON.cocuk],
    [t("crowdLevel"), lc(plaj, "kalabalik"), IKON.kalabalik],
    [t("cleanliness"), lc(plaj, "temizlik"), IKON.temizlik]
  ].filter(([, deger]) => deger);

  if (satirlar.length === 0) return "";

  return `
    <div class="bilgi-karti">
      <h3>${t("beachComfort")}</h3>
      ${satirlar.map(([etiket, deger, ikon]) => `
        <div class="ikon-satir">
          <span class="ikon-cip">${ikon}</span>
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
  const sayi = fotograflar.length;

  const kapak = document.createElement("div");
  kapak.className = "lightbox";
  kapak.innerHTML = `
    <div class="lightbox-sayac">${index + 1} / ${sayi}</div>
    <div class="lightbox-viewport">
      <div class="lightbox-track">
        ${fotograflar.map(src => `<img src="${src}" alt="" draggable="false">`).join("")}
      </div>
    </div>
    <button type="button" class="lightbox-kapat">${t("lightboxClose")}</button>
  `;

  const viewport = kapak.querySelector(".lightbox-viewport");
  const track = kapak.querySelector(".lightbox-track");
  const sayac = kapak.querySelector(".lightbox-sayac");
  const kapatButon = kapak.querySelector(".lightbox-kapat");

  // Fotoğraflar parmakla/fareyle sürüklenerek gerçek zamanlı kaydırılır,
  // bırakıldığında en yakın fotoğrafa yumuşakça oturur.
  function konumlandir(animasyonlu) {
    track.style.transition = animasyonlu ? "transform 0.28s cubic-bezier(.22,.61,.36,1)" : "none";
    track.style.transform = `translateX(${-index * viewport.clientWidth}px)`;
    sayac.textContent = `${index + 1} / ${sayi}`;
  }

  let baslangicX = null;
  let surukleniyor = false;

  function baslat(x) {
    baslangicX = x;
    surukleniyor = true;
    track.style.transition = "none";
    viewport.classList.add("suruklenir");
  }

  function tasi(x) {
    if (!surukleniyor) return;
    const fark = x - baslangicX;
    track.style.transform = `translateX(${-index * viewport.clientWidth + fark}px)`;
  }

  function birak(x) {
    if (!surukleniyor) return;
    surukleniyor = false;
    viewport.classList.remove("suruklenir");
    const fark = x - baslangicX;
    baslangicX = null;
    if (Math.abs(fark) >= 50) {
      index = (index + (fark < 0 ? 1 : -1) + sayi) % sayi;
    }
    konumlandir(true);
  }

  viewport.addEventListener("touchstart", (e) => baslat(e.touches[0].clientX), { passive: true });
  viewport.addEventListener("touchmove", (e) => tasi(e.touches[0].clientX), { passive: true });
  viewport.addEventListener("touchend", (e) => birak(e.changedTouches[0].clientX));

  viewport.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch") return;
    baslat(e.clientX);
  });
  window.addEventListener("pointermove", (e) => tasi(e.clientX));
  window.addEventListener("pointerup", (e) => birak(e.clientX));

  window.addEventListener("resize", () => konumlandir(false));

  kapatButon.addEventListener("click", (e) => {
    e.stopPropagation();
    kapak.remove();
  });

  document.body.appendChild(kapak);
  konumlandir(false);
}
