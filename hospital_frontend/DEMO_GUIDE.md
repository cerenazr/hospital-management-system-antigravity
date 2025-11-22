# Automated Narrated Demo Pipeline - Quick Start Guide

## Overview

This automated pipeline transforms Cypress E2E test runs into professional narrated demo videos. It captures test execution, generates human-readable narration scripts, converts them to speech using ElevenLabs TTS, and merges everything into a final video.

## What You Get

- **Mouse Tracking**: Custom cursor that logs all mouse movements during tests
- **Test Logging**: Automatic capture of test steps, assertions, and API calls
- **Smart Narration**: AI-generated scripts that explain what's happening in natural language
- **Professional Voice-Over**: High-quality text-to-speech using ElevenLabs
- **Final Video**: Narrated demo video ready to share

## Prerequisites

### Required
- Node.js (already installed ✅)
- ffmpeg - for video/audio merging
  - **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/) and add to PATH
  - **Mac**: `brew install ffmpeg`
  - **Linux**: `sudo apt install ffmpeg`

### Optional (for voice-over)
- ElevenLabs API Key - get one at [elevenlabs.io](https://elevenlabs.io/)
  - Free tier includes 10,000 characters/month

## Quick Start (With Sample Data)

Test the pipeline without running actual Cypress tests:

```bash
# 1. Create sample log data
npm run demo:create-sample

# 2. Generate narration script
npm run generate:subtext

# 3. Check the generated script
cat cypress/subtext/scenario_1_patient_registers_logs_in_and_books_an_appointment.txt

# 4. (Optional) Generate voice-over
# Set your API key first:
#   Windows PowerShell: $env:ELEVENLABS_API_KEY="your_key_here"
#   Mac/Linux: export ELEVENLABS_API_KEY="your_key_here"
npm run generate:voiceover

# 5. (Optional) Merge with video
# Copy a test video to cypress/videos/ first
npm run merge:video
```

## Full Workflow (With Real Tests)

### 1. Run Cypress Tests

The mouse logger and test logger are automatically active:

```bash
# Start the dev server (in one terminal)
npm run dev

# Run tests (in another terminal)
npm run test:e2e
```

After tests complete, you'll have:
- `cypress/videos/<test>.mp4` - Test recording
- `cypress/logs/<test>.json` - Captured logs

### 2. Generate Narration Script

```bash
npm run generate:subtext
```

This creates `cypress/subtext/<test>.txt` with natural language narration.

### 3. Generate Voice-Over

```bash
# Set your ElevenLabs API key
export ELEVENLABS_API_KEY="your_key_here"

npm run generate:voiceover
```

This creates `cypress/audio/<test>.mp3` with the narration audio.

### 4. Merge Video and Audio

```bash
npm run merge:video
```

This creates `cypress/narrated_videos/narrated_<test>.mp4` - your final demo!

### One Command for All

After running tests, generate the full narrated demo:

```bash
export ELEVENLABS_API_KEY="your_key_here"
npm run make:narrated-demo
```

## Output Structure

```
hospital_frontend/
├── cypress/
│   ├── logs/                      # JSON test logs
│   │   └── scenario_*.json
│   ├── subtext/                   # Generated narration scripts
│   │   └── scenario_*.txt
│   ├── audio/                     # Generated voice-overs
│   │   └── scenario_*.mp3
│   ├── videos/                    # Original Cypress videos
│   │   └── hospital_flow.cy.ts.mp4
│   └── narrated_videos/           # Final narrated demos ⭐
│       └── narrated_hospital_flow.cy.ts.mp4
```

## Customization

### Change Voice Settings

Edit `scripts/generateVoiceover.js`:

```javascript
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Change to your preferred voice
voice_settings: {
  stability: 0.5,        // 0-1: Lower = more expressive
  similarity_boost: 0.5  // 0-1: Higher = closer to original voice
}
```

### Customize Narration Style

Edit `scripts/generateSubtext.js` to change how the script is generated from logs.

### Adjust Video/Audio Mapping

Edit `scripts/mergeVideoAudio.js` if you need custom matching logic for multiple videos/audios.

## Troubleshooting

### "Cannot find module 'fs'"
- This is a TypeScript lint warning in cypress.config.ts
- The code works fine. Install `@types/node` to fix: `npm install --save-dev @types/node`

### "ffmpeg is not installed"
- Install ffmpeg and ensure it's in your system PATH
- Test with: `ffmpeg -version`

### "ELEVENLABS_API_KEY is not set"
- Set the environment variable before running voice-over generation
- Get a free API key from [elevenlabs.io](https://elevenlabs.io/)

### No logs generated after Cypress run
- Check `cypress/logs/` directory exists
- Look for errors in Cypress console
- Try running tests with `npm run test:e2e:open` to debug

## Tips

1. **Test Without Voice-Over**: You can skip the voice-over step and just generate subtitles for review
2. **Batch Processing**: The scripts process all files in their input directories
3. **Custom Cursor**: The red dot cursor is visible in videos and helps track user actions
4. **API Rate Limits**: Free ElevenLabs tier has character limits - be mindful of narration length

## Next Steps

- Run `npm run demo:create-sample` to test the pipeline
- Customize the narration in `generateSubtext.js` to match your style
- Experiment with different ElevenLabs voices
- Share your narrated demos with stakeholders!

---

**Need Help?** Check the main README.md for more details.
