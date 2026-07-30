const DIL_ANAHTARI = "dilTercihi";
const DESTEKLENEN_DILLER = ["tr", "en", "de", "ru"];
const DIL_BAYRAK = { tr: "🇹🇷", en: "🇬🇧", de: "🇩🇪", ru: "🇷🇺" };
const DIL_ETIKET = { tr: "TR", en: "EN", de: "DE", ru: "RU" };
const DIL_ISIM = { tr: "Türkçe", en: "English", de: "Deutsch", ru: "Русский" };

const I18N = {
  tr: {
    freeBadge: "🆓 Ücretsiz Halk Plajları",
    heroTitle: "Nereye gidelim?",
    heroSubtitle: "Güzel bir tatili herkes hak eder",
    searchPlaceholder: "Plaj ara... (örn. Mimoza, Altınkum)",
    seeAllBeaches: "Tüm Plajları Gör",
    seeAllBeachesCity: (il) => `Tüm ${il} Plajlarını Gör`,
    chooseCityTitle: "Önce şehir seç",
    beachSuffix: "plaj",
    backToHome: "← Ana Sayfaya Dön",
    districtsSubtitle: "En meşhur sahil ilçeleri",
    comingSoon: "yakında",
    districtsFooterNote: "Zamanla tüm ilçeler eklenecek 🙂",
    searchNoResults: "Sonuç bulunamadı",
    ratingMethodTitle: "⭐ Yıldız puanları nasıl hesaplanıyor?",
    ratingMethodText: "Her plaj 3 yıldızdan başlar. Mavi Bayrak sertifikası varsa +1, kaynaklarda ulusal/uluslararası düzeyde tanınmış veya popüler olarak öne çıkıyorsa +1 yıldız eklenir. Kaynaklarda belirgin olumsuz yorumlar (kirli, bakımsız vb.) varsa 1 yıldız düşülür. Puanlar dışarıdan bir değerlendirme sitesinden alınmıyor; açık kaynak araştırmasına dayanan otomatik bir değerlendirmedir.",

    pageTitleList: "Ücretsiz Halk Plajları Rehberi",
    backToHomePage: "← Ana Sayfa",
    listHeading: "🏖️ Ücretsiz Halk Plajları",
    listSubtitle: "Giriş ücreti yok. Sadece halk plajları.",
    priceNoticeList: '💡 Enflasyon ve hızlı fiyat değişimleri sebebiyle şezlong/tuvalet gibi hizmetlerde fiyat bilgisi verilmemektedir. Sadece "ücretli/ücretsiz" olduğu belirtilir.',
    allCities: "Tüm Şehirler",
    allDistricts: "Tüm İlçeler",
    allGrounds: "Tüm Zeminler",
    allDepths: "Tüm Derinlikler",
    allParking: "Tüm Park Durumları",
    parkFreeOption: "Ücretsiz Park",
    parkPartialOption: "Kısmi/Kısıtlı",
    parkPaidOption: "Ücretli Park",
    resultsCount: (n) => `${n} plaj bulundu`,
    noMatch: "Bu filtrelere uyan plaj bulunamadı.",
    parkFree: "Ücretsiz Park",
    parkPartial: "Kısmi Park",
    parkPaid: "Ücretli Park",
    parkUnknown: "Park Bilgisi Yok",
    parkNone: "Park Yok",
    showerYes: "Duş Var",
    toiletYes: "Tuvalet Var",
    toiletNo: "Tuvalet Yok",

    pageTitleDetail: "Plaj Detayı — Ücretsiz Halk Plajları",
    backToList: "← Listeye Dön",
    beachNotFoundTitle: "Plaj Bulunamadı",
    beachNotFoundMsg: "Bu plaj bulunamadı. Listeye dönüp tekrar deneyin.",
    sourceDisclaimer: "🌐 Bu bilgiler internet araştırmasından derlendi, saha doğrulaması henüz yapılmadı.",
    priceNoticeDetail: '💡 Enflasyon ve hızlı fiyat değişimleri sebebiyle fiyat bilgisi verilmemektedir. Sadece "ücretli/ücretsiz" olduğu belirtilir.',
    contentTrOnlyNotice: "",
    generalInfo: "Genel Bilgiler",
    ground: "Zemin",
    depth: "Derinlik",
    parkingStatus: "Park Durumu",
    facilitiesTitle: "Duş / Tuvalet / Kabin",
    shower: "Duş",
    toilet: "Tuvalet",
    cabin: "Kabin",
    yes: "Var",
    no: "Yok",
    beachComfort: "Sahil Konforu",
    walkDistance: "Otopark → Sahil Yürüyüş",
    sunbed: "Şemsiye / Şezlong",
    waveCondition: "Dalga Durumu",
    shopping: "Alışveriş / Yeme-İçme",
    childFriendly: "Çocuklar İçin Uygunluk",
    crowdLevel: "Kalabalık Durumu",
    cleanliness: "Temizlik",
    otherNotes: "Diğer Notlar",
    directions: "📍 Yol Tarifi Al",
    sourcePrefix: "Kaynak:",
    lightboxClose: "✕ Kapat"
  },

  en: {
    freeBadge: "🆓 Free Public Beaches",
    heroTitle: "Where shall we go?",
    heroSubtitle: "Everyone deserves a great holiday",
    searchPlaceholder: "Search a beach... (e.g. Mimoza, Altınkum)",
    seeAllBeaches: "See All Beaches",
    seeAllBeachesCity: (il) => `See All ${il} Beaches`,
    chooseCityTitle: "First, choose a city",
    beachSuffix: "beaches",
    backToHome: "← Back to Home",
    districtsSubtitle: "Most popular coastal districts",
    comingSoon: "coming soon",
    districtsFooterNote: "More districts will be added over time 🙂",
    searchNoResults: "No results found",
    ratingMethodTitle: "⭐ How are star ratings calculated?",
    ratingMethodText: "Every beach starts at 3 stars. It gets +1 star for holding Blue Flag certification, and +1 star if sources describe it as nationally or internationally well-known or popular. 1 star is deducted if sources mention clear negative feedback (dirty, poorly maintained, etc.). Ratings aren't pulled from an external review site — they're an automatic assessment based on our open-source research.",

    pageTitleList: "Free Public Beaches Guide",
    backToHomePage: "← Home",
    listHeading: "🏖️ Free Public Beaches",
    listSubtitle: "No entry fee. Public beaches only.",
    priceNoticeList: "💡 Due to inflation and fast-changing prices, we don't list exact prices for services like sunbeds/toilets — only whether they're \"paid\" or \"free\".",
    allCities: "All Cities",
    allDistricts: "All Districts",
    allGrounds: "All Ground Types",
    allDepths: "All Depths",
    allParking: "All Parking Types",
    parkFreeOption: "Free Parking",
    parkPartialOption: "Partial/Limited",
    parkPaidOption: "Paid Parking",
    resultsCount: (n) => `${n} beaches found`,
    noMatch: "No beaches match these filters.",
    parkFree: "Free Parking",
    parkPartial: "Partial Parking",
    parkPaid: "Paid Parking",
    parkUnknown: "Parking Info Unknown",
    parkNone: "No Parking",
    showerYes: "Shower Available",
    toiletYes: "Toilet Available",
    toiletNo: "No Toilet",

    pageTitleDetail: "Beach Details — Free Public Beaches",
    backToList: "← Back to List",
    beachNotFoundTitle: "Beach Not Found",
    beachNotFoundMsg: "This beach could not be found. Please go back to the list and try again.",
    sourceDisclaimer: "🌐 This information was compiled from internet research and has not yet been field-verified.",
    priceNoticeDetail: "💡 Due to inflation and fast-changing prices, exact price figures are not listed — only whether something is \"paid\" or \"free\".",
    contentTrOnlyNotice: "ℹ️ Detailed descriptions below are currently available in Turkish only.",
    generalInfo: "General Information",
    ground: "Ground",
    depth: "Depth",
    parkingStatus: "Parking",
    facilitiesTitle: "Shower / Toilet / Cabin",
    shower: "Shower",
    toilet: "Toilet",
    cabin: "Changing Cabin",
    yes: "Yes",
    no: "No",
    beachComfort: "Beach Comfort",
    walkDistance: "Parking → Beach Walk",
    sunbed: "Umbrella / Sunbed",
    waveCondition: "Wave Conditions",
    shopping: "Shopping / Food & Drink",
    childFriendly: "Suitability for Children",
    crowdLevel: "Crowd Level",
    cleanliness: "Cleanliness",
    otherNotes: "Other Notes",
    directions: "📍 Get Directions",
    sourcePrefix: "Source:",
    lightboxClose: "✕ Close"
  },

  de: {
    freeBadge: "🆓 Kostenlose öffentliche Strände",
    heroTitle: "Wohin soll's gehen?",
    heroSubtitle: "Jeder verdient einen schönen Urlaub",
    searchPlaceholder: "Strand suchen... (z. B. Mimoza, Altınkum)",
    seeAllBeaches: "Alle Strände ansehen",
    seeAllBeachesCity: (il) => `Alle Strände in ${il} ansehen`,
    chooseCityTitle: "Zuerst eine Stadt wählen",
    beachSuffix: "Strände",
    backToHome: "← Zurück zur Startseite",
    districtsSubtitle: "Beliebteste Küstenbezirke",
    comingSoon: "demnächst",
    districtsFooterNote: "Weitere Bezirke werden nach und nach ergänzt 🙂",
    ratingMethodTitle: "⭐ Wie werden die Sternebewertungen berechnet?",
    ratingMethodText: "Jeder Strand startet mit 3 Sternen. +1 Stern gibt es bei Blaue-Flagge-Zertifizierung, +1 Stern, wenn Quellen ihn als national oder international bekannt oder beliebt beschreiben. 1 Stern wird abgezogen, wenn Quellen deutlich negatives Feedback erwähnen (schmutzig, schlecht gepflegt usw.). Die Bewertungen stammen nicht von einer externen Bewertungsseite — sie sind eine automatische Einschätzung auf Basis unserer offenen Quellenrecherche.",
    searchNoResults: "Keine Ergebnisse gefunden",

    pageTitleList: "Führer zu kostenlosen öffentlichen Stränden",
    backToHomePage: "← Startseite",
    listHeading: "🏖️ Kostenlose öffentliche Strände",
    listSubtitle: "Kein Eintritt. Nur öffentliche Strände.",
    priceNoticeList: "💡 Wegen Inflation und sich schnell ändernder Preise geben wir keine genauen Preise für Leistungen wie Liegen/Toiletten an — nur ob sie \"kostenpflichtig\" oder \"kostenlos\" sind.",
    allCities: "Alle Städte",
    allDistricts: "Alle Bezirke",
    allGrounds: "Alle Untergrundarten",
    allDepths: "Alle Wassertiefen",
    allParking: "Alle Parkmöglichkeiten",
    parkFreeOption: "Kostenloses Parken",
    parkPartialOption: "Teilweise/Begrenzt",
    parkPaidOption: "Kostenpflichtiges Parken",
    resultsCount: (n) => `${n} Strände gefunden`,
    noMatch: "Keine Strände entsprechen diesen Filtern.",
    parkFree: "Kostenloses Parken",
    parkPartial: "Teilweise Parken",
    parkPaid: "Kostenpflichtiges Parken",
    parkUnknown: "Parkinfo unbekannt",
    parkNone: "Kein Parkplatz",
    showerYes: "Dusche vorhanden",
    toiletYes: "Toilette vorhanden",
    toiletNo: "Keine Toilette",

    pageTitleDetail: "Strand-Details — Kostenlose öffentliche Strände",
    backToList: "← Zurück zur Liste",
    beachNotFoundTitle: "Strand nicht gefunden",
    beachNotFoundMsg: "Dieser Strand konnte nicht gefunden werden. Bitte zurück zur Liste gehen und erneut versuchen.",
    sourceDisclaimer: "🌐 Diese Informationen stammen aus Internetrecherchen und wurden noch nicht vor Ort überprüft.",
    priceNoticeDetail: "💡 Wegen Inflation und sich schnell ändernder Preise werden keine genauen Preisangaben gemacht — nur ob etwas \"kostenpflichtig\" oder \"kostenlos\" ist.",
    contentTrOnlyNotice: "ℹ️ Die ausführlichen Beschreibungen unten sind derzeit nur auf Türkisch verfügbar.",
    generalInfo: "Allgemeine Informationen",
    ground: "Untergrund",
    depth: "Wassertiefe",
    parkingStatus: "Parkplatzsituation",
    facilitiesTitle: "Dusche / Toilette / Kabine",
    shower: "Dusche",
    toilet: "Toilette",
    cabin: "Umkleidekabine",
    yes: "Ja",
    no: "Nein",
    beachComfort: "Strandkomfort",
    walkDistance: "Parkplatz → Strand (Fußweg)",
    sunbed: "Sonnenschirm / Liege",
    waveCondition: "Wellenbedingungen",
    shopping: "Einkaufen / Essen & Trinken",
    childFriendly: "Eignung für Kinder",
    crowdLevel: "Andrang",
    cleanliness: "Sauberkeit",
    otherNotes: "Weitere Hinweise",
    directions: "📍 Route anzeigen",
    sourcePrefix: "Quelle:",
    lightboxClose: "✕ Schließen"
  },

  ru: {
    freeBadge: "🆓 Бесплатные общественные пляжи",
    heroTitle: "Куда отправимся?",
    heroSubtitle: "Каждый заслуживает хороший отдых",
    searchPlaceholder: "Поиск пляжа... (напр. Mimoza, Altınkum)",
    seeAllBeaches: "Смотреть все пляжи",
    seeAllBeachesCity: (il) => `Смотреть все пляжи: ${il}`,
    chooseCityTitle: "Сначала выберите город",
    beachSuffix: "пляжей",
    backToHome: "← Вернуться на главную",
    districtsSubtitle: "Самые популярные прибрежные районы",
    comingSoon: "скоро",
    districtsFooterNote: "Со временем добавятся и остальные районы 🙂",
    ratingMethodTitle: "⭐ Как рассчитывается рейтинг в звёздах?",
    ratingMethodText: "Каждый пляж начинается с 3 звёзд. +1 звезда — за сертификат «Голубой флаг», +1 звезда — если источники описывают его как известный или популярный на национальном или международном уровне. 1 звезда вычитается, если источники упоминают явно негативные отзывы (грязно, плохое состояние и т.д.). Рейтинги не берутся со стороннего сайта отзывов — это автоматическая оценка на основе нашего открытого исследования.",
    searchNoResults: "Ничего не найдено",

    pageTitleList: "Путеводитель по бесплатным общественным пляжам",
    backToHomePage: "← Главная",
    listHeading: "🏖️ Бесплатные общественные пляжи",
    listSubtitle: "Без платы за вход. Только общественные пляжи.",
    priceNoticeList: "💡 Из-за инфляции и быстро меняющихся цен точные цены на шезлонги/туалеты не указываются — только пометка «платно» или «бесплатно».",
    allCities: "Все города",
    allDistricts: "Все районы",
    allGrounds: "Все типы покрытия",
    allDepths: "Вся глубина",
    allParking: "Все виды парковки",
    parkFreeOption: "Бесплатная парковка",
    parkPartialOption: "Частично/ограничено",
    parkPaidOption: "Платная парковка",
    resultsCount: (n) => `Найдено пляжей: ${n}`,
    noMatch: "Нет пляжей, соответствующих этим фильтрам.",
    parkFree: "Бесплатная парковка",
    parkPartial: "Частичная парковка",
    parkPaid: "Платная парковка",
    parkUnknown: "Нет данных о парковке",
    parkNone: "Парковки нет",
    showerYes: "Есть душ",
    toiletYes: "Есть туалет",
    toiletNo: "Туалета нет",

    pageTitleDetail: "О пляже — Бесплатные общественные пляжи",
    backToList: "← Назад к списку",
    beachNotFoundTitle: "Пляж не найден",
    beachNotFoundMsg: "Этот пляж не найден. Вернитесь к списку и попробуйте снова.",
    sourceDisclaimer: "🌐 Эта информация собрана из интернет-источников и пока не проверена на месте.",
    priceNoticeDetail: "💡 Из-за инфляции и быстро меняющихся цен точные цены не указываются — только пометка «платно» или «бесплатно».",
    contentTrOnlyNotice: "ℹ️ Подробные описания ниже пока доступны только на турецком языке.",
    generalInfo: "Общая информация",
    ground: "Тип дна/покрытия",
    depth: "Глубина",
    parkingStatus: "Парковка",
    facilitiesTitle: "Душ / Туалет / Кабинка",
    shower: "Душ",
    toilet: "Туалет",
    cabin: "Кабинка для переодевания",
    yes: "Есть",
    no: "Нет",
    beachComfort: "Удобства пляжа",
    walkDistance: "От парковки до пляжа пешком",
    sunbed: "Зонт / Шезлонг",
    waveCondition: "Волны",
    shopping: "Магазины / Еда и напитки",
    childFriendly: "Подходит для детей",
    crowdLevel: "Загруженность",
    cleanliness: "Чистота",
    otherNotes: "Прочие заметки",
    directions: "📍 Построить маршрут",
    sourcePrefix: "Источник:",
    lightboxClose: "✕ Закрыть"
  }
};

