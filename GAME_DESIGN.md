# CAVORA — Ürün ve Oyun Tasarım Dokümanı
### Web tabanlı, taş devri temalı match-3 puzzle oyunu
**Versiyon:** 1.0 · **Tarih:** 12 Haziran 2026 · **Kapsam:** Lansman içeriği (ilk 50 level, 2 bölge)

Bu doküman, oyunun tüm ürün mantığını tanımlar: oyun döngüsü, board kuralları, taşlar, engeller, level akışı, ekranlar, ödül sistemleri, zorluk dengesi ve üretim ekibine verilen net kararlar. Teknik altyapı bilinçli olarak kapsam dışıdır.

---

## 1. Oyun Özeti

**Cavora**, sıcak ışıklı bir taş devri mağarasında geçen, parlak taş-şekerlerin eşleştirilip patlatıldığı, web'den oynanan bir match-3 puzzle oyunudur.

Oyuncu, Büyük Köz Mağarası'nın derinliklerine inen bir yol üzerinde level level ilerler. Her levelde net bir hedef vardır: taş topla, kasa kır, buz çöz, totem indir. Oyuncu komşu taşları kaydırır, 3 ve üzeri eşleşmeler patlar, yukarıdan yeni taşlar düşer, kombolar zincirlenir. 4'lü, 5'li ve T/L eşleşmeler güçlü özel taşlar üretir; iki özel taşın birleşimi ekranı dolduran ama asla okunmaz hale getirmeyen tok patlamalar yaratır.

**Dünya:** Amber damarlı mağara duvarları, lav ışığının sıcak turuncusu, turkuaz kristaller, yosunlu kayalar, ay taşı parıltısı, fosiller ve duvarlardaki mağara resimleri. Tarih öncesi ama kaliteli; çocukça değil, premium casual.

**Dört tasarım sütunu (tüm kararların turnusol testi):**

1. **Anında Anlaşılırlık** — Oyuncu hiçbir anda "şimdi ne yapmam gerekiyor?" diye düşünmez. Hedef her an görünür, her taş silüetinden tanınır, her efekt sonucunu gösterir.
2. **Tok Tatmin** — Her patlama kısa, hızlı ve dolgun hissettirir. 3'lü küçük bir "çıt", 5'li bir olay, kombinasyon bir kutlamadır.
3. **Adil Zorluk** — Kayıp her zaman "az kaldı, daha iyi oynarsam geçerim" hissi bırakır. Board asla oyuncuya karşı hile yapmaz; kontrollü rastgelelik kuralları bunu garanti eder.
4. **Sıcak Premium His** — Görsel, ses ve dil; sıcak, tok, eğlenceli ve kaliteli. Ucuz clipart yok, agresif satış yok, suçlayıcı dil yok.

**Kapsam kararları (kilitli):**
- Board: 8x8 ızgara (ileri levellerde şekilli varyasyonlar).
- 6 ana taş türü; levellerde 4–6 arası kullanılır.
- 4 özel taş: Çizgi Patlatıcı, Mağara Bombası, Ruh Kristali, Fosil Roketi.
- 5 engel: Tahta Kasa, Buz, Zincir, Fosil Blok, Lav Taşı.
- 5 booster: Taş Çekici, Mağara Karıştırıcısı, +5 Hamle, Başlangıç Bombası, Kristal Yardımı.
- **Can/enerji sistemi yok.** Oyuncu istediği level'ı istediği kadar dener. Geri dönüş motivasyonu ceza ile değil; günlük görev, günlük challenge, streak ve harita ilerlemesi ile sağlanır.
- Lansman içeriği: 50 level, 2 harita bölgesi (Amber Girişi 1–25, Lav Kıvrımı 26–50).

---

## 2. Özgün İsim Önerileri

Önerilen ana isim: **Cavora** — kısa, global, telaffuzu kolay, "cave" + "aurora" çağrışımı mağaranın sıcak ışığını anlatır, hiçbir mevcut match-3 markasına benzemez.

| # | İsim | Neden uygun |
|---|------|-------------|
| 1 | **Cavora** *(önerilen)* | Kısa, akılda kalıcı, web alan adına uygun, tema ile birebir uyumlu, dile bağımsız |
| 2 | **Lumara** | "Lumen" + "mağara"; ışıklı mağara hissi, yumuşak ve premium tını |
| 3 | **Unga Pop** | Marka dili "Unga Bunga!" ile doğrudan bağ; eğlenceli, hatırlanabilir, sosyal paylaşıma uygun |
| 4 | **Boomga** | Patlama + caveman dili; enerjik, tek kelime, çocukça değil |
| 5 | **Amberfall** | Amber + yukarıdan düşen taşlar; oynanışı isimde anlatır |
| 6 | **Ember Den** | "Köz yuvası"; sıcak ışık temasını taşır, kısa ve tok |
| 7 | **Grotto Glow** | Aliterasyonlu, parlayan mağara; uluslararası pazara uygun |
| 8 | **Obsidya** | Obsidyenden türetilmiş; mistik, değerli taş hissi |
| 9 | **Krakka** | Taş kırılma sesi; oynanış hissini isimde verir |
| 10 | **Çakmak!** | Türkçe pazar için; çakmak taşı + kıvılcım, ünlemli ve enerjik |
| 11 | **Taşkıran** | Türkçe pazar için; oyuncunun yaptığı şeyi söyler, güçlü tını |
| 12 | **Közköz** | Sıcak, tekrarlı, sevimli ama bebeksi olmayan; lokal pazarda akılda kalıcı |

İsim kullanım kuralı: Dokümanın geri kalanında oyun **Cavora** olarak anılır. Logo; yuvarlak hatlı, taş dokulu, içinden amber ışık sızan harflerle tasarlanır. "Candy", "Crush", "Saga" kelimeleri ve türevleri hiçbir yerde kullanılmaz.

---

## 3. Hedef Kitle

**Ana kitle:** 18–45 yaş, casual ve puzzle oyuncuları; kısa seanslarda oynayan, mobil tarayıcı/masaüstü web kullanan, çocukça görünmeyen ama anında anlaşılan oyun arayan geniş kitle. Oyun bilgisi varsayılmaz; ilk hamle 10 saniyede öğrenilir.

**Beş oyuncu profili ve tutma stratejisi:**

| Profil | Ne ister? | Neden döner? | Nerede sıkılır? | Onu tutan sistem |
|---|---|---|---|---|
| **1. Hızlı oyuncu** | Anında aksiyon, hızlı level, bekletmeyen animasyon | "2 dakikam var, bir level oynayayım" | Uzun cutscene, yavaş cascade, popup kalabalığı | Kısa leveller (2–3 dk), hızlı animasyon, tek dokunuşla level'a girme, can sistemi olmaması |
| **2. Stratejik oyuncu** | Plan kurmak, özel taş biriktirmek, kombinasyon hazırlamak | "Şu kombinasyonu denemek istiyorum" | Tamamen şansa bağlı sonuçlar, plansız kazanılan leveller | Özel taş kombinasyon derinliği, engelli boardlar, 3 yıldız için verimli oynama, kombo hedefli leveller |
| **3. Görev takipçisi** | Net hedefler, tamamlanan kutucuklar, biriken ödüller | Günlük görevler sıfırlandı, streak devam ediyor | Görevler grind'a dönüşürse, ödül anlamsızsa | 3 günlük görev + haftalık görevler + başarımlar + streak'li günlük challenge |
| **4. Rahatlama oyuncusu** | Düşük baskı, tatmin edici patlamalar, sıcak atmosfer | "Kafa dağıtmak iyi geliyor" | Cezalandırıcı zorluk, agresif satış baskısı, gürültülü UI | Kolay/orta level ritmi, nefes leveller, sıcak görsel-işitsel his, kaybetmenin ucuz olması (can yok) |
| **5. Rekabet/puan oyuncusu** | Yüksek skor, 3 yıldız, kendini geçmek | "Şu level'da 3 yıldızım eksik" | Skorun şansa bağlı olması, yıldızın anlamsız olması | Yıldız sandıkları (yıldız eşiklerinde ödül), level tekrar oynama, günlük challenge skoru, başarımlar |

Tasarım sonucu: Her sistem en az bir profili hedefler; hiçbir sistem bir profili dışlamaz. Örnek: Günlük challenge hem görev takipçisini (streak) hem rekabetçiyi (skor) besler; hızlı oyuncuya da 1 level'lık net seans verir.

---

## 4. Ana Oyun Vaadi

> **"Sıcak ışıklı taş devri mağarasında parlak taş-şekerleri kaydırıp tok kombolar kur, engelleri kır, totemleri kurtar ve her kazandığın levelle mağaranın derinliklerine in."**

Vaadin dört sorusu ve cevapları:

- **Oyuncu ne yapıyor?** Komşu taşları kaydırıyor, eşleştiriyor, patlatıyor; net level hedeflerini tamamlayıp mağara haritasında ilerliyor.
- **Neden eğlenceli?** Her patlama tok ve tatmin edici; özel taşlar ve kombinasyonları güçlü "ben yaptım" anları yaratıyor; her level farklı bir mini bulmaca.
- **Neden geri dönüyor?** Günlük görevler ve streak'li günlük challenge, açılmayı bekleyen yeni mağara bölgeleri, sandıklar, eksik yıldızlar ve "bir level daha" hissi.
- **Neden özgün?** Şeker fabrikası değil, yaşayan bir mağara: amber, lav, kristal, fosil. Kendi taş silüetleri, kendi caveman mizahı ("Unga Bunga!"), kendi harita dili, kendi ses paleti. Tür mekaniği tanıdık, dünyası ve hissi tamamen kendine ait.

---

## 5. Core Game Loop

**Tek level döngüsü (60 saniye – 3 dakika):**

1. Oyuncu haritadan level'a dokunur.
2. Level Başlangıç Ekranı hedefi, hamle sayısını ve (varsa) önerilen boosterları gösterir. "Mağaraya Gir" ile başlar.
3. Board açılır: otomatik eşleşme yok, en az bir geçerli hamle garantili.
4. Oyuncu iki komşu taşı (yatay/dikey) kaydırır.
5. Eşleşme oluşursa taşlar patlar; 4'lü/5'li/T/L/kare eşleşmeler özel taş üretir.
6. Üstteki taşlar düşer, boşluklara yukarıdan yeni taşlar gelir.
7. Düşen taşlar yeni eşleşme yaparsa cascade (kombo dalgası) zinciri çalışır; zincir bitene kadar yeni hamle alınmaz; kombo çarpanı ve efekt şiddeti artar.
8. Hedef ilerlemesi her patlamada anında güncellenir (sayaç + hedefe uçan parçacıklar).
9. Hedef hamleler bitmeden tamamlanırsa: kalan her hamle **Kıvılcım Finali**'nde rastgele bir taşı özel taşa çevirip patlatır (bonus skor şovu), ardından Kazanma Ekranı.
10. Hamleler biter ve hedef tamamlanmazsa: önce **+5 Hamle** teklifi (coin ile, tek sefer), reddedilirse Kaybetme Ekranı.
11. Oyuncu tekrar dener (ücretsiz, sınırsız), booster ile dener veya haritaya döner.

