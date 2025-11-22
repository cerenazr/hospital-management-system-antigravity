# Cypress Demo ile Sesli Anlatım (Narrated Demo) - Kullanım Kılavuzu

## ✅ Mevcut Durum

Şu anda elimizde:
- ✅ **Cypress test videosu**: `cypress/videos/hospital_flow.cy.ts.mp4` (1 MB)
- ✅ **Test logları**: 4 adet JSON log dosyası (gerçek test verisi)
- ✅ **Anlatım metni**: 4 adet TXT dosyası (otomatik oluşturulmuş)
- ✅ **Mouse hareketleri**: Videoda görünen kırmızı nokta ile kayıtlı

## 📊 Oluşturulan Dosyalar

### Test Logları (`cypress/logs/`)
1. `scenario_1__patient_registers__logs_in__and_books_an_appointment.json`
2. `scenario_3__doctor_views_appointments_and_updates_status.json`
3. `scenario_4__admin_manages_departments.json`

Her bir log dosyası içeriyor:
- Test adımları
- API çağrıları
- Mouse hareketleri (x, y koordinatları + zaman damgası)
- Assertion'lar

### Anlatım Metinleri (`cypress/subtext/`)

**Örnek anlatım metni (Scenario 1):**
```
Welcome to this demonstration of the Hospital Appointment System.

In this test, titled "Scenario 1: Patient registers, logs in, and books an appointment", 
we will walk through the complete user journey.

The test begins at [time].

First, we navigate to the /register page.
Now, we fill in the registration form with the user's information.
First, we navigate to the /login page.
The user clicks on the Book Appointment button to start the booking process.
The user selects a medical department from the dropdown menu.
Next, the user chooses a specific doctor from the available options.
The user then selects an available appointment time slot.

Throughout this process, the system performs several validations:
- expected **/login** to equal **/login**
- expected **/patient** to equal **/patient**
- expected **/patient/appointments** to equal **/patient/appointments**

Behind the scenes, the application communicates with the backend API through 
several requests, including authentication, fetching available doctors and time slots, 
and finally creating the appointment.

The test completes successfully at [time], demonstrating a seamless user experience 
from registration to appointment booking.
```

## 🎙️ Sesli Anlatım Ekleme 

### Seçenek 1: ElevenLabs ile Profesyonel Ses (Önerilen)