const ENUM_I18N = {
  zemin: {
    "Kumsal": { en: "Sandy", de: "Sandstrand", ru: "Песчаный" },
    "Kum": { en: "Sand", de: "Sand", ru: "Песок" },
    "Çakıl": { en: "Pebble", de: "Kies", ru: "Галька" },
    "Taşlık": { en: "Rocky", de: "Steinig", ru: "Каменистый" },
    "Karışık": { en: "Mixed", de: "Gemischt", ru: "Смешанный" },
    "Kum-Çakıl": { en: "Sand & Pebble", de: "Sand & Kies", ru: "Песок и галька" },
    "Kum-Taşlık": { en: "Sand & Rock", de: "Sand & Stein", ru: "Песок и камни" },
    "Bilinmiyor": { en: "Unknown", de: "Unbekannt", ru: "Неизвестно" }
  },
  derinlik: {
    "Sığ": { en: "Shallow", de: "Flach", ru: "Мелко" },
    "Çok Sığ": { en: "Very Shallow", de: "Sehr flach", ru: "Очень мелко" },
    "Derin": { en: "Deep", de: "Tief", ru: "Глубоко" },
    "Bilinmiyor": { en: "Unknown", de: "Unbekannt", ru: "Неизвестно" }
  }
};

function getLang() {
  const kayitli = localStorage.getItem(DIL_ANAHTARI);
  return DESTEKLENEN_DILLER.includes(kayitli) ? kayitli : "tr";
}

