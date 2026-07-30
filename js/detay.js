const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));
const plaj = PLAJLAR.find(p => p.id === id);

const basligEl = document.getElementById("plaj-baslik");
const ilceEl = document.getElementById("plaj-ilce");
const icerikEl = document.getElementById("detay-icerik");

if (!plaj) {
  basligEl.textContent = "Plaj Bulunamadı";
  icerikEl.innerHTML = `<div class="bos-durum">Bu plaj bulunamadı. Listeye dönüp tekrar deneyin.</div>`;
} else {
  basligEl.textContent = plaj.isim;
  ilceEl.textContent = plaj.ilce + " / " + plaj.il;

  const fotografHtml = (plaj.fotograflar && plaj.fotograflar.length > 0)
    ? `<div class="foto-galeri">
        ${plaj.fotograflar.map(src => `<img src="${src}" alt="${plaj.isim}" loading="lazy">`).join("")}
      </div>`
    : `<div class="gorsel-yer-tutucu">🏖️</div>`;

  const kaynakRozetHtml = plaj.kaynak === "internet"
    ? `<div class="kaynak-uyari">🌐 Bu bilgiler internet araştırmasından derlendi, saha doğrulaması henüz yapılmadı.</div>`
    : "";

  icerikEl.innerHTML = `
    ${fotografHtml}

    ${kaynakRozetHtml}

    <div class="fiyat-politikasi">💡 Enflasyon ve hızlı fiyat değişimleri sebebiyle fiyat bilgisi verilmemektedir. Sadece "ücretli/ücretsiz" olduğu belirtilir.</div>

    ${(plaj.zemin && plaj.zemin !== "Bilinmiyor") || (plaj.derinlik && plaj.derinlik !== "Bilinmiyor") ? `
    <div class="bilgi-karti">
      <h3>Genel Bilgiler</h3>
      ${plaj.zemin && plaj.zemin !== "Bilinmiyor" ? `<div class="bilgi-satir"><span class="etiket">Zemin</span><span class="deger">${plaj.zemin}</span></div>` : ""}
      ${plaj.derinlik && plaj.derinlik !== "Bilinmiyor" ? `<div class="bilgi-satir"><span class="etiket">Derinlik</span><span class="deger">${plaj.derinlik}</span></div>` : ""}
    </div>` : ""}

    ${plaj.parkNotu ? `
    <div class="bilgi-karti">
      <h3>Park Durumu</h3>
      <p class="not-metni">${plaj.parkNotu}</p>
    </div>` : ""}

    ${tesisKartiOlustur(plaj)}

    ${konforKartiOlustur(plaj)}

    ${plaj.notlar ? `
    <div class="bilgi-karti">
      <h3>Diğer Notlar</h3>
      <p class="not-metni">${plaj.notlar}</p>
    </div>` : ""}

    <a class="harita-buton" href="${plaj.haritaLinki}" target="_blank" rel="noopener">📍 Yol Tarifi Al</a>

    ${plaj.kaynaklar && plaj.kaynaklar.length > 0 ? `<div class="kaynak-mini">Kaynak: ${plaj.kaynaklar.join(", ")}</div>` : ""}
  `;

  document.querySelectorAll(".foto-galeri img").forEach((img, i) => {
    img.addEventListener("click", () => acLightbox(plaj.fotograflar, i));
  });
}

function tesisKartiOlustur(plaj) {
  const bilinenler = [
    ["Duş", plaj.dus],
    ["Tuvalet", plaj.tuvalet],
    ["Kabin", plaj.kabin]
  ].filter(([, deger]) => typeof deger === "boolean");

  if (bilinenler.length === 0 && !plaj.tuvaletNotu) return "";

  return `
    <div class="bilgi-karti">
      <h3>Duş / Tuvalet / Kabin</h3>
      ${bilinenler.map(([etiket, deger]) => `
        <div class="bilgi-satir"><span class="etiket">${etiket}</span><span class="deger">${deger ? "Var" : "Yok"}</span></div>
      `).join("")}
      ${plaj.tuvaletNotu ? `<p class="not-metni">${plaj.tuvaletNotu}</p>` : ""}
    </div>`;
}

function konforKartiOlustur(plaj) {
  const satirlar = [
    ["Otopark → Sahil Yürüyüş", plaj.yayaMesafe, "🚶"],
    ["Şemsiye / Şezlong", plaj.sezlong, "⛱️"],
    ["Dalga Durumu", plaj.dalgaDurumu, "🌊"],
    ["Alışveriş / Yeme-İçme", plaj.aliverisYemeIcme, "🛍️"],
    ["Çocuklar İçin Uygunluk", plaj.cocukUygun, "🧒"],
    ["Kalabalık Durumu", plaj.kalabalik, "👥"],
    ["Temizlik", plaj.temizlik, "🧹"]
  ].filter(([, deger]) => deger);

  if (satirlar.length === 0) return "";

  return `
    <div class="bilgi-karti">
      <h3>Sahil Konforu</h3>
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
    <button type="button" class="lightbox-kapat">✕ Kapat</button>
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
