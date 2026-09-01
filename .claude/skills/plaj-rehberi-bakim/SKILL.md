---
name: plaj-rehberi-bakim
description: Maintains the "Ücretsiz Halk Plajları Rehberi" (İzmir/Aydın/Muğla/Antalya beach guide) web app at C:\Users\PC-PC\Desktop\Mobil Uygulama Plajlar\izmir-plajlari\, live at rebukaa4.github.io/izmir-plajlari. Use this skill whenever the user wants to add, update, or research beaches for this app; process the "Plaj Bilgi Formu.xlsx" from their Desktop; add a new city/region of beaches; touch any file under this project (js/data.js, index.html, liste.html, plaj.html, css/style.css, etc.); bump versions or deploy; or asks anything about "plaj uygulaması", "plaj rehberi", "plaj formu", or the beach app in general — even if they don't mention a specific file. The user has zero coding background, so this skill also governs HOW to talk to them about this project.
---

# Plaj Rehberi Bakımı

Bu proje canlı bir web uygulaması — her değişiklik gerçek kullanıcılara gidiyor (site + Android/TWA sürümü). Kullanıcı kod bilmiyor, bu yüzden hem teknik doğruluk hem de anlatım şekli önemli.

## Kullanıcıyla konuşurken

- Jargon yok. "Cache-busting", "deploy", "commit" gibi terimleri kullanıcıya söyleme — "sayfayı tazeledim", "canlıya aldım" gibi günlük dille anlat.
- Adım adım anlatma, gereksiz süreç anlatımı yapma. Ne yaptığını 1-2 cümleyle özetle, sonucu göster.
- Rapor/çıktı dosyaları (Excel, ekran görüntüsü vb.) doğrudan Masaüstü'ne kaydedilir, izin sorulmaz.
- Kullanıcı onay vermeden GitHub'a push YAPMA — yerelde önce göster/test et, sonra "canlıya alalım mı?" diye sor. Bu, geri alınması kolay olmayan bir adım (herkes görür).

## Proje haritası

```
izmir-plajlari/
├── js/data.js        ← PLAJLAR dizisi, tüm plaj verisi burada (~400KB, büyük dosya)
├── js/liste.js        ← Liste sayfası: filtreler, arama, SEHIR_RENK haritası
├── js/anasayfa.js     ← Ana sayfa: şehir kartları, SEHIR_RENK_HARITASI (liste.js ile AYNI olmalı)
├── js/detay.js         ← Plaj detay sayfasının mantığı (dosya adı "detay" ama HTML dosyası plaj.html)
├── js/i18n.js          ← Çeviri metinleri (TR/EN/DE/RU arayüz metinleri)
├── index.html, liste.html, plaj.html, privacy.html
└── css/style.css, css/fonts.css
```

Bir plaj objesinin alanları (js/data.js içinde): `isim, ilce, il, zemin, derinlik, park, parkNotu, dus, tuvalet, kabin, tuvaletNotu, yayaMesafe, sezlong, dalgaDurumu, aliverisYemeIcme, cocukUygun, kalabalik, temizlik, notlar, haritaLinki, kaynaklar, fotograflar, kaynak, ceviriler:{en,de,ru}`. Yeni plaj eklerken bu alanların hepsini doldurmaya çalış ama bilinmeyeni **boş bırak** — asla uydurma.

## Kesin kurallar (içerik)

- **Fiyat/TL yazma.** Hiçbir plaj açıklamasına fiyat rakamı koyma (fiyatlar çok sık değişiyor, kullanıcıyı yanıltır). Sadece "ücretli/ücretsiz/kısmi ücretli" gibi durum belirt.
- **Editöryel not bırakma.** "(daha önce yanlış yazılmıştı, düzeltildi)" gibi kullanıcıya dönük düzeltme/araştırma izleri metinde KALMAMALI. İç düşünce süreci asla kullanıcı metnine sızmamalı.
- **Kaynak sırası:** Önce tripadvisor.com.tr, gezinomi.com, bizevdeyokuz.com. Yeni bir bölge/şehir eklerken önce o bölgeye en çok turist gönderen ülkelerin kendi dilindeki popüler gezi rehberlerine bak (İngilizce/Almanca/Rusça — Lonely Planet, ADAC, tourister.ru gibi) ve öne çıkan plajları önceliklendir, sonra Türkçe kaynaklarla saha detayını derinleştir.
- Kullandığın kaynakları `kaynaklar` alanına ekle.