**Meta döngü (oturumlar arası):** Level kazan → yıldız + coin kazan → her 10 level'da Köz Sandığı, bölüm sonunda Büyük Sandık → yıldız eşikleri Yıldız Sandığı açar → coin ile booster al → daha zor levelleri daha rahat geç → yeni bölge açıldıkça yeni engel/mekanik/görsel dünya → günlük görev ve challenge yarını işaret eder.

**Döngünün hissi:** Hızlı (hamle → sonuç 1 saniyenin altında başlar), anlaşılır (her patlamanın hedefe katkısı görünür), tatmin edici (ses + ekran titreşimi + parçacık), adil (kontrollü rastgelelik), tekrar oynanabilir (her deneme farklı board, aynı adil kurallar).

---

## 6. Seans Döngüsü

**1 dakikalık seans (hızlı oyuncu):**
- Açılış doğrudan haritaya gelir; sıradaki level tek dokunuş uzaklıkta, parlayan "Oyna" düğümü.
- 1 kısa level oynanır (erken leveller 60–90 saniye hedefli).
- Kazansa da kaybetse de çıkışta ilerleme izi kalır: yıldız eklendi, görev sayacı ilerledi ("2 level kazan: 1/2").
- Çıkış anında bekletme yok: kazanma ekranı 2 dokunuşta kapanır.

**5 dakikalık seans (tipik seans):**
- 2–4 level oynanır.
- Girişte günlük ödül alınır (tek dokunuş, tek ekran).
- En az 1 günlük görev doğal oyunla tamamlanır ("3 özel taş oluştur" gibi görevler normal oyunda kendiliğinden dolar).
- Seans içinde bir "yenilik dokunuşu" hedeflenir: yeni engel tanıtımı, sandık açılışı veya yeni bölge ön izlemesi.

**15 dakikalık seans (derin seans):**
- 4–7 level; ritim: kolay → orta → zor → nefes → mini zirve.
- Zor levelde 1–2 deneme kaybedilebilir; kayıp ekranı "ne kadar yaklaştın" gösterir, oyuncu "az kaldı" hissiyle tekrar dener.
- Seans bir milestone ile kapanmaya çalışılır: sandık, bölüm kapısı, 3 görev tamamlandı ödülü veya günlük challenge.

**Geri dönüş sebepleri (öncelik sırasıyla):**
1. Günlük görevler sıfırlandı (3 yeni görev + ödül).
2. Günlük challenge ve streak ("7. günü kaçırma").
3. Haritada yarım kalan level / yeni bölge merakı.
4. Yıldız eşiğine az kalmış Yıldız Sandığı.
5. Dün geçemediği level'a "bugün taze board'la" dönme isteği.
6. Günlük challenge'da daha iyi skor yapma.

---

## 7. Board Mantığı

**Temel yapı:**
- 8x8 ızgara; web mobil dikey ekranda ekran genişliğinin ~%92'sini, masaüstünde ortalanmış sabit alanı kaplar.
- Her hücre tek taş, engel veya boşluk (şekilli boardlarda) içerir.
- Taş boyutu mobilde minimum dokunma alanı kuralına uyar: bir taş, parmak ucuyla yanlışlıkla komşusuna basmadan seçilebilecek büyüklüktedir.

**Hamle kuralları:**
- Sadece yatay veya dikey komşu iki taş yer değiştirebilir. Çapraz hamle yok.
- Zincirli taş ve sabit engeller (kasa, fosil, lav) hareket ettirilemez; sürüklenmeye çalışılırsa kısa "kilitli" sarsıntısı + tık sesi verir, hamle harcanmaz.
- **Geçerli hamle:** Takas sonrası en az bir eşleşme oluşuyorsa. Hamle sayacı 1 azalır.
- **Geçersiz hamle:** Taşlar yer değiştirir gibi görünür (150 ms), eşleşme yoksa yumuşak bounce ile geri döner, hafif "tok olmayan" ses çalar. **Hamle harcanmaz.** Oyuncu cezalandırılmaz; deneme bedavadır.

