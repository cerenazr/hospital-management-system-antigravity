# ElevenLabs API Key Sorunu - Alternatif Çözümler

## ❌ Sorun
Verdiğiniz API key ElevenLabs tarafından reddedildi (401 Unauthorized).

Olası sebepler:
- API key formatı yanlış (ElevenLabs key'leri genelde "sk_" ile başlamaz)
- Key henüz aktif edilmemiş
- Hesap doğrulanmamış

## ✅ Çözümler

### Çözüm 1: Doğru ElevenLabs API Key Alın

1. [elevenlabs.io](https://elevenlabs.io) adresine gidin
2. Sign Up / Login yapın
3. Sol menüden **"Profile"** → **"API Keys"** sekmesine gidin
4. **"Create API Key"** butonuna tıklayın
5. Key'i kopyalayın (genelde uzun bir hex string olur)

### Çözüm 2: Manuel Ses Kaydı (Tavsiye Edilen)

API key beklemeden hemen demo yapabilirsiniz:

**Adım 1: Anlatım metnini okuyun**
```powershell
notepad DEMO_NARRATION_SCRIPT.md
```

**Adım 2: Ses kaydedin**
- Windows Ses Kaydedici kullanın
- Veya [Audacity](https://www.audacityteam.org/) (ücretsiz) indirin
- Metni okuyup kaydedin
- MP3 olarak kaydedin: `cypress/audio/demo_narration.mp3`

**Adım 3: Video ile birleştirin**
```powershell
npm run merge:video
```

### Çözüm 3: Online TTS Araçları (Ücretsiz)

**Google Cloud Text-to-Speech (Ücretsiz Deneme):**
1. [cloud.google.com/text-to-speech](https://cloud.google.com/text-to-speech)
2. "Try for free" → metni yapıştır
3. MP3'ü indir
4. `cypress/audio/` klasörüne kopyala

**Natural Reader (Online, Ücretsiz):**
1. [naturalreaders.com](https://www.naturalreaders.com/online/)
2. Metni yapıştır
3. "Play" ve "Download" ile indir

**TTSMaker (Ücretsiz, Limitsiz):**
1. [ttsmaker.com](https://www.ttsmaker.com/)
2. Metni yapıştır
3. Dil: English
4. Ses: Matthew/Joanna
5. Download MP3

### Çözüm 4: Hızlı Demo İçin Örnek Ses

Ben sizin için kısa bir örnek script oluşturdum:

```
DEMO_NARRATION_SCRIPT.md dosyasında profesyonel ~60 saniyelik
anlatım metni var. Bu metni:

1. Kendiniz okuyup kaydedin VEYA
2. Yukarıdaki ücretsiz TTS araçlarından birine yapıştırın VEYA
3. ElevenLabs'dan doğru API key alıp tekrar deneyin
```

## 🎬 ffmpeg Kurulumu (Video Birleştirmek İçin)

```powershell
# Chocolatey ile (önerilen):
choco install ffmpeg

# Manuel:
# 1. https://ffmpeg.org/download.html
# 2. Windows build indir
# 3. PATH'e ekle
```

Test:
```powershell
ffmpeg -version
```

## 📊 Şu Anda Elimizde Olanlar

✅ **Cypress test videosu**: `cypress/videos/hospital_flow.cy.ts.mp4`
✅ **Test logları**: Gerçek verilerle
✅ **Anlatım metinleri**: 4 adet, otomatik oluşturulmuş
✅ **Profesyonel script**: `DEMO_NARRATION_SCRIPT.md` (60 saniyelik)
✅ **Mouse tracking**: Videoda aktif
✅ **Birleştirme scripti**: Hazır (`npm run merge:video`)

⏳ **Eksik**: Sadece ses dosyası (MP3)

## 🚀 Hemen Yapılabilecekler

**Seçenek A**: Kendiniz okuyun (5 dakika)
```powershell
# 1. Metni aç
notepad DEMO_NARRATION_SCRIPT.md

# 2. Windows Ses Kaydedici ile kaydet
# 3. MP3 olarak cypress/audio/ klasörüne kaydet

# 4. Birleştir
npm run merge:video
```

**Seçenek B**: Online TTS (2 dakika)
```powershell
# 1. ttsmaker.com'a git
# 2. DEMO_NARRATION_SCRIPT.md'deki metni yapıştır
# 3. MP3'ü indir
# 4. cypress/audio/ klasörüne at
# 5. npm run merge:video
```

**Seçenek C**: ElevenLabs (doğru key ile)
```powershell
# 1. elevenlabs.io'dan DOĞRU API key al
# 2. npm run generate:voiceover
# 3. npm run merge:video
```

Hangi yolu tercih edersiniz?
