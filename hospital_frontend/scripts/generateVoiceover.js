import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const subtextDir = path.join(__dirname, '../cypress/subtext');
const audioDir = path.join(__dirname, '../cypress/audio');

if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel (default example voice)

if (!API_KEY) {
    console.error('❌ Error: ELEVENLABS_API_KEY environment variable is not set.');
    console.log('\nTo use ElevenLabs TTS, set your API key:');
    console.log('  Windows (PowerShell): $env:ELEVENLABS_API_KEY="your_key_here"');
    console.log('  Mac/Linux: export ELEVENLABS_API_KEY="your_key_here"');
    process.exit(1);
}

if (!fs.existsSync(subtextDir)) {
    console.error('❌ No subtext directory found. Run npm run generate:subtext first.');
    process.exit(1);
}

const files = fs.readdirSync(subtextDir).filter(f => f.endsWith('.txt'));

if (files.length === 0) {
    console.error('❌ No subtext files found.');
    process.exit(1);
}

console.log(`🎙️  Generating voice-over for ${files.length} file(s)...\n`);

const processFile = (file) => {
    return new Promise((resolve, reject) => {
        const textPath = path.join(subtextDir, file);
        const text = fs.readFileSync(textPath, 'utf8');
        const outputPath = path.join(audioDir, file.replace('.txt', '.mp3'));

        console.log(`Processing: ${file}...`);

        const options = {
            hostname: 'api.elevenlabs.io',
            path: `/v1/text-to-speech/${VOICE_ID}`,
            method: 'POST',
            headers: {
                'xi-api-key': API_KEY,
                'Content-Type': 'application/json',
            },
        };

        const req = https.request(options, (res) => {
            if (res.statusCode !== 200) {
                console.error(`❌ API Request failed with status ${res.statusCode}`);
                let errorData = '';
                res.on('data', chunk => errorData += chunk);
                res.on('end', () => {
                    console.error(errorData);
                    reject(new Error(`API error: ${res.statusCode}`));
                });
                return;
            }

            const fileStream = fs.createWriteStream(outputPath);
            res.pipe(fileStream);

            fileStream.on('finish', () => {
                console.log(`✅ Audio saved: ${path.basename(outputPath)}`);
                resolve();
            });

            fileStream.on('error', reject);
        });

        req.on('error', (e) => {
            console.error(`❌ Request error: ${e.message}`);
            reject(e);
        });

        req.write(JSON.stringify({
            text: text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.5
            }
        }));

        req.end();
    });
};

// Process files sequentially to avoid rate limiting
(async () => {
    for (const file of files) {
        try {
            await processFile(file);
        } catch (error) {
            console.error(`Failed to process ${file}:`, error.message);
        }
    }
    console.log('\n✅ Voice-over generation complete!');
})();