**Board üretim kuralları (level başlangıcı):**
- Açılış dizilimi otomatik eşleşme içermez (hiçbir 3'lü hazır patlamaz).
- En az 1 geçerli hamle garanti edilir; hedef tipine göre açılışta 3+ geçerli hamle hedeflenir.
- Tutorial levellerinde (4, 6, 7, 26) açılış dizilimi script'lidir: öğretilen eşleşme tek hamlede kurulabilir durumda başlar.
- Hedef taş türleri açılış board'unda makul oranda bulunur (toplama hedefi olan tür, açılışta board'un en az %15'i).

**Akış kuralları:**
- Patlama sonrası taşlar yerçekimiyle sütun içinde düşer; boş hücrelere yukarıdan yeni taş gelir.
- Düşen/yeni taşlar eşleşme oluşturursa cascade dalgası başlar; her dalga kombo sayacını ve çarpanı artırır.
- Cascade zinciri bitmeden oyuncu girişi alınmaz; board bu sırada hafifçe karartılmaz, tam görünür kalır (oyuncu izleyip öğrenir).
- Fosil Blok ve Kasa yerçekimini bloke eder: üstlerindeki sütun akışı durur, taşlar yandan dolmaz; bu hücrelerin altı sadece yandaki sütunlardan çapraz kayma ile **dolmaz** — alt bölge ancak engel kırılınca beslenir. (Bu kural, engel kırmanın stratejik değerini yaratır.)

**Hamle kalmaması (shuffle):**
- Her cascade bittikten sonra sistem geçerli hamle var mı kontrol eder.
- Yoksa: 1 saniyelik "Mağara sallanıyor!" mesajı + board taşları yumuşak bir girdap animasyonuyla yeniden dizilir. **Ücretsizdir, hamle harcamaz, engelleri ve hedef ilerlemesini değiştirmez.**
- Karıştırma sonrası otomatik eşleşme oluşmaz ve en az 1 geçerli hamle garanti edilir.
- Aynı levelde art arda 3 karıştırma gerekirse board, mevcut taş dağılımı korunarak daha zengin bir dizilimle yeniden üretilir (oyuncu fark etmez, sadece "karıştı" görür).

**Sonsuz/aşırı uzun cascade önlemi:**
- Cascade dalgası 12'yi geçerse, yeni düşen taşlar o anki board'da eşleşme üretmeyecek türlerden seçilir (soft cap). Devam eden patlamalar normal tamamlanır.
- 8. dalgadan sonra düşme/patlama animasyon hızı %25 artar; zincir uzasa bile oyuncu bekletilmez.
- Oyuncuya hiçbir zaman "oyun kilitlendi" hissi verilmez: cascade sırasında kombo mesajları ve artan müzik notaları "bu bir ödül" duygusunu sürdürür.

---

## 8. Taş Türleri

6 ana taş; her biri **hem renk hem silüet hem iç doku** ile ayrışır. Renk körü bir oyuncu yalnızca silüetten tüm taşları ayırt edebilir — bu, taş tasarımının kabul kriteridir.

| # | Taş | Renk | Silüet (renksiz ayırt edici) | Doku/İç detay | Kişilik |
|---|-----|------|------------------------------|----------------|---------|
| 1 | **Amber Taşı** | Sıcak turuncu-sarı | Damla | İçinde minik fosil böcek silueti, bal gibi yarı saydam | Değerli, sıcak, "mağaranın altını" |
| 2 | **Lav Şekeri** | Kırmızı-magma | Altıgen | Koyu kabuk üstünde parlayan çatlak damarlar | Güçlü, enerjik, tehlikeli-tatlı |
| 3 | **Kristal Meyve** | Buz mavisi | Elmas (kesik kristal) | Faset yüzeyler, içten ışık kırılması | Serin, temiz, net |
| 4 | **Yosun Taşı** | Yeşil | Yuvarlak çakıl | Üstünde yumuşak yosun tutamları | Doğal, yumuşak, sakin |
| 5 | **Kıvılcım Kayası** | Sarı-elektrik | Dört uçlu yıldız | Uçlarında titreyen mikro kıvılcımlar (idle animasyon) | Enerjik, oyunbaz |
| 6 | **Ay Kemiği** | Beyaz-lila | Hilal | Kemik dokusu + ay taşı sedef parıltısı | Mistik, nadir, özel |

**Kullanım planı:** Level 1–10: ilk 4 taş (Amber, Lav, Kristal, Yosun). Level 11'de Kıvılcım Kayası, Level 38'de Ay Kemiği girer. Taş türü sayısı zorluk aracıdır: az tür = bol eşleşme = kolay; 6 tür sadece ferah, engelsiz boardlarda kullanılır.

**Taş tasarım kuralları (kilitli):**
- Silüet testi: 6 taş gri tonlamada yan yana konduğunda %100 ayırt edilebilir olmalı.
- Boyut testi: Taşlar küçük mobil ekranda (8x8 grid) iç detayını kaybetse bile silüet + ana renk ile okunabilir olmalı.
- Tüm taşlar aynı görsel dilde: hacimli, üstten sıcak mağara ışığı alan, altta yumuşak gölgeli, hafif yarı saydam "taş-şeker" hissi.
- Hiçbir taş mevcut popüler match-3 oyunlarının (özellikle King portföyü) şeker formlarına benzemez: jelibon fasulye, sarmal lolipop, paket şeker formları yasak.
- Idle durumda taşlar çok hafif "nefes alır" (1–2 piksel parlaklık salınımı); board ölü görünmez ama dikkat dağıtmaz.

---

## 9. Eşleşme Kuralları

**Temel eşleşmeler:**

| Eşleşme | Sonuç | Puan (baz) |
|---|---|---|
| 3 taş (yatay/dikey düz) | Taşlar patlar | 60 (taş başına 20) |
| 4 taş düz | Patlar + **Çizgi Patlatıcı** üretir | 120 |
| 2x2 kare | Patlar + **Fosil Roketi** üretir | 100 |
| T veya L (5 taş) | Patlar + **Mağara Bombası** üretir | 200 |
| 5 taş düz | Patlar + **Ruh Kristali** üretir | 300 |
| 6+ taş (tek şekilde) | Patlar + Ruh Kristali üretir + board'a 1 bonus Çizgi Patlatıcı rastgele hedef taşa yerleşir | 400 |

**Eşleşme algılama ve öncelik:**
- Aynı hamlede oluşan tüm eşleşmeler aynı anda algılanır ve patlar.
- Bir taş grubu birden fazla şekle uyuyorsa üretim önceliği: **5 düz > T/L > kare > 4 düz > 3**. (Oyuncu her zaman mümkün olan en güçlü özel taşı alır.)
- Özel taş, oyuncunun kaydırdığı taşın **bırakıldığı hücrede** doğar. Cascade kaynaklı üretimlerde eşleşmenin geometrik merkez hücresinde doğar. Oyuncu "bu özel taşı ben yarattım" hissini her zaman alır.

**Çizgi Patlatıcı yön kuralı (kilitli):** Yatay eşleşmeden doğan patlatıcının deseni ve patlama yönü **yataydır**; dikey eşleşmeden doğan **dikeydir**. Desen yönü = patlama yönü. Tek bakışta öğrenilir, istisnası yoktur.

**Kombo (cascade) sistemi:**
- Oyuncu hamlesinin tetiklediği ilk patlama = dalga 1. Düşen taşların oluşturduğu her yeni eşleşme turu = yeni dalga.
- Puan çarpanı: dalga 1 = x1, sonraki her dalga +0.5x, tavan x5.
- Dalga büyüdükçe: parçacık yoğunluğu artar, ekran titreşimi büyür (hafif → orta), müzik üstüne yükselen perküsyon notası eklenir.

**Kombo mesajları (ekranın üst üçte birinde, board'u asla kapatmaz, 600 ms görünür):**

| Dalga | Mesaj |
|---|---|
| 2 | "Güzel!" |
| 3 | "Harika!" |
| 4 | "Taş Gibi!" |
| 5 | "Mağara Çılgınlığı!" |
| 6 | "Dev Combo!" |
| 7+ | "UNGA BUNGA!" |

Mesaj kuralları: Tek kelime/kısa kalıp, büyük tok tipografi, 600 ms'de kaybolur, taş takibini bozmaz, üst üste binmez (yeni dalga eskisini anında değiştirir).

---

## 10. Özel Taşlar

Özel taşlar oyunun zirve anlarıdır: nadir ama güçlü. Denge hedefi: ortalama bir levelde oyuncu 2–4 özel taş üretir; her özel taş üretimi küçük bir olay, her kullanımı net bir kazançtır.

### 10.1 Çizgi Patlatıcı
- **Oluşum:** 4'lü düz eşleşme.
- **Görsel:** Eşleşen taş türünün gövdesi üzerinde, patlama yönünde akan ışık şeridi (yatay veya dikey). Taş hafifçe titrer.
- **Davranış:** Eşleşmeye dahil olduğunda veya takasla tetiklendiğinde tüm satırı ya da sütunu temizler. Yoldaki engellere 1 hasar verir; Fosil Blok'ta durmaz, hasar verip devam eder.
- **His:** Hızlı, keskin bir ışık süpürmesi (200 ms'de board'u kat eder), "vşşt-çat" sesi.
- **Rol:** Engel hatlarını kırma, uzak hedeflere ulaşma, totem yolunu açma.

### 10.2 Mağara Bombası
- **Oluşum:** T veya L şeklinde 5'li eşleşme.
- **Görsel:** Çatlaklarından köz ışığı sızan yuvarlak kaya; fitil yerine üstünde titreyen kıvılcım.
- **Davranış:** Tetiklendiğinde 3x3 alanı patlatır; alandaki engellere 2 hasar verir.
- **His:** Tok bas patlama, 120 ms ekran sarsıntısı, kaya parçacıkları + köz kıvılcımı.
- **Rol:** Kümelenmiş engeller, dayanıklı bloklar, alan temizliği.

### 10.3 Ruh Kristali
- **Oluşum:** 5'li düz eşleşme.
- **Görsel:** Renksiz/sedefli, içinde dönen mağara ruhu silüeti olan kristal; türü olmayan tek taş. Board'da hafifçe süzülür gibi durur.
- **Davranış:** Herhangi bir normal taşla takas edildiğinde, o türdeki **tüm** taşları board'dan temizler. Eşleşmeye girmez (türü yok); sadece takasla kullanılır. Bir patlamanın içinde kalırsa en kalabalık taş türünü temizleyerek tetiklenir.
- **His:** Yavaşlayan yarım saniyelik "an" → seçilen türdeki tüm taşlara ışık huzmeleri uzanır → zincirleme tatlı patlama dizisi. Nadir ve büyük fırsat duygusu.
- **Rol:** Toplama hedeflerinde ana silah; kombinasyonların kralı.

### 10.4 Fosil Roketi
- **Oluşum:** 2x2 kare eşleşme.
- **Görsel:** Kemikten gövdeli, yaprak kanatlı minik ilkel roket; hafifçe sallanır.
- **Davranış:** Tetiklendiğinde board üzerinden uçar ve **en öncelikli hedefe** yönelir. Öncelik sırası: hedef objesi (totem) > hedef engeli > hedef taş türü > rastgele taş. Çarptığı hücreyi patlatır ve 4 dik komşusuna 1 hasar verir (artı şeklinde mini patlama).
- **His:** Sürpriz ve mizah: roket havalanırken kısa "uu!" sesi, çarptığında küçük tok patlama. Yardımcı ama tek başına level kazandırmaz.
- **Rol:** Ulaşılması zor hedeflere otomatik katkı; kare eşleşmelere değer kazandırma.

**Özel taş denge kuralları (kilitli):**
- Özel taşlar yerçekimiyle düşer, normal taş gibi takas edilebilir.
- Özel taş, kendi türünün eşleşmesine dahil olabilir; bu durumda hem eşleşme hem özel etki tetiklenir.
- Bir patlama alanına giren özel taş zincirleme tetiklenir (domino); zincirleme tetiklemeler kombo dalgası sayılır.
- Spawn hedefi: levellerin hamle/board yapısı, ortalama 7–10 hamlede bir özel taş üretme fırsatı verecek şekilde tasarlanır.

---

## 11. Özel Taş Kombinasyonları

İki özel taş komşuysa ve oyuncu onları takas ederse kombinasyon tetiklenir. Kombinasyonlar oyunun en güçlü ve en akılda kalıcı anlarıdır.

| Kombinasyon | Etki | His/Not |
|---|---|---|
| Çizgi + Çizgi | Takas hücresinden tam satır **ve** tam sütun temizlenir (artı şekli) | Kesişimde parlak çapraz ışık patlaması |
| Çizgi + Bomba | 3 satır + 3 sütun temizlenir (kalın artı) | Geniş alan açar; engel hatlarını söker |
| Bomba + Bomba | 5x5 dev patlama; alandaki engellere 3 hasar | En tok ses + en büyük sarsıntı (yine de 300 ms'de biter) |
| Kristal + normal taş | O türdeki tüm taşlar temizlenir | Standart kristal kullanımı |
| Kristal + Çizgi | Seçilen türdeki tüm taşlar Çizgi Patlatıcı'ya dönüşür ve sırayla tetiklenir | Ekranı tarayan ışık şeritleri; dev kombo garantisi |
| Kristal + Bomba | Seçilen türdeki taşların 5'i (rastgele dağılmış) bombaya dönüşür ve sırayla patlar | Kontrollü kaos; 5 sınırı okunabilirliği korur |
| Kristal + Kristal | Board'daki **tüm** taşlar temizlenir (engeller 3 hasar alır) | Oyunun en nadir anı; kısa beyaz-amber flaş + yavaş çekim, "UNGA BUNGA!" mesajı garantili |
| Roket + Roket | 3 roket fırlatılır (öncelik sırasına göre 3 ayrı hedefe) | Eğlenceli füze şovu, 1 saniyede tamamlanır |
| Roket + Çizgi | Roket çarptığı hücrede satır + sütun temizler | Uzak hedefe taşınan çizgi patlaması |
| Roket + Bomba | Roket çarptığı hücrede 3x3 patlama yaratır | Uzak hedefe taşınan bomba |
| Roket + Kristal | En kalabalık taş türü temizlenir, ardından roket en öncelikli hedefe uçar | İki etki sıralı oynar, asla üst üste binmez |

**Kombinasyon tasarım kuralları (kilitli):**
- Her kombinasyonun etkisi deterministiktir; oyuncu sonucu tahmin edebilir ve öğrenebilir.
- Efekt süresi tavanı: en büyük kombinasyon (Kristal+Kristal) dahil hiçbir etki 1,5 saniyeden uzun süremez.
- Etki sırasında hedef sayaçları gerçek zamanlı işler; oyuncu kazancını anlık görür.
- Kombinasyon önerisi: iki özel taş komşu olduğunda ikisi de hafifçe parlar (öğretici sinyal, Level 26'dan itibaren).

---

## 12. Engeller

Engellerin amacı: hedef yaratmak, board'u stratejikleştirmek, özel taşlara değer katmak, levelleri farklılaştırmak. Hiçbir engel "beklemek" gerektirmez; hepsi oyuncu eylemiyle çözülür.

### 12.1 Tahta Kasa — tanıtım: Level 8
- Hücreyi kaplar, içinde taş yok, hareket etmez, yerçekimini bloke eder.
- **Kırılma:** Bitişik (dik komşu) eşleşme/patlama 1 hasar. Tek katman kasa 1 hasarda, bantlı kasa 2 hasarda kırılır.
- **Görsel:** Kemik kancalı ilkel ahşap sandık; hasar alınca çatlar, kırılınca içinden 1–3 coin saçılır (kasa kırmak her zaman mikro ödüldür).
- **Kullanım:** İlk ve en basit engel; "yanında patlat" mantığını öğretir.

### 12.2 Buz — tanıtım: Level 16
- Bir taşın üstünü kaplar; buzlu taş **kaydırılamaz** ama eşleşmeye dahil olabilir.
- **Kırılma:** Buzlu taş bir eşleşmeye girerse önce buz kırılır, taş yerinde kalır ve normalleşir (taş o eşleşmede patlamaz — buz, eşleşmenin enerjisini emer). Özel taş etkisi buzu tek vuruşta kırar.
- **Görsel:** Yarı saydam buz kabuğu; içindeki taş silüeti net görünür (oyuncu planlama yapabilir). Kırılınca cam kırığı parçacıkları.
- **Kullanım:** Hedefli eşleşme yaptırır; "tüm buzları çöz" hedefleriyle alan temizleme öğretir.

### 12.3 Zincir — tanıtım: Level 21
- Taşı yerine kilitler: zincirli taş kaydırılamaz ve yerçekimiyle düşmez (asılı kalır).
- **Kırılma:** Zincirli taş eşleşmeye girerse zincir kırılır **ve** taş aynı eşleşmede patlar (tek aşamalı; akış hızlı kalır). Özel taş etkisi de kırar.
- **Görsel:** Taşın üstünde çapraz kemik-zincir; kırılınca halkalar dağılır.
- **Kullanım:** Hareket kısıtı planlı hamle öğretir. Yoğunluk tavanı: board hücrelerinin en fazla %25'i zincirli olabilir.

### 12.4 Fosil Blok — tanıtım: Level 31
- Sabit engel; hücreyi kaplar, hareket etmez, yerçekimini bloke eder.
- **Kırılma:** 3 hasar. Bitişik eşleşme 1, özel taş etkisi 2, bomba kombinasyonları 3 hasar verir.
- **Görsel:** İçinde amonit/kemik fosili görünen katmanlı kaya; her hasarda bir katman dökülür, hasar durumu her an okunur.
- **Kullanım:** Board'u bölen duvarlar, korunaklı alanlar. Tavan: board'un en fazla %30'u fosil olabilir ve fosiller hiçbir hedef hücreyi tamamen erişilmez yapamaz.

### 12.5 Lav Taşı — tanıtım: Level 46
- Hücreyi kaplayan canlı engel. **Yayılma:** Oyuncunun hamlesi hiçbir lav taşına hasar vermediyse, hamle sonunda **bir** lav taşı rastgele dik komşu normal taşı kaplar (taş kaybolmaz, lavın altında bekler; lav kırılınca geri gelir). Tanıtım levellerinde yayılma 3 hamlede bir, ileri levellerde 2 hamlede bir; hiçbir levelde her hamlede yayılmaz.
- **Kırılma:** 1 hasar (bitişik eşleşme veya özel taş). Bir hamlede herhangi bir lav kırıldıysa o tur **hiçbir** lav yayılmaz (oyuncu saldırıyla yayılmayı tamamen durdurabilir — adalet kuralı).
- **Yayılma tavanı:** Lav, board hücrelerinin %30'unu geçemez; tavana ulaşırsa yayılma durur.
- **Görsel:** Nabız gibi atan magma dokusu; yayılmadan önceki hamlede hedef yönünde küçük kıvılcım fışkırır (oyuncu uyarılır).
- **Kullanım:** Baskı ve tempo; sadece Lav Kıvrımı bölgesinde (Level 46+).

**Genel engel kuralları (kilitli):**
- Her yeni engel tek başına, kolay bir levelde tanıtılır (tanıtım leveli zorluk 1–2, hedef sadece o engel).
- Aynı levelde en fazla 2 farklı engel türü kullanılır (Level 50 bölüm finali istisna: 3).
- Engelin ne yaptığı ilk karşılaşmada tek cümlelik ipucu + görerek öğrenme ile anlatılır.
- Engeller hedefi imkânsızlaştıramaz: her engel kombinasyonunda hedefe ulaşan en az bir makul yol bırakılır (level kabul testi).

---

## 13. Level Hedefleri

Her levelde 1 veya 2 hedef bulunur (ileri levellerde en fazla 3 — yalnız bölüm finallerinde). Hedefler level başında büyük kartla gösterilir, oyun boyunca HUD'da ikon + sayaç olarak kalır, her katkıda hedefe uçan parçacıkla beslenir.

| # | Hedef tipi | Örnek | İlk görüldüğü level |
|---|---|---|---|
| 1 | Skor | "1.500 puana ulaş" | 2 |
| 2 | Taş toplama | "20 Amber topla" | 3 |
| 3 | Özel taş oluştur/kullan | "2 Çizgi Patlatıcı oluştur" | 4 |
| 4 | Engel kırma (sayılı) | "6 Kasa kır" | 8 |
| 5 | Alan temizleme ("tüm X") | "Tüm buzları çöz" | 20 |
| 6 | Kombinasyon | "2 özel taş kombinasyonu yap" | 26 |
| 7 | Obje düşürme | "Totemi aşağı indir" | 41 |
| 8 | Karışık hedef | "2 Totem indir + 8 Lav söndür" | 43 |

**Obje düşürme detayı (Totem):** Totem Parçası, board'da taşlar gibi düşen 1 hücrelik özel objedir; eşleşmeye girmez, patlamaz, sadece düşer. Altındaki taşlar patladıkça iner; board'un en alt satırındaki işaretli **çıkış hücresine** ulaşınca kısa kutlamayla toplanır. Çıkış hücreleri parlayan ok ile her an işaretlidir.

**Hedef tasarım kuralları (kilitli):**
- Hedef tek bakışta anlaşılır: ikon + sayı, metin desteği sadece tanıtımda.
- Hedef sayıları, levelin hamle sayısıyla orantılıdır: ideal oyunda hedef, hamlelerin ~%70'inde tamamlanabilir (kalan %30 hata payı + Kıvılcım Finali bonusu).
- Boşa hamle hissi engellenir: hedefe katkısı olmayan patlamalar yine skor verir; skor 2–3 yıldız için her zaman anlamlıdır.
- Son 5 hamlede hamle sayacı amber renge döner ve hafifçe nabız atar; hedefe %80+ yaklaşıldığında hedef kartı parlar ("az kaldı" heyecanı).

---

## 14. İlk 50 Level İlerleme Planı

**Bölgeler:** Level 1–25 **Amber Girişi**, Level 26–50 **Lav Kıvrımı**. Sandık levelleri: 10, 20, 30, 40 (Köz Sandığı); 25 ve 50 (Bölüm Sandığı + kapı animasyonu). Hedef kazanma oranları: L1–10: %90+ · L11–30: %60–75 · L31–50: %45–60 · finaller: %40–50.

| Lv | Yeni öğe | Hedef | Hamle | Taş türü | Zorluk | Tasarım notu |
|----|----------|-------|-------|----------|--------|--------------|
| 1 | Temel eşleşme | 15 taş patlat | 30 | 4 | 1 | Kaybetmek fiilen imkânsız; ilk hamle parıltıyla gösterilir |
| 2 | Hamle limiti + skor | 1.500 puan | 20 | 4 | 1 | Sayaçlar tanıtılır |
| 3 | Toplama hedefi | 20 Amber topla | 18 | 4 | 1 | Hedef paneli + uçan parçacık vurgusu |
| 4 | Çizgi Patlatıcı | 2 Çizgi Patlatıcı oluştur | 20 | 4 | 1 | Açılış 4'lüye kurulu (script'li board) |
| 5 | — | 25 Kristal topla | 18 | 4 | 1 | Çizgi Patlatıcı'nın toplamayı hızlandırdığı hissedilir |
| 6 | Ruh Kristali | 1 Ruh Kristali oluştur ve kullan | 22 | 4 | 1 | Açılış 5'liye kurulu (script'li) |
| 7 | Mağara Bombası | 2 Mağara Bombası oluştur | 22 | 4 | 1 | T/L dizilimi öğretilir |
| 8 | Tahta Kasa | 6 Kasa kır | 20 | 4 | 1 | Kasalar merkezde, kaçırılması zor |
| 9 | — | 10 Kasa kır | 18 | 4 | 2 | Taş Çekici hediye edilir (3 adet) |
| 10 | Mini zirve | 12 Kasa + 30 Amber | 22 | 4 | 2 | İlk çift hedef; ilk Köz Sandığı |
| 11 | 5. taş (Kıvılcım) | 2.500 puan | 20 | 5 | 2 | Çeşitlilik artar, eşleşme bulmak hafif zorlaşır |
| 12 | — | 30 Yosun + 30 Lav Şekeri | 20 | 5 | 2 | Çift toplama |
| 13 | — | 8 Kasa + 2.000 puan | 18 | 5 | 2 | — |
| 14 | — | 3 özel taş patlat | 18 | 5 | 2 | Özel taş alışkanlığı |
| 15 | — | 40 Kıvılcım topla | 20 | 5 | 2 | Mağara Karıştırıcısı hediye (2 adet) |
| 16 | Buz | 8 Buz çöz | 20 | 4 | 1 | Tanıtım kolay; 4 türe dönülür |
| 17 | — | 12 Buz | 18 | 5 | 2 | — |
| 18 | — | 10 Buz + 25 Amber | 20 | 5 | 2 | — |
| 19 | — | 14 Buz | 18 | 5 | 3 | Buzlar kenarlarda; Çizgi Patlatıcı değer kazanır |
| 20 | "Tüm X" hedefi | Tüm buzları çöz (16) | 22 | 5 | 3 | Köz Sandığı |
| 21 | Zincir | 6 Zincir kır | 20 | 4 | 1 | Tanıtım kolay |
| 22 | — | 10 Zincir | 18 | 5 | 2 | — |
| 23 | — | 8 Zincir + 20 Kristal | 20 | 5 | 3 | — |
| 24 | — | 12 Zincir | 18 | 5 | 3 | Zincirler köşelerde; Bomba değer kazanır |
| 25 | **Bölüm finali** | 10 Zincir + 8 Kasa | 24 | 5 | 4 | Amber Girişi kapısı açılır; Bölüm Sandığı; +5 Hamle hediye (1) |
| 26 | Kombinasyon + yeni bölge | 2 özel taş kombinasyonu yap | 24 | 4 | 2 | Lav Kıvrımı görsel teması; açılış iki özel taşı komşu verir (script'li) |
| 27 | — | 10 Kasa + 8 Buz | 20 | 5 | 3 | İlk iki-engel karışımı |
| 28 | — | 4.000 puan | 18 | 5 | 3 | Cascade kurmaya teşvik; kombo çarpanı parlar |
| 29 | — | 12 Buz + 8 Zincir | 20 | 5 | 4 | — |
| 30 | Mini zirve | 12 Kasa + 12 Buz | 24 | 5 | 4 | Köz Sandığı |
| 31 | Fosil Blok | 4 Fosil kır | 22 | 4 | 1 | Tanıtım kolay |
| 32 | — | 6 Fosil | 20 | 5 | 3 | — |
| 33 | — | 6 Fosil + 30 Lav Şekeri | 20 | 5 | 3 | — |
| 34 | — | 8 Fosil | 20 | 5 | 4 | Fosiller geçit oluşturur; Bomba çok işe yarar |
| 35 | — | 8 Fosil + 8 Kasa | 22 | 5 | 4 | — |
| 36 | Şekilli board | 30 Kıvılcım + 20 Yosun | 20 | 5 | 3 | Ortası boş "halka" board |
| 37 | — | 10 Buz + 6 Fosil | 20 | 5 | 4 | Dar geçitli board |
| 38 | 6. taş (Ay Kemiği) | 3.000 puan | 20 | 6 | 3 | Ferah düz boardda tanıtım |
| 39 | — | 30 Ay Kemiği topla | 20 | 6 | 4 | — |
| 40 | Mini zirve | 8 Fosil + 10 Zincir | 24 | 5 | 4 | İki alanlı board; Köz Sandığı |
| 41 | Totem (obje düşürme) | 1 Totem indir | 20 | 4 | 1 | Çıkış oku tanıtılır; tanıtım kolay |
| 42 | — | 2 Totem | 20 | 5 | 3 | — |
| 43 | — | 2 Totem + 6 Kasa | 22 | 5 | 3 | İlk karışık hedef |
| 44 | — | 3 Totem | 22 | 5 | 4 | Dar geçit; Çizgi Patlatıcı yol açar |
| 45 | — | 2 Totem + 8 Buz | 22 | 5 | 4 | — |
| 46 | Lav Taşı | 6 Lav söndür | 24 | 4 | 2 | Yayılma 3 hamlede bir (yumuşak tanıtım) |
| 47 | — | 10 Lav | 22 | 5 | 3 | Yayılma 2 hamlede bir |
| 48 | — | 8 Lav + 6 Kasa | 22 | 5 | 4 | — |
| 49 | — | 12 Lav + 20 Amber | 24 | 5 | 4 | — |
| 50 | **Bölüm finali** | 2 Totem + 8 Lav + 6 Fosil | 26 | 5 | 5 | Tek 3-hedefli level; zor ama adil (hedef kazanma oranı %40–50); Bölüm Sandığı + yeni bölge teaser |

**Ritim kuralları:**
- Her tanıtım leveli (4, 6, 7, 8, 16, 21, 26, 31, 36, 38, 41, 46) zorluk 1–2'dir; yeni öğe asla zor levelde tanıtılmaz.
- Her 5 levelde en az bir yenilik vardır: yeni hedef tipi, yeni engel, yeni board şekli, yeni taş, sandık veya bölge geçişi.
- Zorluk testere dişi ilerler: zor levelin (4–5) hemen ardından nefes leveli (1–2) gelir.
- Hiçbir level bir öncekinin "sadece daha az hamleli" kopyası değildir.

---

## 15. Zorluk Dengesi

**Dokuz zorluk kolu (level tasarımcısının ayar düğmeleri):**

1. **Hamle sayısı** — son çare, tek başına asla kullanılmaz.
2. **Hedef miktarı** — hamle başına gereken katkı oranını belirler.
3. **Engel sayısı** — board'daki çözülmesi gereken iş.
4. **Engel dayanıklılığı** — 1 vs 2 vs 3 hasarlık katmanlar.
5. **Board şekli** — dar geçit, boş hücre, bölünmüş alan.
6. **Taş türü sayısı** — 4 tür bol eşleşme, 6 tür kıtlık demektir.
7. **Özel taş fırsatı** — board genişliği ve tür sayısı 4'lü/5'li kurma kolaylığını belirler.
8. **Cascade ihtimali** — yüksek cascade kolay levelleri cömert, zor levelleri öngörülmez yapar; zor levellerde tür sayısıyla dengelenir.
9. **Hedef taş çıkış oranı** — toplama hedeflerinde spawn ağırlığı (bkz. Bölüm "Adalet ve Rastgelelik" kuralları, 34. bölümdeki risk önlemleriyle birlikte çalışır).

**Kontrollü rastgelelik ve adalet kuralları (kilitli):**
- Toplama hedefindeki taş türünün spawn ağırlığı diğer türlerle en az eşittir; oyuncu hamle yüzdesine göre hedefin %50'sinden geride ise ağırlık +%20 artar (sessiz yardım, asla tersine çalışmaz — oyun hiçbir koşulda oyuncuya karşı oran düşürmez).
- Üst üste 2 kayıptan sonra üçüncü denemede açılış board'u "cömert" havuzdan üretilir: hedefe dönük taşlar açılışta daha zengin (görünmez merhamet sistemi; oyuncuya asla söylenmez, board hâlâ kurallara uygundur).
- Hamle kalmaması (shuffle) bir levelde ortalama 0–1 kez yaşanmalıdır; testte 2+ shuffle üreten leveller yeniden tasarlanır.
- Kayıpların çoğunluğu oyuncu kararına bağlanabilir olmalıdır: playtest'te kaybeden oyuncuya "ne yapardın?" sorulduğunda somut bir hamle hatası söyleyebiliyorsa level adildir.

**Zorluk eğrisi:** Düz çizgi değil, ritimli testere: kolay → öğretici → orta → tatmin (kombo şovu) → mini zirve → nefes. Her 10 levellik blokta en fazla 2 level zorluk 4+, en az 2 level zorluk 1–2.

**Kötü zorluk (yasak):** Çok az hamleyle imkânsızlaştırma · açılışta kilitli/kötü board · hedefe matematiksel olarak yetmeyen hamle · sonucu tamamen rastgeleliğe bırakma · booster'sız geçilemeyen tasarım. Her level, booster'sız ve ortalama beceriyle geçilebilir olmak zorundadır (kabul kriteri: tasarımcı dışı bir test oyuncusu her leveli en geç 5 denemede booster'sız geçebilmeli).

---

## 16. Tutorial ve Onboarding

**İlkeler:** Yaparak öğrenme; tek seferde tek bilgi; maksimum 1 cümle; popup yerine board üstü işaret; oyuncuyu asla 2 saniyeden uzun durdurma.

**Mekanik:** Tutorial anında board hafifçe kararır, sadece ilgili taşlar/hücreler ışıkta kalır, hedef hamle parlak el/ok ile gösterilir, kısa metin hedefin hemen yanında belirir. Oyuncu doğru hamleyi yapınca akış anında normale döner. Metin kutusu oyuncu hamlesini asla bloke etmez.

**Akış ve metinler:**

| Level | Öğretilen | Metin (tek cümle) |
|---|---|---|
| 1 | Takas + eşleşme | "Yan yana iki taşı kaydır, üç aynıyı buluştur!" |
| 2 | Hamle limiti | "Hamlelerin sınırlı — hedefe ulaş!" |
| 3 | Toplama hedefi | "Bu taştan 20 tane patlat." |
| 4 | 4'lü → Çizgi | "Dört taşı eşleştir, Çizgi Patlatıcı kazan!" |
| 6 | 5'li → Kristal | "Beş taşı dizersen Ruh Kristali doğar!" |
| 7 | T/L → Bomba | "T veya L kur, Mağara Bombası senin!" |
| 8 | Kasa | "Kasanın yanında patlat, kır!" |
| 16 | Buz | "Buzlu taşı eşleşmeye sok, buzu çöz!" |
| 21 | Zincir | "Zincirli taş kıpırdamaz — eşleşmeyle kurtar!" |
| 26 | Kombinasyon | "İki özel taşı takas et, gücü gör!" |
| 41 | Totem | "Totemin altını patlat, oka kadar indir!" |
| 46 | Lav | "Lava vur, yoksa yayılır!" |

**Yasaklar:** Uzun metin blokları, art arda popup, başta her şeyi anlatma, oyuncunun keşfedeceği şeyi söyleme (kombinasyon çeşitleri keşfe bırakılır; sadece ilk kombinasyon öğretilir).

---

## 17. UI Ekranları

**Ekran listesi ve içerikleri:**

**Ana Menü** (ilk açılışta atlanır, doğrudan haritaya gidilir; sonradan logo ekranı 1 saniyeyi geçmez):
- "Oyna" (sıradaki level) — baskın buton
- Harita, Günlük Görevler, Günlük Challenge, Ayarlar, Nasıl Oynanır
- Sade: en fazla 6 etkileşim noktası.

**Level Haritası:**
- Mağara içinde aşağı doğru kıvrılan ışıklı patika; her level bir taş/kristal düğüm.
- Düğüm durumları: kilitli (sönük taş), açık (parlayan amber), tamamlanmış (yıldız sayısıyla işaretli), 3 yıldızlı (altın parıltılı), sandık noktası (sandık ikonu), bölüm kapısı (büyük taş kapı).
- Bölge geçişlerinde duvar dokusu, ışık rengi ve müzik katmanı değişir.
- Lansman bölgeleri: Amber Girişi, Lav Kıvrımı. Yol haritası bölgeleri: Kristal Derinliği, Yosunlu Geçit, Ay Taşı Mabedi, Fosil Uçurumu, Kayıp Mağara, Ruh Kristali Odası.

**Level Başlangıç Ekranı (alt yarımdan kayan panel):**
- Level numarası + hedef kart(lar)ı (ikon + sayı) + hamle sayısı
- Level öncesi booster seçimi (Başlangıç Bombası, Kristal Yardımı) — sahip olunanlar gösterilir, sıfırsa sessizce gizlenir (satış baskısı yok)
- "Mağaraya Gir" butonu.

**Oyun Ekranı:** Bkz. Bölüm 18 (HUD).

**Pause Ekranı:** Devam Et (baskın) · Yeniden Başlat (onaylı) · Ses/Müzik anahtarları · Ana Menü. Pause sırasında board bulanıklaşır (çözüm düşünme hilesini engeller).

**Ayarlar:** Müzik aç/kapat · Ses efekti aç/kapat · Titreşim aç/kapat (mobil) · Dil (TR/EN lansman) · Renk körlüğü modu · Animasyon azaltma modu · İpucu aç/kapat.

**Kazanma / Kaybetme Ekranları:** Bkz. Bölüm 19.

**Günlük Görev Ekranı:** 3 görev kartı (ikon + tek cümle + ilerleme çubuğu + ödül); tamamlananlar "Topla" butonuyla parlar; yenilenme sayacı üstte.

**Günlük Challenge Ekranı:** Bugünün özel leveli + streak takvimi (7 günlük halka) + bugünün ödülü. Bkz. Bölüm 23.

**Nasıl Oynanır:** 6 görsel kart (kaydırılabilir): takas/eşleşme · 4'lü Çizgi · 5'li Kristal · T/L Bomba · engeller · boosterlar. Metinler tek cümle, görseller animasyonlu mini döngüler.

**Sandık Açılış Ekranı:** Sandık 1 dokunuşla açılır, içerik 1 saniyede saçılır, "Topla" ile kapanır. Toplam 3 saniyeyi geçmez.

---

## 18. HUD Mantığı

**Yerleşim (mobil dikey referans):**
- **Üst bant (tek satır):** Solda kalan hamle (en büyük sayı — oyunun en kritik bilgisi), ortada hedef ikon(lar)ı + kalan sayaçlar, sağda skor + yıldız ilerleme çubuğu.
- **Board:** Ekranın ortasında, üst banta ve alt banda değmeden; arkasında yumuşak vinyetli mağara arka planı (board kontrastını asla düşürmez).
- **Alt bant:** Level içi boosterlar (Taş Çekici, Mağara Karıştırıcısı) — başparmak erişim bölgesinde, board'dan ayrı; sol altta duraklatma.

**Kurallar (kilitli):**
- HUD eleman sayısı tavanı: aynı anda en fazla 6 bilgi alanı.
- Hedef sayaçları her katkıda küçük zıplama + parçacık alır; oyuncu hedef ilerlemesini board'dan gözünü ayırmadan periferik olarak hisseder.
- Hamle sayısı son 5 hamlede amber renge döner ve nabız atar.
- Hiçbir HUD elemanı board hücrelerinin üstüne taşmaz; kombo mesajları üst bandın hemen altındaki güvenli şeritte belirir.
- Masaüstünde aynı yerleşim korunur; boşluklar dekoratif mağara duvarıyla dolar (yeni UI elemanı eklenmez).

---

## 19. Kazanma / Kaybetme Ekranları

**Kazanma akışı:**
1. Son hedef tamamlanır → "Mağara Açıldı!" çığlığı + Kıvılcım Finali (kalan hamleler özel taşa dönüşüp patlar, skor akar — 2–4 saniye, dokunuşla atlanabilir).
2. Kazanma paneli: Level adı → hedeflerin tek tek "tamamlandı" tiki (sıralı, 150 ms arayla) → yıldızlar tek tek çakılır (1–3) → skor + kalan hamle bonusu → ödül (coin, varsa sandık).
3. Butonlar: **"Devam"** (baskın, haritaya/sonraki levele) · "Tekrar Oyna" (3 yıldız avcıları için).

**Kazanma metinleri (rastgele dönüşümlü):** "Mağara Açıldı!" · "Taş Gibi Zafer!" · "Unga Bunga!" · "Yeni Yol Açıldı!"

**Kaybetme akışı:**
1. Hamleler biter → board yumuşakça kararır (sert "BAŞARISIZ" damgası yok).
2. Önce **devam teklifi** (tek sefer): "+5 Hamle ile bitir?" — coin fiyatı net yazar, "Hayır, tekrar denerim" eşit görünürlükte. Reddedilirse bir daha sorulmaz.
3. Kaybetme paneli: hangi hedef ne kadar eksik kaldı (ör. "Sadece 3 kasa kaldı!") + ilerleme çubuğu + pozitif tek cümle.
4. Butonlar: **"Tekrar Dene"** (baskın) · "Haritaya Dön". Sahip olunan boosterlar "bunları da deneyebilirsin" satırında gösterilir; sıfırsa satır gizlenir.

**Kaybetme metinleri:** "Çok yaklaştın!" · "Sadece 3 kasa kaldı!" · "Bir deneme daha mağarayı açabilir!" · "Daha büyük bir combo işi bitirir!"

**Yasaklar:** Suçlayıcı dil ("Kaybettin!", "Yetersiz!") · ödeme baskısı · kayıp ekranında reklam/popup · hedef bilgisini gizleme · "Tekrar Dene"den daha baskın bir satın alma butonu.

---

## 20. Booster Sistemi

**Level öncesi boosterlar (Level Başlangıç Ekranı'nda seçilir):**

| Booster | Etki | Coin fiyatı | İlk hediye |
|---|---|---|---|
| **Başlangıç Bombası** | Board açılışına 1 Mağara Bombası yerleştirir | 100 | Level 26'da 2 adet |
| **Kristal Yardımı** | Board açılışına 1 Ruh Kristali yerleştirir | 250 | Level 30'da 1 adet |

**Level içi boosterlar (alt bantta):**

| Booster | Etki | Coin fiyatı | İlk hediye |
|---|---|---|---|
| **Taş Çekici** | Seçilen tek taşı veya engele 1 hasarı anında uygular (hamle harcamaz) | 200 | Level 9'da 3 adet |
| **Mağara Karıştırıcısı** | Board'u yeniden dizer (engeller/hedefler korunur, otomatik eşleşme yok) | 150 | Level 15'te 2 adet |
| **+5 Hamle** | Sadece hamleler bittiğinde teklif edilir; 5 hamle ekler | 180 | Level 25'te 1 adet |

**Kurallar (kilitli):**
- Her booster ilk kez **hediye** olarak verilir ve verildiği anda tek cümlelik ipucuyla tanıtılır; oyuncu ilk kullanımı bedavayla öğrenir.
- Booster kullanımı tatmin edici sahnelenir (çekiç kıvılcımlı vuruş animasyonu vb.) — para harcanan an iyi hissettirmelidir.
- Hiçbir level booster gerektirmez (Bölüm 15 kabul kriteri).
- Booster envanteri sıfırken UI satışa zorlamaz: boş slotlar sade "+" ile durur, kırmızı rozet/yanıp sönme yok.
- +5 Hamle teklifi level başına en fazla 1 kez yapılır; ikinci kayıpta doğrudan kayıp ekranı gelir.

---

## 21. Ödül ve İlerleme Sistemi

**Yıldız sistemi:**
- 1 yıldız: level kazanıldı.
- 2 yıldız: skor ≥ levelin baz skoru × 1,5.
- 3 yıldız: skor ≥ levelin baz skoru × 2,2 (Kıvılcım Finali bonusu dahil — verimli/az hamleli oyun doğal olarak 3 yıldıza taşır).
- Baz skor her level için tasarımcı tarafından "ortalama kazanan oyuncunun skoru" olarak kalibre edilir.

**Coin ekonomisi (tek yumuşak para birimi):**

| Kaynak | Miktar |
|---|---|
| Level kazanma | 15 coin (ilk geçişte; tekrar oynamada 5) |
| Yıldız başına bonus | +5 coin |
| Kasa kırma (oyun içi) | 1–3 coin |
| Köz Sandığı (Lv 10/20/30/40) | 60–120 coin + 1 booster |
| Bölüm Sandığı (Lv 25/50) | 200 coin + 2 booster + kozmetik parça |
| Günlük ödül | 20–80 coin (7 günlük artan döngü) |
| Günlük görev (her biri) | 10–30 coin |
| Günlük challenge | 50 coin + streak bonusu |
| Başarımlar | 25–100 coin (tek seferlik) |

Harcama yeri yalnızca boosterlar (fiyatlar Bölüm 20). Denge hedefi: normal oynayan oyuncu haftada 2–3 booster alabilecek kadar coin biriktirir; coin bolluğu boosterları değersizleştirmez, kıtlığı satışa zorlamaz.

**Yıldız Sandıkları (rekabetçi/koleksiyoncu döngüsü):** Toplam yıldız 25 / 60 / 100 / 150 eşiklerinde haritada duran özel sandıklar açılır (coin + booster paketi). Eksik yıldızlar için eski levelleri tekrar oynamaya sebep yaratır.

**Günlük ödül döngüsü (7 gün, giriş yeterli):** 20 → 30 → 40 → 1 Çekiç → 60 → 1 Karıştırıcı → 80 coin + 1 Başlangıç Bombası. Gün kaçarsa döngü kaldığı yerden devam eder (sıfırlanmaz — cezasız tasarım).

**Başarımlar (lansman seti):** 1.000 taş patlat · 10 dalgalık combo yap · 50 kasa kır · 25 özel taş oluştur · 10 kombinasyon yap · 3 yıldızlı 10 level bitir · 5 günlük challenge tamamla · Ruh Kristali + Ruh Kristali yap ("Unga Efsanesi" — özel rozet).

---

## 22. Günlük Görevler

- Her gün yerel saatle 00:00'da 3 görev yenilenir; Level 6'dan sonra açılır.
- Görevler normal oyun akışında kendiliğinden ilerler; özel "grind" gerektirmez.
- Her görev tek cümle + ikon + ilerleme çubuğu; ödül 10–30 coin; 3 görev de biterse +1 booster (günün boosterı).

**Görev havuzu (günlük 3'ü rastgele, ikisi aynı tipte olamaz):**
- 50 Amber Taşı patlat · 40 Kristal Meyve patlat (tür rotasyonlu)
- 3 özel taş oluştur · 1 kombinasyon yap
- 2 level kazan · 1 leveli 3 yıldızla bitir
- 5 kasa kır / 5 buz çöz (oyuncunun bulunduğu level aralığında var olan engelden seçilir)
- Günlük challenge'ı oyna
- 1 Mağara Bombası patlat

**Haftalık görevler (3 adet, pazartesi yenilenir):** 20 level oyna · 10 level kazan · 500 taş patlat · 5 günlük görev tamamla · booster kullanmadan 5 level kazan. Ödül: 100–150 coin + sandık.

**Kural:** Görev, oyuncunun ilerleyemediği içerik gerektiremez (Level 12'deki oyuncuya "lav söndür" görevi çıkmaz).

---

## 23. Günlük Challenge

- Level 15'ten sonra açılır; haritada özel turuncu düğüm + menüde giriş.
- Her gün tek özel level; aynı gün tüm oyuncular için aynı tasarım (tarih bazlı sabit kurulum). Sosyal karşılaştırma ve "bugünkünü çözdün mü?" sohbeti yaratır.
- Challenge leveli normal havuzdan değildir: küçük bir bükülme içerir (sıra dışı board şekli, tek hedef-bol engel, "sadece 10 hamle" gibi). Zorluk: orta-zor ama kısa.
- Deneme sınırsız ve ücretsizdir; ödül günde 1 kez alınır (50 coin + streak ilerlemesi).
- **Streak:** Ardışık günlerde tamamlandıkça büyür: 3 gün +30 coin · 7 gün 1 Kristal Yardımı + rozet · 14 gün 150 coin · 30 gün kozmetik tema parçası.
- **Streak koruması:** Ayda 1 kez, kaçan gün otomatik affedilir ("Köz Koruması" — oyuncuya sıcak bir mesajla bildirilir). Streak kaybı asla satın almayla telafi ettirilmez.

---

## 24. Monetizasyon Hazırlığı

İlke: **Monetizasyon yardım hissi verir, zorunluluk hissi vermez.** Lansman tasarımı ödeme olmadan eksiksiz oynanabilir; aşağıdaki alanlar gelir için hazır bırakılır.

**Hazırlanan sistemler:**
- Coin paketi satışı (boosterların zaten coin ile alınması, tek temiz satış noktası yaratır).
- Booster paketi (başlangıç paketi: karışık 5 booster — yalnızca Level 20'den sonra görünür).
- Ödüllü reklam: kayıpta +5 hamleyi coin yerine reklamla alma seçeneği; günlük 1 bedava booster çevirme. Reklam daima **oyuncu isteğiyle** izlenir; zorunlu/araya giren reklam yoktur.
- Reklamsız paket (ödüllü reklamların ödüllerini otomatik veren tek seferlik satın alma).
- Kozmetik tema: board arka planı ve taş kaplama setleri (ör. "Kristal Gece" seti) — güç satmaz, görünüm satar.
- Günlük fırsat: mağaza yerine haritada haftada 1 beliren "Gezgin Tüccar" düğümü (tematik, nazik, kapatılabilir).

**Kurallar (kilitli):**
- İlk 5 levelde hiçbir ödeme/mağaza/reklam yüzeyi görünmez; mağaza girişi Level 20'den önce ana akışta yer almaz.
- Kayıp anında önce "Tekrar Dene" sunulur; ödeme seçeneği asla en baskın buton olmaz.
- Sahte indirim, geri sayımlı baskı, "son şans!" dili, üst üste popup yasaktır.
- Kasıtlı imkânsız level + booster satışı modeli yasaktır; Bölüm 15'in "booster'sız geçilebilirlik" kabul kriteri monetizasyonun da sınırıdır.
- Oyun çocuk hedefli değildir ama çocuk oynayabilir: agresif dönüşüm hunisi hiçbir yaşa gösterilmez.

---

## 25. Görsel Stil Rehberi

**Hedef his:** Premium casual. Renkli ama ucuz değil; sevimli ama bebeksi değil; basit ama kaliteli. "Sıcak ışıklı, yaşayan bir mağara."

**Renk paleti (ana kararlar):**

| Rol | Renk | Kullanım |
|---|---|---|
| Mağara zemini/duvar | Koyu çikolata-mor `#2B1B2F` | Arka plan; board kontrastının temeli |
| Sıcak ışık | Amber `#FFB347` | Işık kaynakları, vurgular, hamle sayacı uyarısı, baskın butonlar |
| Soğuk vurgu | Turkuaz `#3EC6C0` | Kristal detayları, ikincil UI, hedef parıltıları |
| Tehlike/enerji | Magma kırmızısı `#E8543F` | Lav, bomba, son hamle gerilimi |
| Nötr UI | Taş grisi `#8A7F8D` | Panel gövdeleri, pasif durumlar |

Kural: Arka plan her zaman koyu ve düşük doygunlukta kalır; taşlar paletin en parlak elemanlarıdır. Board okunabilirliği her görsel karardan üstündür.

**Işık dili:** Tüm sahnelerde tek tutarlı ışık kurgusu — alttan/yandan sızan sıcak lav-amber ışığı + taşların kendi iç parıltısı. Bölgeler ışık rengiyle ayrışır (Amber Girişi: bal sarısı · Lav Kıvrımı: turuncu-kızıl · gelecek bölgeler: turkuaz, yeşil, lila, kemik beyazı).

**Taş render dili:** Hacimli, yumuşak speküler parlamalı, hafif yarı saydam "taş-şeker"; el yapımı, dokunulası his. Vektörel düz clipart, sert dış çizgi ve plastik gradyan yasak.

**UI dili:** Yuvarlatılmış taş plakalar, kemik/halat detaylı çerçeveler, tok ve dolgun butonlar; tipografi yuvarlak hatlı, kalın, yüksek okunabilirlikli sans-serif (büyük gövde, geniş aralık). Metin boyutu mobilde asla "küçük yazı" sınıfına düşmez.

**Kaçınılacaklar:** Candy Crush renk düzeni ve şeker formları · King oyunlarını anımsatan buton/harita dili · pastel bebek paleti · stok ikon hissi · arka planın board'la yarışması · aşırı parlama/bloom.

---

## 26. Animasyon ve Oyun Hissi

Oyunun "juice" bütçesi patlama anlarına harcanır; bekleten hiçbir animasyon yoktur.

| An | Animasyon | Süre hedefi |
|---|---|---|
| Taş seçme | Hafif büyüme + parıltı | 80 ms |
| Takas | Yumuşak kayma | 150 ms |
| Geçersiz hamle | Gidip-dönme + bounce + tık | 250 ms |
| 3'lü patlama | Küçük pop + 4–6 parçacık | 200 ms |
| Taş düşme | Yerçekimi ivmesi + varışta mikro squash | sütun başına ≤300 ms |
| Özel taş doğumu | Taşların özel taşa emilmesi + flaş | 250 ms |
| Çizgi Patlatıcı | Işık süpürmesi | 200 ms |
| Bomba | Tok patlama + 120 ms ekran sarsıntısı | 300 ms |
| Kristal | Yarım saniye "an" + huzme zinciri | 600–900 ms |
| Kombinasyonlar | Sahneli ama kesintisiz | ≤1.500 ms |
| Engel hasarı | Çatlama + parça dökülme | 150 ms |
| Hedef katkısı | Hedefe uçan parçacık + sayaç zıplaması | 300 ms (oyunu bloke etmez) |
| Kazanma kutlaması | Kıvılcım Finali + yıldız çakılması | 2–4 s, dokunuşla atlanır |
| Kaybetme kapanışı | Yumuşak kararma | 500 ms |

**Kurallar (kilitli):**
- Hiçbir animasyon oyuncu girişini gereksiz bekletmez; cascade dışında board her an etkileşime hazırdır.
- Uzun cascade'lerde hızlandırma devreye girer (Bölüm 7).
- Ekran sarsıntısı yalnızca bomba ve kombinasyonlarda; şiddeti küçüktür ve "animasyon azaltma" modunda tamamen kapanır.
- His merdiveni korunur: 3'lü < 4'lü < 5'li < kombinasyon. Her seviye bir öncekinden hissedilir derecede daha tok olmalıdır; testte gözü kapalı sesle bile ayırt edilebilmelidir.

---

## 27. Ses ve Müzik Hissi

**Ses paleti:** Taş tıkırtısı, kristal çınlaması, derin mağara yankısı, küçük el davulu, kıvılcım çıtırtısı, yumuşak lav fokurtusu. Dijital "bling" yerine organik-akustik doku.

**Ses olayları:** Taş seçme (tık) · takas (kaydırma hışırtısı) · geçersiz hamle (tok olmayan "tup") · 3'lü (kısa taş çatlaması) · kombo dalgaları (yükselen perküsyon+marimba nota dizisi — her dalga bir nota yukarı; kombo kulakla takip edilir) · özel taş doğumu (kristal parıltısı) · Çizgi (vşşt-çat) · Bomba (derin bas + yankı) · Kristal (büyülü çınlama zinciri) · engel kırılması (malzemesine göre: ahşap çatırtı / buz kırığı / zincir şıngırtısı / kaya gümlemesi / lav cossss) · hedef tamamlama (davul + kısa zafer motifi) · kazanma (sıcak kutlama teması, 3 saniye) · kaybetme (yumuşak, umutlu kapanış — asla hüzün cezası değil) · buton (tok tık) · sandık (gıcırtı + saçılma).

**Müzik:** Sakin ama nabızlı; mağara yankılı vurmalılar + sıcak melodik katman. Bölge başına varyasyon. Loop yorgunluğu önlemi: 3–4 dakikalık parçalar + oyun yoğunluğuna göre katman ekleme (kombo anlarında perküsyon katmanı güçlenir, sakin anlarda inceler).

**Kurallar:** Aynı sesin üst üste binmesinde perde mikro-rastgeleleştirilir (makineli tüfek etkisi yasak) · hiçbir efekt 1 saniyeden uzun değil · ses/müzik ayrı ayrı kapatılabilir ve ayar her ekrandan 2 dokunuş uzakta · oyun sessiz oynandığında da tüm bilgiler görsel olarak eksiksizdir.

---

## 28. Mobil / Web UX Kuralları

- **Mobil öncelikli dikey tasarım;** masaüstünde aynı kompozisyon ortalanır, yanlar dekoratif mağara duvarıyla dolar. Tek elle, başparmakla eksiksiz oynanır.
- **Kontrol:** Birincil: sürükle-bırak (taşı komşuya doğru kaydır). İkincil: dokun-seç + komşuya dokun. İkisi de her an aktiftir, ayar gerektirmez.
- **Affedicilik:** Sürükleme yönü algılaması toleranslıdır (45° dilimler); yarım kalan sürükleme hamle saymaz; geçersiz hamle hamle harcamaz.
- **Hız hissi:** Açılış doğrudan haritaya; level'a giriş 2 dokunuş; yüklenme anlarında mağara duvarına çizilmiş kısa ipuçları gösterilir ("Bomba + Bomba = dev patlama!").
- **Kesinti dostu:** Sekme/uygulama arka plana giderse oyun otomatik duraklar; dönüşte board aynen kaldığı yerden devam eder. Level ortasında kapanırsa dönüşte "kaldığın yerden devam / yeniden başla" seçeneği sunulur.
- **Başparmak bölgesi:** Boosterlar ve duraklatma alt bantta; üst bant yalnızca bilgi gösterir, kritik etkileşim içermez.
- **Oyun alanı kutsaldır:** Hiçbir menü, bildirim veya promosyon board'un üstüne açılmaz (tutorial vurgusu hariç).

---

## 29. Erişilebilirlik

- **Renkten bağımsız okunurluk:** 6 taş 6 farklı silüet (damla, altıgen, elmas, çakıl, yıldız, hilal) — temel tasarımın parçası, mod değil.
- **Renk körlüğü modu:** Taşların iç dokusundaki ayırt edici desen kontrastı artırılır + taş köşesine mikro sembol eklenir.
- **Animasyon azaltma modu:** Ekran sarsıntısı kapanır, parçacık yoğunluğu %60 azalır, parlamalar yumuşar; oynanış bilgisi hiç kaybolmaz.
- **Metin:** Büyük gövdeli tipografi; kritik bilgiler (hamle, hedef) en büyük punto; düşük kontrastlı metin yasak.
- **Sessiz oynanabilirlik:** Tüm geri bildirimlerin görsel karşılığı vardır (kombo mesajları, parıltılar, sayaç animasyonları).
- **Hedefler daima ikon + sayı + (tanıtımda) metin** üçlüsüyle anlatılır.
- **Dokunma hedefleri:** Tüm butonlar rahat parmak boyutunda; yan yana kritik butonlar arasında güvenlik boşluğu.
- **Foto-hassasiyet:** Tam ekran beyaz flaş yasak; en parlak efekt (Kristal+Kristal) bile kısa ve yumuşatılmış geçişlidir.

---

## 30. Mikro Metinler

Dil tarzı: sıcak, kısa, yönlendiren, cezalandırmayan, caveman mizahıyla baharatlanmış ama abartılmamış. "Unga Bunga" marka imzasıdır; nadir kullanılır ki değerli kalsın (kombo zirvesi, efsane başarım, büyük zafer).

| Bağlam | Metinler |
|---|---|
| Başlatma | "Mağaraya Gir" · "Taşları Patlat" |
| Kazanma | "Mağara Açıldı!" · "Taş Gibi Zafer!" · "Unga Bunga!" · "Yeni Yol Açıldı!" |
| Kaybetme | "Çok yaklaştın!" · "Sadece 3 kasa kaldı!" · "Bir deneme daha mağarayı açar!" |
| Kombo | "Güzel!" → "Harika!" → "Taş Gibi!" → "Mağara Çılgınlığı!" → "Dev Combo!" → "UNGA BUNGA!" |
| Booster | "Çekici Vur" · "Taşları Karıştır" · "+5 Hamle" |
| Hedef kartları | "12 Kasa Kır" · "30 Amber Topla" · "Tüm Buzları Çöz" · "Totemi İndir" |
| Günlük | "Bugünün görevleri hazır!" · "Köz hâlâ sıcak — 4. gün!" (streak) |
| Shuffle | "Mağara sallanıyor!" |
| Streak koruması | "Köz Koruması seni kurtardı — ateş sönmedi!" |

Kurallar: Tek cümle tavanı · ünlem en fazla bir tane · emir kipi sıcak tonla ("Patlat!", "Kır!") · oyuncuyu özneleyen olumsuz cümle yasak ("Başaramadın" yerine "Az kaldı").

---

## 31. İlk 5 Dakika Deneyimi

| Zaman | Yaşanan |
|---|---|
| 0–10 sn | Logo ≤1 sn → doğrudan harita → parlayan Level 1 düğümü → tek dokunuşla board. Üyelik, izin, popup yok. |
| 10–30 sn | İlk hamle parıltıyla işaret edilir → oyuncu ilk 3'lüyü patlatır → tok pop + hedefe uçan parçacık. "Bunu anladım." |
| 30–60 sn | Level 1 kazanılır → yıldızlar çakılır → ilk coin → harita bir adım ilerler. "Patlatmak güzel, devam." |
| 1–3 dk | Level 2 (hamle limiti) ve Level 3 (toplama hedefi) → hedef mantığı oturur. |
| 3–5 dk | Level 4'te ilk Çizgi Patlatıcı yaratılır ve patlatılır → ilk "güçlü hamle yaptım" anı. "Bir level daha." |

**İlk 5 dakikada yasak:** Üyelik/kayıt isteği · ödeme yüzeyi · reklam · 1 cümleden uzun metin · ikiden fazla sistemin aynı anda tanıtımı · oyuncunun kaybetmesi (Level 1–5 fiilen kaybedilemez kalibre edilir).

---

## 32. İlk Gün Deneyimi

Tipik ilk gün (15–25 dakika toplam, 1–3 oturum) oyuncuya şunları yaşatır:

1. Temel eşleştirme + hedefli leveller (Lv 1–5)
2. Üç özel taşın da doğuşu (Lv 4, 6, 7)
3. İlk engel: Tahta Kasa (Lv 8) + ilk booster hediyesi (Lv 9)
4. İlk çift hedef + ilk Köz Sandığı (Lv 10)
5. Günlük görevlerin açılışı (Lv 6 sonrası) ve en az 1 görev tamamlama
6. Günlük ödülün varlığını öğrenme ("yarın gel, köz büyüyor")

**Gün sonu oyuncu durumu (hedef):** Oyunu tamamen anlamış · 8–12 level geçmiş · sandık açmış, booster denemiş · zorlukla tanışmış (Lv 10 civarı 1 kayıp normal) ama ezilmemiş · yarın dönmek için en az 2 somut sebebi var (görevler + günlük ödül).

---

## 33. Başarı Kriterleri

**Oyuncu deneyimi kriterleri:**
- Yeni oyuncu ilk hamlesini 15 saniye içinde yapar; ilk leveli ilk denemede geçer.
- Test oyuncuları kayıp sonrası %70+ oranda kendiliğinden "Tekrar Dene"ye basar.
- Sorulduğunda oyuncu mevcut level hedefini bakmadan söyleyebilir (anlaşılırlık testi).
- Kayıp sonrası görüşmede "haksızlık" kelimesi telaffuz edilmez; "şöyle oynasaydım" cümlesi duyulur.

**Oyun tasarımı kriterleri:**
- Board'da her an en az 1 geçerli hamle (otomatik garanti); açılışta otomatik eşleşme sıfır.
- Level başına ortalama shuffle ≤1; cascade tavanı aşımı görülmez.
- L1–10 kazanma %90+, L11–30 %60–75, L31–50 %45–60 bandında ölçülür; bant dışı leveller yeniden ayarlanır.
- Her level booster'sız, en geç 5 denemede, tasarım dışı test oyuncusunca geçilir.
- 50 levelde aynı hedef+engel+board kombinasyonu iki kez tekrarlanmaz.

**İş kriterleri:**
- Ortalama seans 5+ dakika; tek seansta 2+ level.
- Oyuncunun ertesi gün dönüşü için her gün en az 2 aktif sebep üretilir (görev + ödül/challenge).
- Monetizasyon yüzeyleri hazır ama ilk 5 levelde görünmez; erken dönemde hiçbir oyuncu ödeme duvarıyla karşılaşmaz.
- İçerik boru hattı: 50 level yapısı, sonraki bölgelerin (Kristal Derinliği vd.) aynı şablonla üretilmesine izin verir.

---

## 34. Riskler ve Çözümler

| Risk | Önlem |
|---|---|
| Oyuncu ne yapacağını anlamaz | İlk levellerde tek hedef, board üstü işaretli tutorial, ikon+sayı hedef kartları, ipucu sistemi (4 sn hareketsizlikte olası bir hamle yumuşakça parlar, 8 sn'de bir tekrarlar, ayardan kapatılır; her zaman en iyi hamleyi göstermek zorunda değildir, özel taş fırsatı varsa onu önceler) |
| "Candy Crush kopyası" algısı | Özgün tema/isim/taş silüetleri, farklı UI ve harita dili, kendi mizahı; Bölüm 25'teki yasak listesi tasarım onay sürecinin parçasıdır |
| Aşırı şans bağımlılığı | Kontrollü board üretimi, hedef taş spawn taban oranı, geride kalana +%20 ağırlık, 2 kayıp sonrası cömert açılış (Bölüm 15) |
| İmkânsız hissedilen leveller | Hamle/hedef/engel oranı formülü (%70 ideal-oyun kuralı), booster'sız geçilebilirlik kabul testi, kazanma oranı bantları |
| Animasyonların oyunu yavaşlatması | Bölüm 26 süre tavanları; cascade hızlandırma; kombinasyon dahi ≤1,5 sn |
| Erken sıkılma | İlk 10 levelde 3 özel taş + 1 engel + sandık + hediye boosterlar; her 5 levelde yenilik kuralı |
| UI kalabalığı | HUD 6-eleman tavanı; board üstüne hiçbir şey açılmaz; satış yüzeyleri geç ve sessiz |
| Renk karmaşası | Silüet-öncelikli taş tasarımı + gri tonlama testi + renk körlüğü modu |
| Uzun cascade'in pasifleştirmesi | 12 dalga soft cap + 8. dalgada hızlandırma; cascade ödül olarak sahnelenir |
| Sekmede bırakıp kopma (web) | Otomatik pause + kaldığın yerden devam; seans kısalığı; giriş 2 dokunuş |
| Shuffle'ın güven sarsması | Ücretsiz, hamle yakmayan, tematik sahnelenen karıştırma ("Mağara sallanıyor!"); sıklığı tasarımla ≤1/level |
| İçerik üretiminin tekrara düşmesi | Bölüm 14 ritim kuralları + Bölüm 33 "aynı kombinasyon iki kez yok" kriteri; her bölgeye imza mekaniği (Lav Kıvrımı → Lav Taşı) |

---

## 35. Yapılmaması Gerekenler

**Marka ve görsel:**
- Candy Crush adı, karakterleri, şeker formları, renk düzeni, harita hissi, UI/ikon dili kullanılmaz; King oyunlarını anımsatan hiçbir görsel kalıp kopyalanmaz.
- Çocuk oyuncağı estetiği ve düşük kaliteli stok ikon kullanılmaz.

**Oynanış ve adalet:**
- Açılışta otomatik eşleşme üretilmez; geçerli hamlesiz board oluşturulmaz.
- Sonuç tamamen şansa bırakılmaz; oyuncuya haksız kayıp yaşatılmaz; spawn oranları asla oyuncu aleyhine gizlice düşürülmez.
- Zorluk yalnızca hamle kısarak artırılmaz; her level aynı hissettirilmez.
- Booster'sız geçilemeyen level tasarlanmaz; kasıtlı imkânsız level yapılmaz.

**UX ve iletişim:**
- İlk dakikada ödeme/reklam/üyelik gösterilmez; ilk 5 levelde para istenmez.
- Tutorial uzun metinle boğulmaz; üst üste popup açılmaz; hedefler asla gizlenmez.
- Görsel efektler board okunabilirliğini bozamaz; tam ekran flaş kullanılmaz.
- Renk körlüğü yok sayılmaz; küçük punto kritik bilgi yazılmaz.
- Kaybeden oyuncu suçlanmaz; sahte indirim ve geri sayım baskısı kurulmaz; kayıp ekranında satın alma "Tekrar Dene"den baskın olamaz.

---

## 36. Üretim Ekibine Net Tasarım Notları

**Kilitli kararlar (tartışmaya kapalı, değişiklik tasarım onayı gerektirir):**
1. İsim önerisi **Cavora**; tema "sıcak ışıklı taş devri mağarası"; ton premium casual.
2. Board 8x8; yalnız yatay/dikey komşu takası; geçersiz hamle hamle yakmaz.
3. Açılışta otomatik eşleşme yok + en az 1 geçerli hamle garantisi + ücretsiz tematik shuffle.
4. 6 taş türü, silüet-öncelikli tasarım (gri tonlama testi kabul kriteri); 4 türle başlanır, 5. tür Lv 11, 6. tür Lv 38.
5. Özel taşlar: 4'lü→Çizgi (desen yönü=patlama yönü), T/L→Bomba (3x3), 5'li→Kristal (tür temizler), 2x2→Roket (öncelikli hedefe uçar). Kombinasyon tablosu Bölüm 11'deki gibidir, deterministiktir.
6. Engeller ve tanıtım levelleri: Kasa Lv8 · Buz Lv16 · Zincir Lv21 · Fosil Lv31 · Lav Lv46. Lav tavanı %30; lav kırılan turda yayılmaz.
7. **Can/enerji sistemi yok**; deneme sınırsız ve ücretsiz.
8. Kıvılcım Finali (kalan hamle bonus şovu), yıldız eşikleri (×1,5 / ×2,2), coin ekonomisi ve booster fiyatları Bölüm 20–21 tablolarındaki gibidir.
9. İlk 50 level Bölüm 14 tablosuna göre üretilir; tanıtım levelleri script'li açılış kullanır.
10. Monetizasyon yüzeyleri Lv 20 öncesi ana akışta görünmez; zorunlu reklam yoktur.

**Ayar (tuning) parametreleri — playtest ile kalibre edilecek, kabul aralıklarıyla:**

| Parametre | Başlangıç değeri | Kabul aralığı |
|---|---|---|
| Cascade dalga tavanı | 12 | 10–15 |
| Kombo çarpan adımı / tavanı | +0,5x / x5 | tavan x4–x6 |
| Geride kalan oyuncuya spawn desteği | +%20 | +%10–30 |
| İpucu gecikmesi | 4 sn | 3–6 sn |
| Hedef/hamle ideal-oyun oranı | %70 | %65–75 |
| L31–50 kazanma oranı bandı | %45–60 | sabit hedef |
| Haftalık serbest booster alımı (coin dengesi) | 2–3 adet | 2–4 adet |

**Üretim öncelik sırası (MVP kapsamı):**
1. Core loop: board, eşleşme, cascade, 4 özel taş, kombinasyonlar, shuffle, adalet kuralları.
2. İlk 25 level + Kasa/Buz/Zincir + kazanma-kaybetme akışları + tutorial.
3. Harita, yıldız/coin/sandık ekonomisi, boosterlar.
4. Level 26–50 + Fosil/Lav/Totem + şekilli boardlar.
5. Günlük görev, günlük challenge, streak, başarımlar.
6. Erişilebilirlik modları, kozmetik/monetizasyon yüzeyleri.

**Açık kalan (bilinçli) konular:** Nihai isim seçimi (öneri: Cavora; hukuki/alan adı kontrolü sonrası kilitlenir) · rehber karakterin görsel tasarımı (tanım: "Obo" — küçük, bilge, az konuşan mağara rehberi; level başlarında tek cümlelik yönlendirme yapar, asla akışı kesmez, "Unga bunga" imzasını kullanır ama nadir) · 3. bölge (Kristal Derinliği) imza mekaniği.

**Son söz:** Bu dokümandaki her sistem dört sütunla test edilir — *Anında Anlaşılırlık, Tok Tatmin, Adil Zorluk, Sıcak Premium His.* Bir özellik bu dördünden birini zayıflatıyorsa, özellik değişir; sütun değişmez.