## İki yerde senkron kalması gereken şey

`SEHIR_RENK` (js/liste.js) ve `SEHIR_RENK_HARITASI` (js/anasayfa.js) aynı şehir→renk eşleşmesini tutuyor. Yeni bir şehir eklerken **ikisini birden** güncelle — biri unutulursa o şehrin kartları/filtreleri renksiz/tutarsız görünür.

## Cache-busting (sayfa tazeleme)

`css/style.css`, `js/*.js` gibi dosyalardan birine dokunduğunda, o dosyayı çağıran HER html dosyasındaki `?v=N` sayısını bir artır (örn. `data.js?v=62` → `?v=63`). Bunu atlarsan kullanıcılar tarayıcı önbelleğinden eski sürümü görmeye devam eder — sessiz ve fark edilmesi zor bir hata olur, bu yüzden her JS/CSS değişikliğinden sonra kontrol listesi gibi düşün. `grep -o '\.\(css\|js\)?v=[0-9]*' index.html liste.html plaj.html` ile hangi sürümde olduklarını hızlıca görebilirsin.

## Excel formu iş akışı ("plaj formunu güncelledim")

Kullanıcı Masaüstü'ndeki **"Plaj Bilgi Formu.xlsx"** dosyasını dolduruyor: yeni plaj eklediğinde o **satırı**, var olan bir plajın eksik bilgisini tamamladığında o **hücreyi** sarıya boyuyor. Kullanıcı "plaj formunu güncelledim" dediğinde:

1. `openpyxl` ile dosyayı aç (`C:\Users\PC-PC\Desktop\Plaj Bilgi Formu.xlsx`), her hücrenin `fill.fgColor.rgb` değerine bakarak sarı işaretli satır/hücreleri bul (sarı dolgu genelde `FFFF00` civarı — tam kodu ilk formda kullanıcının seçtiği sarıyla karşılaştır, farklı sarı tonları da olabilir).
2. Sarı **satırlar** → yeni plaj olarak `js/data.js`'e ekle (id, mevcut en yüksek id'den devam).
3. Sarı **hücreler** → o plajı isimden bulup ilgili alanı güncelle.
4. Hangi plajların eklendiğini/güncellendiğini kullanıcıya kısa bir özetle bildir, teknik detay verme.
5. Fotoğraf eklenmişse (kullanıcı ayrıca "Plaj Foto" klasörüne atıyor), `fotograflar` alanına doğru yolu ekle.

Form ilk oluşturulurken kullanılan Python betikleri `plaj_form2.py` / `plaj_form.py` scratchpad'de örnek olarak duruyor — yapı/sütun sırası referansı olarak kullanılabilir ama form zaten Masaüstü'nde hazır, yeniden oluşturmaya gerek yok.

## Canlıya alma (deploy)

Kullanıcı onayladıktan sonra: `git add`, `git commit`, `git push` → `rebukaa4/izmir-plajlari` reposuna gider, GitHub Pages otomatik yayınlar (birkaç dakika sürebilir). Android/TWA uygulaması da web içeriğini canlıdan çektiği için **ayrı bir Android derlemesi gerekmez** — sadece ikon/manifest/native seviye bir şey değiştiyse (nadiren) yeni bir AAB derlemesi gerekir; bu durumda önceki oturumlardan hatırlanan yerel Android araç zincirini (JDK 17 + Android SDK + Bubblewrap, `C:\Users\PC-PC\.bubblewrap`) kullan.

## Yeni şehir/bölge ekleme

Mimari zaten çok-şehirli (İl alanı, filtre yapısı) — yeni şehir eklemek saf içerik işi, kod değişikliği gerekmiyor. Sıra: (1) uluslararası kaynaklardan öncelik listesi çıkar, (2) Türkçe kaynaklarla saha detayı araştır, (3) `js/data.js`'e ekle, (4) `index.html`'deki ilçe listesine ekle, (5) SEHIR_RENK haritalarını güncelle, (6) versiyonları artır, (7) yerelde göster, onay al, canlıya al.