function setLang(lang) {
  if (!DESTEKLENEN_DILLER.includes(lang)) return;
  localStorage.setItem(DIL_ANAHTARI, lang);
  window.location.reload();
}

function t(key, ...args) {
  const lang = getLang();
  const sozluk = I18N[lang] || I18N.tr;
  const deger = sozluk[key] !== undefined ? sozluk[key] : I18N.tr[key];
  return typeof deger === "function" ? deger(...args) : deger;
}

function trValue(alan, deger) {
  const lang = getLang();
  if (lang === "tr" || !deger) return deger;
  const cevirilenAlan = ENUM_I18N[alan];
  if (!cevirilenAlan || !cevirilenAlan[deger]) return deger;
  return cevirilenAlan[deger][lang] || deger;
}

function applyI18n(root) {
  (root || document).querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const deger = t(key);
    if (el.dataset.i18nAttr) {
      el.setAttribute(el.dataset.i18nAttr, deger);
    } else {
      el.innerHTML = deger;
    }
  });
}

function dilSeciciOlustur(containerId) {
  const kapsayici = document.getElementById(containerId);
  if (!kapsayici) return;
  const aktifDil = getLang();
  kapsayici.innerHTML = DESTEKLENEN_DILLER.map((lang) => `
    <button type="button" class="dil-buton ${lang === aktifDil ? "aktif" : ""}" data-lang="${lang}" aria-label="${DIL_ISIM[lang]}" title="${DIL_ISIM[lang]}">
      <span class="dil-bayrak">${DIL_BAYRAK[lang]}</span>
      <span class="dil-isim">${DIL_ISIM[lang]}</span>
    </button>
  `).join("");
  kapsayici.querySelectorAll(".dil-buton").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
}

document.addEventListener("DOMContentLoaded", () => applyI18n());
