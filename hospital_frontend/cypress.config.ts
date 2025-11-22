import { defineConfig } from "cypress";
import fs from 'fs';
import path from 'path';

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            on('task', {
                saveLogs({ testName, logs }) {
                    const logsDir = path.join(__dirname, 'cypress', 'logs');
                    if (!fs.existsSync(logsDir)) {
                        fs.mkdirSync(logsDir, { recursive: true });
                    }
                    const fileName = `${testName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
                    const filePath = path.join(logsDir, fileName);
                    fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));
                    return null;
                },
            });
        },
        video: true,
        baseUrl: 'http://localhost:5173',
    },
});
