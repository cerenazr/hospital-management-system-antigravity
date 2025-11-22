# Hospital Appointment System

This is a monorepo containing the backend and frontend for the Hospital Appointment System.

## Project Structure

- `hospital_api`: Ruby on Rails 8 API (Backend)
- `hospital_frontend`: React + Vite + TypeScript (Frontend)

## Prerequisites

- Ruby 3.x
- Rails 8.x
- PostgreSQL
- Node.js & npm

## Setup Instructions

### Backend (hospital_api)

1. Navigate to the backend directory:
   ```bash
   cd hospital_api
   ```
2. Install dependencies:
   ```bash
   bundle install
   ```
3. Setup database:
   ```bash
   bin/rails db:create db:migrate db:seed
   ```
4. Start the server:
   ```bash
   bin/rails s
   ```
   The API will run on `http://localhost:3000`.

### Frontend (hospital_frontend)

1. Navigate to the frontend directory:
   ```bash
   cd hospital_frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:5173`.

## Running Tests

### Cypress E2E Tests

The Cypress tests are located in `hospital_frontend/cypress`.

To run them interactively:
```bash
npx cypress open
```

To run them in headless mode (with video recording):
```bash
npx cypress run
```

**Note:** Since the backend environment was not available during generation, the Cypress tests are configured to use **network mocking** (`cy.intercept`) to demonstrate the frontend flow without a running backend. To test against the real backend, remove the `cy.intercept` calls in the test files.

## Automated Narrated Demo Pipeline

This project includes an automated pipeline to create narrated demo videos from Cypress E2E tests.

### Prerequisites for Narrated Demos

- **ffmpeg**: Required for merging audio and video. Install from [ffmpeg.org](https://ffmpeg.org/)
- **ElevenLabs API Key**: Set the `ELEVENLABS_API_KEY` environment variable to use the text-to-speech service

### Pipeline Overview

The pipeline consists of four main steps:

1. **Mouse Tracking**: The frontend logs mouse movements during tests
2. **Log Collection**: Cypress captures test steps, assertions, and logs
3. **Narration Generation**: Creates a human-readable script and converts it to speech
4. **Video Merging**: Combines the original test video with the narration audio

### How It Works

#### 1. Run Cypress Tests with Logging

The tests automatically capture:
- Test steps and commands
- Assertions and their results
- Mouse movements from the custom cursor
- API calls and responses

```bash
cd hospital_frontend
npm run test:e2e
```

Logs are saved in `cypress/logs/` as JSON files.

#### 2. Generate Narration Script

Convert the logs into a human-readable script:

```bash
npm run generate:subtext
```

This creates text files in `cypress/subtext/` describing what happens in each test.

#### 3. Generate Voice-Over Audio

Convert the script to speech using ElevenLabs:

```bash
export ELEVENLABS_API_KEY=your_api_key_here
npm run generate:voiceover
```

Audio files are saved in `cypress/audio/` as MP3.

#### 4. Merge Audio with Video

Combine the Cypress video with the generated narration:

```bash
npm run merge:video
```

The final narrated video is saved in `cypress/narrated_videos/`.

### One-Command Pipeline

Run all steps in sequence:

```bash
export ELEVENLABS_API_KEY=your_api_key_here
npm run make:narrated-demo
```

### Output Structure

```
cypress/
├── logs/              # JSON test logs
├── subtext/           # Generated narration scripts
├── audio/             # Generated voice-over MP3s
├── videos/            # Original Cypress videos
└── narrated_videos/   # Final narrated demo videos
```

### Customization

- **Voice Settings**: Edit `scripts/generateVoiceover.js` to change the ElevenLabs voice ID or settings
- **Narration Script**: Modify `scripts/generateSubtext.js` to customize how the script is generated
- **Video/Audio Mapping**: Update `scripts/mergeVideoAudio.js` to change how videos and audio files are matched
