  // Popülerlik sırasıyla şehir başına ilçeler (veri henüz olmayanlar da listelenir)
  const ILCELER_BY_IL = {
    "İzmir": ["Çeşme", "Urla", "Foça", "Seferihisar", "Dikili", "Karaburun"],
    "Aydın": ["Kuşadası", "Didim"],
    "Muğla": ["Fethiye", "Marmaris", "Bodrum", "Dalyan/Ortaca"],
    "Antalya": ["Muratpaşa", "Alanya", "Manavgat", "Kaş", "Kemer"]
  };
  const renkler = ["r1", "r2", "r3", "r4", "r5", "r6"];
  // Şehir kartları için, karışmasın diye birbirinden belirgin şekilde uzak renkler
  const SEHIR_RENK_HARITASI = { "İzmir": "r5", "Aydın": "r2", "Muğla": "r7", "Antalya": "r8" };
  const yedekSehirRenkleri = ["r1", "r3", "r4", "r6"];

  const heroBaslik = document.getElementById("hero-baslik");
  const heroAlt = document.getElementById("hero-alt");
  const tumPlajlarButon = document.getElementById("tum-plajlar-buton");
  const tumPlajlarMetin = document.getElementById("tum-plajlar-metin");
  const sehirAlan = document.getElementById("sehir-alan");
  const ilceAlan = document.getElementById("ilce-alan");
  const sehirGrid = document.getElementById("sehir-grid");
  const ilceGrid = document.getElementById("ilce-grid");
  const sehirDegistir = document.getElementById("sehir-degistir");

  dilSeciciOlustur("dil-secici");

  // ---------- Vitrin: gerçek plaj fotoğraflarıyla yavaş yakınlaşan slayt ----------
  const puanli = PLAJLAR
    .filter(p => p.fotograflar && p.fotograflar.length)
    .map(p => ({ p, puan: plajYildizHesapla(p) }))
    .sort((a, b) => b.puan - a.puan || b.p.fotograflar.length - a.p.fotograflar.length);

  // Her şehirden sırayla en iyi plajlar → vitrin çeşitli olsun
  function sehirlereDagit(liste, adet) {
    const kovalar = {};
    liste.forEach(x => (kovalar[x.p.il] = kovalar[x.p.il] || []).push(x.p));
    const sonuc = [];
    while (sonuc.length < adet && Object.values(kovalar).some(k => k.length)) {
      Object.keys(ILCELER_BY_IL).forEach(il => {
        if (sonuc.length < adet && kovalar[il] && kovalar[il].length) sonuc.push(kovalar[il].shift());
      });
    }
    return sonuc;
  }

  // Vitrin için elle seçilmiş manzara fotoğrafları: [plaj id, fotoğraf sırası]
  const VITRIN_SECIMI = [[34, 0], [55, 0], [74, 0], [43, 0, "center 88%"], [2, 0], [51, 5], [70, 4]];
  const vitrinPlajlari = VITRIN_SECIMI
    .map(([id, i, konum]) => {
      const p = PLAJLAR.find(x => x.id === id);
      return p && p.fotograflar && p.fotograflar[i] ? Object.assign({}, p, { vitrinFoto: p.fotograflar[i], vitrinKonum: konum }) : null;
    })
    .filter(Boolean);
  if (vitrinPlajlari.length < 3) sehirlereDagit(puanli, 6).forEach(p => vitrinPlajlari.push(Object.assign({}, p, { vitrinFoto: p.fotograflar[0] })));
  const slaytKutusu = document.getElementById("vitrin-slaytlar");
  const noktaKutusu = document.getElementById("vitrin-noktalar");
  const etiket = document.getElementById("vitrin-etiket");
  const etiketMetin = document.getElementById("vitrin-etiket-metin");
  let aktifSlayt = 0, slaytZamani = null;

  vitrinPlajlari.forEach((p, i) => {
    const s = document.createElement("div");
    s.className = "vitrin-slayt";
    if (p.vitrinKonum) s.style.backgroundPosition = p.vitrinKonum;
    const onizleme = (typeof KAPAK_ONIZLEME !== "undefined" && KAPAK_ONIZLEME[p.vitrinFoto]) || "";
    s.style.backgroundImage = onizleme ? `url(${onizleme})` : "";
    const img = new Image();
    img.decoding = "async";
    if (i === 0) img.fetchPriority = "high";
    img.onload = () => {
      s.style.backgroundImage = `url(${img.src})`;
      s.classList.add("hazir");
      if (i === 0) perdeyiKapat();
    };
    // İlk slayt hızlı gelsin diye küçük kopya, sonra büyüğüyle değiştirilir; diğerleri sırayla
    if (i === 0) {
      img.src = kucukFoto(p.vitrinFoto);
      const buyuk = new Image();
      buyuk.onload = () => { s.style.backgroundImage = `url(${buyuk.src})`; };
      setTimeout(() => { buyuk.src = p.vitrinFoto; }, 1200);
    } else {
      setTimeout(() => { img.src = p.vitrinFoto; }, 1500 + i * 400);
    }
    slaytKutusu.appendChild(s);

    const nokta = document.createElement("button");
    nokta.type = "button";
    nokta.className = "vitrin-nokta";
    nokta.setAttribute("aria-label", p.isim);
    nokta.addEventListener("click", () => { slaytGoster(i); slaytZamanla(); });
    noktaKutusu.appendChild(nokta);
  });

  function slaytGoster(i) {
    aktifSlayt = i;
    slaytKutusu.querySelectorAll(".vitrin-slayt").forEach((s, j) => s.classList.toggle("aktif", j === i));
    noktaKutusu.querySelectorAll(".vitrin-nokta").forEach((n, j) => n.classList.toggle("aktif", j === i));
    const p = vitrinPlajlari[i];
    etiket.href = `plaj.html?id=${p.id}`;
    etiket.classList.remove("gorunur");
    requestAnimationFrame(() => {
      etiketMetin.textContent = `${p.isim} · ${p.ilce}`;
      etiket.classList.add("gorunur");
    });
  }

  function slaytZamanla() {
    clearInterval(slaytZamani);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    slaytZamani = setInterval(() => slaytGoster((aktifSlayt + 1) % vitrinPlajlari.length), 5200);
  }

  // Parmakla kaydırarak slayt değiştirme
  let dokunX = null;
  const vitrin = document.getElementById("vitrin");
  vitrin.addEventListener("touchstart", e => { dokunX = e.touches[0].clientX; }, { passive: true });
  vitrin.addEventListener("touchend", e => {
    if (dokunX === null) return;
    const fark = e.changedTouches[0].clientX - dokunX;
    dokunX = null;
    if (Math.abs(fark) < 45) return;
    const n = vitrinPlajlari.length;
    slaytGoster((aktifSlayt + (fark < 0 ? 1 : -1) + n) % n);
    slaytZamanla();
  });

  if (vitrinPlajlari.length) { slaytGoster(0); slaytZamanla(); }

  // Açılış perdesi: ilk fotoğraf gelince (en geç 1.6 sn) yumuşakça kalkar
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

  const ilSayisi = new Set(PLAJLAR.map(p => p.il)).size;
  document.getElementById("vitrin-sayac").textContent = t("heroStat", PLAJLAR.length, ilSayisi);

  // ---------- "Ne arıyorsun?" kısayolları ----------
  const HIZLI = [
    ["cocuk", "👨‍👩‍👧", "qKids", p => p.derinlik === "Sığ" || p.derinlik === "Çok Sığ"],
    ["park", "🅿️", "qFreePark", p => p.park === "ucretsiz"],
    ["kumsal", "🏖️", "qSand", p => p.zemin === "Kumsal" || p.zemin === "Kum"],
    ["mavi", "🏳️", "qBlueFlag", p => /mavi bayrak/i.test(`${p.temizlik} ${p.notlar}`)],
    ["dus", "🚿", "qShower", p => p.dus === true]
  ];
  const hizliKutu = document.getElementById("hizli-seritler");
  HIZLI.forEach(([anahtar, ikon, metin, test], i) => {
    const sayi = PLAJLAR.filter(test).length;
    const a = document.createElement("a");
    a.className = "hizli-serit";
    a.style.setProperty("--sira", i);
    a.href = `liste.html?ozellik=${anahtar}`;
    a.innerHTML = `<span class="hizli-ikon">${ikon}</span><span class="hizli-metin">${t(metin)}</span><span class="hizli-sayi">${sayi}</span>`;
    hizliKutu.appendChild(a);
  });

  // ---------- Öne çıkan plajlar (yatay kaydırmalı fotoğraf kartları) ----------
  const vitrinIdleri = new Set(vitrinPlajlari.map(p => p.id));
  const oneCikanlar = sehirlereDagit(puanli.filter(x => !vitrinIdleri.has(x.p.id)), 10);
  const seritKutu = document.getElementById("one-cikanlar");
  oneCikanlar.forEach(p => {
    const kapak = p.fotograflar[0];
    const onizleme = (typeof KAPAK_ONIZLEME !== "undefined" && KAPAK_ONIZLEME[kapak]) || "";
    const a = document.createElement("a");
    a.className = "seri-kart";
    a.href = `plaj.html?id=${p.id}`;
    if (onizleme) a.style.backgroundImage = `url(${onizleme})`;
    a.innerHTML = `
      <img src="${kucukFoto(kapak)}" alt="${p.isim}" loading="lazy" decoding="async"
        onload="this.classList.add('yuklendi')" onerror="this.onerror=null;this.src='${kapak}'">
      <span class="seri-puan">★ ${plajYildizHesapla(p)}</span>
      <span class="seri-alt">
        <span class="seri-konum">${p.ilce} · ${p.il}</span>
        <span class="seri-isim">${p.isim}</span>
      </span>`;
    seritKutu.appendChild(a);
  });

  // ---------- Şehir kartları: o şehrin en iyi plajının fotoğrafıyla ----------
  Object.keys(ILCELER_BY_IL).forEach((il, i) => {
    const sayi = PLAJLAR.filter(p => p.il === il).length;
    const a = document.createElement("a");
    const sehirRenk = SEHIR_RENK_HARITASI[il] || yedekSehirRenkleri[i % yedekSehirRenkleri.length];
    // Şehir kartı fotoğrafları elle seçildi (manzara, yüz yok); yoksa en yüksek puanlı plaj
    const SEHIR_FOTO = { "İzmir": [2, 0], "Aydın": [43, 0], "Muğla": [55, 0], "Antalya": [74, 0] };
    const sf = SEHIR_FOTO[il] && PLAJLAR.find(x => x.id === SEHIR_FOTO[il][0]);
    const kapakFoto = sf ? sf.fotograflar[SEHIR_FOTO[il][1]] : ((puanli.find(x => x.p.il === il) || {}).p || {fotograflar:[null]}).fotograflar[0];
    a.className = `ilce-kart sehir-kart ${sehirRenk}`;
    a.href = "#";
    a.innerHTML = `
      ${kapakFoto ? `<img class="sehir-foto" src="${kucukFoto(kapakFoto)}" alt="" loading="lazy" decoding="async" onload="this.classList.add('yuklendi')">` : ""}
      <span class="ilce-adi">${il}</span>
      <span class="ilce-sayi">${sayi} ${t("beachSuffix")}</span>
    `;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      secSehir(il);
    });
    sehirGrid.appendChild(a);
  });

  function secSehir(il) {
    heroBaslik.textContent = il;
    heroAlt.textContent = t("heroSubtitle");
    tumPlajlarButon.href = `liste.html?il=${encodeURIComponent(il)}`;
    tumPlajlarMetin.textContent = t("seeAllBeachesCity", il);

    ilceGrid.innerHTML = "";
    (ILCELER_BY_IL[il] || []).forEach((ilce, i) => {
      const sayi = PLAJLAR.filter(p => p.ilce === ilce && p.il === il).length;
      const a = document.createElement("a");
      a.className = `ilce-kart ${renkler[i % renkler.length]}`;
      a.href = `liste.html?il=${encodeURIComponent(il)}&ilce=${encodeURIComponent(ilce)}`;
      a.innerHTML = `
        <span class="ilce-adi">${ilce}</span>
        <span class="ilce-sayi">${sayi > 0 ? sayi + " " + t("beachSuffix") : t("comingSoon")}</span>
      `;
      ilceGrid.appendChild(a);
    });

    sehirAlan.style.display = "none";
    ilceAlan.style.display = "";
    ilceAlan.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  sehirDegistir.addEventListener("click", (e) => {
    e.preventDefault();
    heroBaslik.textContent = t("heroTitle");
    heroAlt.textContent = t("heroSubtitle");
    tumPlajlarButon.href = "liste.html";
    tumPlajlarMetin.textContent = t("seeAllBeaches");
    ilceAlan.style.display = "none";
    sehirAlan.style.display = "";
  });

  // Plaj arama (isim / ilçe üzerinden anlık arama)
  const aramaInput = document.getElementById("arama-input");
  const aramaSonuclar = document.getElementById("arama-sonuclar");
  let aramaSeciliIndex = -1;

  function turkceKucuk(s) {
    return s.toLocaleLowerCase("tr-TR");
  }

  function aramaCiz(sorgu) {
    const q = turkceKucuk(sorgu.trim());
    aramaSeciliIndex = -1;

    if (!q) {
      aramaSonuclar.classList.remove("acik");
      aramaSonuclar.innerHTML = "";
      return;
    }

    const eslesenler = PLAJLAR.filter(p =>
      turkceKucuk(p.isim).includes(q) || turkceKucuk(p.ilce).includes(q) || turkceKucuk(p.il).includes(q)
    ).slice(0, 8);

    aramaSonuclar.innerHTML = eslesenler.length === 0
      ? `<div class="arama-bos">${t("searchNoResults")}</div>`
      : eslesenler.map(p => `
          <a href="plaj.html?id=${p.id}" class="arama-oge">
            <span class="arama-oge-isim">${p.isim}</span>
            <span class="arama-oge-konum">${p.ilce} / ${p.il}</span>
          </a>
        `).join("");

    aramaSonuclar.classList.add("acik");
  }

  aramaInput.addEventListener("input", (e) => aramaCiz(e.target.value));
  aramaInput.addEventListener("focus", (e) => {
    if (e.target.value.trim()) aramaCiz(e.target.value);
  });

  aramaInput.addEventListener("keydown", (e) => {
    const ogeler = Array.from(aramaSonuclar.querySelectorAll(".arama-oge"));

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (ogeler.length === 0) return;
      aramaSeciliIndex = (aramaSeciliIndex + 1) % ogeler.length;
      ogeler.forEach((el, i) => el.classList.toggle("secili", i === aramaSeciliIndex));
      ogeler[aramaSeciliIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (ogeler.length === 0) return;
      aramaSeciliIndex = (aramaSeciliIndex - 1 + ogeler.length) % ogeler.length;
      ogeler.forEach((el, i) => el.classList.toggle("secili", i === aramaSeciliIndex));
      ogeler[aramaSeciliIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hedef = aramaSeciliIndex >= 0 ? ogeler[aramaSeciliIndex] : ogeler[0];
      if (hedef) window.location.href = hedef.getAttribute("href");
    } else if (e.key === "Escape") {
      aramaSonuclar.classList.remove("acik");
      aramaInput.blur();
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".arama-alan")) {
      aramaSonuclar.classList.remove("acik");
    }
  });