**Adım 1: API Key Alın**
1. [elevenlabs.io](https://elevenlabs.io) adresine gidin
2. Ücretsiz hesap oluşturun (ayda 10,000 karakter ücretsiz)
3. API key'inizi kopyalayın

**Adım 2: API Key'i Ayarlayın**

PowerShell'de:
```powershell
$env:ELEVENLABS_API_KEY="your_api_key_here"
```

**Adım 3: Ses Dosyası Oluşturun**
```bash
npm run generate:voiceover
```

Bu komut:
- `cypress/subtext/` klasöründeki tüm TXT dosyalarını okur
- Her biri için ElevenLabs API'yi kullanarak MP3 oluşturur
- Dosyaları `cypress/audio/` klasörüne kaydeder

**Adım 4: Video ve Sesi Birleştirin**
```bash
npm run merge:video
```

Sonuç: `cypress/narrated_videos/narrated_hospital_flow.cy.ts.mp4`

### Seçenek 2: Tek Komut ile

```powershell
$env:ELEVENLABS_API_KEY="your_key"
npm run make:narrated-demo
```

### Seçenek 3: Manuel Ses Kaydı

ElevenLabs kullanmak istemiyorsanız:

1. `cypress/subtext/scenario_1__....txt` dosyasını açın
2. Metni kendiniz okuyun ve kaydedin (Audacity, Windows Ses Kaydedici, vb.)
3. MP3 olarak `cypress/audio/` klasörüne kaydedin
4. `npm run merge:video` ile birleştirin

### Seçenek 4: Diğer TTS Servisleri

**Google Cloud Text-to-Speech:**
- python
```
from google.cloud import texttospeech
# ... kod eklenebilir
```

**Azure Cognitive Services:**
```bash
# Azure TTS kullanımı
```

## 🎬 ffmpeg ile Video Birleştirme

**ffmpeg kurulumu:**

Windows:
1. [ffmpeg.org](https://ffmpeg.org/download.html) adresine gidin
2. Windows build indirin
3. PATH'e ekleyin

Kontrol:
```bash
ffmpeg -version
```

**Manuel birleştirme:**
```bash
ffmpeg -i cypress/videos/hospital_flow.cy.ts.mp4 `
       -i cypress/audio/scenario_1__patient_registers__logs_in__and_books_an_appointment.mp3 `
       -c:v copy -c:a aac -shortest `
       cypress/narrated_videos/final_demo.mp4
```

## 📝 Anlatım Metnini Özelleştirme

Daha iyi bir anlatım metni için `scripts/generateSubtext.js` dosyasını düzenleyin:

```javascript
// Örnek özelleştirmeler:

// Daha detaylı açıklamalar
if (step.includes('fullname')) {
  script += `The user enters their full name into the registration form. `;
  script += `This is a required field for creating a new patient account.\n`;
}

// Türkçe anlatım
script = `Hastane Randevu Sistemi Demosu'na hoş geldiniz.\n\n`;
script += `Bu testte, "${logs.testName}" başlıklı senaryoyu izleyeceğiz.\n\n`;

// Mouse hareketlerini detaylandırma
if (logs.mouseLogs.length > 0) {
  script += `\nKullanıcı mouse'u ekranın farklı bölgelerine hareket ettiriyor:\n`;
  logs.mouseLogs.forEach((log, i) => {
    if (i % 5 === 0) { // Her 5 hareketten birini göster
      script += `- Pozisyon: X=${log.x}, Y=${log.y}\n`;
    }
  });
}
```

## 🎯 Hızlı Demo Oluşturma (Şu andan itibaren)

### Tam Otomatik (API Key ile):
```powershell
# 1. API Key'i ayarla
$env:ELEVENLABS_API_KEY="sk-xxxxxxxxxxxxx"

# 2. Tüm pipeline'ı çalıştır
npm run make:narrated-demo

# 3. Sonuç: cypress/narrated_videos/narrated_hospital_flow.cy.ts.mp4
```

### Manuel (API Key olmadan):
```bash
# 1. Anlatım metnini oku
cat cypress/subtext/scenario_1__patient_registers__logs_in__and_books_an_appointment.txt

# 2. Ses kaydet (kendi sesinle)
# Dosyayı cypress/audio/scenario_1.mp3 olarak kaydet

# 3. Birleştir
npm run merge:video
```

## 📹 Video Özellikleri

**Mevcut video:**
- Boyut: ~1 MB
- Süre: ~6 saniye (3 test çalışıyor)
- Çözünürlük: Cypress default
- Mouse tracking: Aktif ✅

**Video uzunluğunu artırmak için:**
1. Test'lere `cy.wait(1000)` ekleyin (adımlar arası bekleme)
2. Daha fazla senaryo ekleyin
3. Slow-motion modu: `cypress.config.ts` içinde `"slowTestThreshold": 10000`

## 🔧 Sorun Giderme

### "No audio files found"
```bash
# Ses dosyası oluşturun
npm run generate:voiceover
# veya
# Manuel ses dosyası ekleyin: cypress/audio/scenario_1.mp3
```

### "ffmpeg is not installed"
```bash
# ffmpeg kurun ve PATH'e ekleyin
choco install ffmpeg  # Windows (Chocolatey ile)
```

### "ELEVENLABS_API_KEY is not set"
```powershell
# PowerShell'de geçici olarak:
$env:ELEVENLABS_API_KEY="your_key_here"

# Kalıcı olarak (System Environment Variables):
# Windows Settings > System > About > Advanced system settings > Environment Variables
```

### Video ve ses senkronize değil
```bash
# ffmpeg komutu ile manual ayar:
ffmpeg -i video.mp4 -i audio.mp3 -itsoffset 00:00:02 -c:v copy -c:a aac output.mp4
# -itsoffset 2 saniye gecikme ekler
```

## 📊 Dosya Yapısı

```
cypress/
├── logs/                           # Test logları (JSON)
│   ├── scenario_1__patient....json
│   ├── scenario_3__doctor....json
│   └── scenario_4__admin....json
│
├── subtext/                        # Anlatım metinleri (TXT)
│   ├── scenario_1__patient....txt  ✅ Oluşturuldu
│   ├── scenario_3__doctor....txt   ✅ Oluşturuldu
│   └── scenario_4__admin....txt    ✅ Oluşturuldu
│
├── audio/                          # Ses dosyaları (MP3)
│   └── scenario_1....mp3           ⏳ Oluşturulacak
│
├── videos/                         # Orijinal test videoları
│   └── hospital_flow.cy.ts.mp4     ✅ Var (1 MB)
│
└── narrated_videos/                # Final sesli videolar
    └── narrated_hospital_flow.....mp4  ⏳ Oluşturulacak
```

## 🎉 Sonuç

✅ **Hazır olan:**
- Cypress test videosu
- Test logları (gerçek veri)
- Anlatım metinleri (4 adet)
- Mouse tracking sistemi

⏳ **Yapılacak (isteğe bağlı):**
- ElevenLabs API key alıp ses oluşturma
- ffmpeg ile video+ses birleştirme

**Hemen dene:**
```bash
npm run make:narrated-demo
```

Başarılar! 🚀
