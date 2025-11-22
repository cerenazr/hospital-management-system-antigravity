# PowerShell TTS Script - Windows Yerleşik Ses Sentezi
# Kullanım: .\generateVoiceWindows.ps1

$subtextDir = "cypress\subtext"
$audioDir = "cypress\audio"

# Audio klasörü yoksa oluştur
if (!(Test-Path $audioDir)) {
    New-Item -ItemType Directory -Path $audioDir | Out-Null
}

# TTS nesnesi oluştur
Add-Type -AssemblyName System.Speech
$synthesizer = New-Object System.Speech.Synthesis.SpeechSynthesizer

# Mevcut sesleri listele
Write-Host "🎙️  Kullanılabilir sesler:" -ForegroundColor Cyan
$synthesizer.GetInstalledVoices() | ForEach-Object {
    Write-Host "  - $($_.VoiceInfo.Name)" -ForegroundColor Gray
}

# Seçilen ses
$synthesizer.SelectVoiceByHints([System.Speech.Synthesis.VoiceGender]::Female)
Write-Host "`n✅ Kullanılan ses: $($synthesizer.Voice.Name)`n" -ForegroundColor Green

# Subtext dosyalarını işle
$files = Get-ChildItem -Path $subtextDir -Filter "*.txt"

if ($files.Count -eq 0) {
    Write-Host "❌ Subtext dosyası bulunamadı!" -ForegroundColor Red
    exit 1
}

Write-Host "📝 $($files.Count) dosya işlenecek...`n" -ForegroundColor Cyan

foreach ($file in $files) {
    $outputName = $file.BaseName + ".wav"
    $outputPath = Join-Path $audioDir $outputName
    
    Write-Host "Işleniyor: $($file.Name)..." -ForegroundColor Yellow
    
    # Metni oku
    $text = Get-Content $file.FullName -Raw
    
    # WAV dosyasına kaydet
    $synthesizer.SetOutputToWaveFile($outputPath)
    $synthesizer.Speak($text)
    
    Write-Host "✅ Oluşturuldu: $outputName" -ForegroundColor Green
}

$synthesizer.Dispose()

Write-Host "`n🎉 Tüm ses dosyaları oluşturuldu!" -ForegroundColor Green
Write-Host "📂 Konum: $audioDir`n" -ForegroundColor Cyan
Write-Host "🎬 Sonraki adım: npm run merge:video" -ForegroundColor Cyan
