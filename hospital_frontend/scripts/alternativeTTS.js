// Alternative TTS using browser Web Speech API for demo
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('⚠️  ElevenLabs API key issue detected.');
console.log('📝 Creating demo instructions for alternative TTS solutions...\n');

const subtextDir = path.join(__dirname, '../cypress/subtext');
const audioDir = path.join(__dirname, '../cypress/audio');

if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

console.log('✅ Alternative TTS Options:\n');
console.log('1. Google Cloud TTS (Free Tier):');
console.log('   https://cloud.google.com/text-to-speech\n');

console.log('2. TTSMaker (Free, No Limit):');
console.log('   https://ttsmaker.com\n');

console.log('3. Natural Reader (Online Free):');
console.log('   https://www.naturalreaders.com/online/\n');

console.log('4. Microsoft Edge TTS (Free, Command Line):');
console.log('   Install: npm install -g edge-tts');
console.log('   Usage: edge-tts --text "your text" --write-media output.mp3\n');

console.log('📂 Subtext files ready for conversion:');
if (fs.existsSync(subtextDir)) {
    const files = fs.readdirSync(subtextDir).filter(f => f.endsWith('.txt'));
    files.forEach(file => {
        console.log(`   - ${file}`);
    });
} else {
    console.log('   No subtext files found.');
}

console.log(`\n💡 Once you have audio files, place them in:`);
console.log(`   ${audioDir}`);
console.log('\n🎬 Then run: npm run merge:video');
