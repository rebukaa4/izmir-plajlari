  // Popülerlik sırasıyla şehir başına ilçeler (veri henüz olmayanlar da listelenir)
  const ILCELER_BY_IL = {
    "İzmir": ["Çeşme", "Urla", "Foça", "Seferihisar", "Dikili", "Karaburun"],
    "Aydın": ["Kuşadası", "Didim"],
    "Muğla": ["Fethiye", "Marmaris", "Bodrum", "Dalyan/Ortaca"],
    "Antalya": ["Muratpaşa", "Kaş", "Kemer"]
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

  Object.keys(ILCELER_BY_IL).forEach((il, i) => {
    const sayi = PLAJLAR.filter(p => p.il === il).length;
    const a = document.createElement("a");
    const sehirRenk = SEHIR_RENK_HARITASI[il] || yedekSehirRenkleri[i % yedekSehirRenkleri.length];
    a.className = `ilce-kart ${sehirRenk}`;
    a.href = "#";
    a.innerHTML = `
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
      a.href = `liste.html?ilce=${encodeURIComponent(ilce)}`;
      a.innerHTML = `
        <span class="ilce-adi">${ilce}</span>
        <span class="ilce-sayi">${sayi > 0 ? sayi + " " + t("beachSuffix") : t("comingSoon")}</span>
      `;
      ilceGrid.appendChild(a);
    });

    sehirAlan.style.display = "none";
    ilceAlan.style.display = "";
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
