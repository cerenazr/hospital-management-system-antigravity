import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, '../cypress/logs');
const outputDir = path.join(__dirname, '../cypress/subtext');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Find the latest log file or process all
if (!fs.existsSync(logsDir)) {
    console.log('❌ No logs directory found. Run Cypress tests first.');
    process.exit(0);
}

const files = fs.readdirSync(logsDir).filter(f => f.endsWith('.json'));
if (files.length === 0) {
    console.log('❌ No log files found.');
    process.exit(0);
}

// Process all log files
files.forEach(file => {
    const logPath = path.join(logsDir, file);
    const logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));

    let script = `Welcome to this demonstration of the Hospital Appointment System.\n\n`;
    script += `In this test, titled "${logs.testName}", we will walk through the complete user journey.\n\n`;

    script += `The test begins at ${new Date(logs.startedAt).toLocaleTimeString()}.\n\n`;

    // Process steps with more intelligent interpretation
    let currentSection = '';
    logs.steps.forEach((step, index) => {
        if (step.startsWith('visit')) {
            const page = step.replace('visit ', '');
            script += `First, we navigate to the ${page} page.\n`;
        } else if (step.includes('fullname') || step.includes('email') || step.includes('password')) {
            if (currentSection !== 'form') {
                script += `Now, we fill in the registration form with the user's information.\n`;
                currentSection = 'form';
            }
        } else if (step.includes('dept-select')) {
            script += `The user selects a medical department from the dropdown menu.\n`;
        } else if (step.includes('doctor-select')) {
            script += `Next, the user chooses a specific doctor from the available options.\n`;
        } else if (step.includes('slot')) {
            script += `The user then selects an available appointment time slot.\n`;
        } else if (step.startsWith('click') && step.includes('submit')) {
            script += `The user submits the form to proceed.\n`;
        } else if (step.startsWith('contains Book Appointment')) {
            script += `The user clicks on the Book Appointment button to start the booking process.\n`;
        }
    });

    // Add assertions
    if (logs.assertions.length > 0) {
        script += `\nThroughout this process, the system performs several validations:\n`;
        logs.assertions.forEach((assert, i) => {
            if (i < 3) { // Limit to first 3 to keep it concise
                script += `- ${assert}\n`;
            }
        });
    }

    // Add API information
    if (logs.cypressLogs.some(log => log.includes('POST') || log.includes('GET'))) {
        script += `\nBehind the scenes, the application communicates with the backend API through several requests, `;
        script += `including authentication, fetching available doctors and time slots, and finally creating the appointment.\n`;
    }

    script += `\nThe test completes successfully at ${new Date(logs.finishedAt).toLocaleTimeString()}, `;
    script += `demonstrating a seamless user experience from registration to appointment booking.\n`;

    const outputPath = path.join(outputDir, file.replace('.json', '.txt'));
    fs.writeFileSync(outputPath, script);
    console.log(`✅ Generated subtext: ${outputPath}`);
});

console.log(`\n✅ Narration script generation complete!`);
