import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const videoDir = path.join(__dirname, '../cypress/videos');
const audioDir = path.join(__dirname, '../cypress/audio');
const outputDir = path.join(__dirname, '../cypress/narrated_videos');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Verify ffmpeg is available
exec('ffmpeg -version', (error) => {
    if (error) {
        console.error('❌ ffmpeg is not installed or not in PATH.');
        console.log('\nPlease install ffmpeg:');
        console.log('  Windows: Download from https://ffmpeg.org/ and add to PATH');
        console.log('  Mac: brew install ffmpeg');
        console.log('  Linux: sudo apt install ffmpeg');
        process.exit(1);
    }
});

if (!fs.existsSync(videoDir) || !fs.existsSync(audioDir)) {
    console.error('❌ Missing video or audio directories.');
    process.exit(1);
}

const videoFiles = fs.readdirSync(videoDir).filter(f => f.endsWith('.mp4'));
const audioFiles = fs.readdirSync(audioDir).filter(f => f.endsWith('.mp3'));

if (videoFiles.length === 0) {
    console.error('❌ No video files found. Run Cypress tests first.');
    process.exit(1);
}

if (audioFiles.length === 0) {
    console.error('❌ No audio files found. Run npm run generate:voiceover first.');
    process.exit(1);
}

console.log(`🎬 Merging video and audio...\n`);

// Strategy: Take the first (or only) video and first audio
const videoPath = path.join(videoDir, videoFiles[0]);
const audioPath = path.join(audioDir, audioFiles[0]);
const outputPath = path.join(outputDir, `narrated_${videoFiles[0]}`);

console.log(`Video: ${videoFiles[0]}`);
console.log(`Audio: ${audioFiles[0]}`);
console.log(`Output: narrated_${videoFiles[0]}\n`);

// Use -filter_complex to add audio as an overlay
const command = `ffmpeg -i "${videoPath}" -i "${audioPath}" -c:v copy -c:a aac -shortest "${outputPath}" -y`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`❌ Error merging video: ${error.message}`);
        console.error(stderr);
        process.exit(1);
    }

    console.log(`✅ Narrated video created successfully!`);
    console.log(`📁 Location: ${outputPath}`);
    console.log(`\n🎉 Pipeline complete! Your narrated demo video is ready.`);
});
