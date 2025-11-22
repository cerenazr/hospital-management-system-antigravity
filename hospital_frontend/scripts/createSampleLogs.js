import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create sample logs directory
const logsDir = path.join(__dirname, '../cypress/logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Sample log data
const sampleLog = {
    testName: "Hospital Appointment System E2E - Scenario 1: Patient registers, logs in, and books an appointment",
    startedAt: Date.now() - 60000,
    finishedAt: Date.now(),
    steps: [
        "visit /register",
        "get [data-cy=fullname-input]",
        "type Test Patient",
        "get [data-cy=email-input]",
        "type patient@test.com",
        "get [data-cy=password-input]",
        "type password",
        "get [data-cy=dob-input]",
        "type 1990-01-01",
        "get [data-cy=phone-input]",
        "type 1234567890",
        "get [data-cy=register-submit]",
        "click",
        "visit /login",
        "get [data-cy=email-input]",
        "type patient@test.com",
        "get [data-cy=password-input]",
        "type password",
        "get [data-cy=login-submit]",
        "click",
        "contains Book Appointment",
        "click",
        "get [data-cy=dept-select]",
        "select 1",
        "get [data-cy=doctor-select]",
        "select 101",
        "get [data-cy=slot-1]",
        "click"
    ],
    assertions: [
        "expected '/login' to equal '/login'",
        "expected '/patient' to equal '/patient'",
        "expected '/patient/appointments' to equal '/patient/appointments'",
        "expected to find element: 'Dr. House'",
        "expected to find content: 'scheduled'"
    ],
    cypressLogs: [
        "POST /auth/register 201",
        "POST /auth/login 200",
        "GET /departments 200",
        "GET /doctors?department_id=1 200",
        "GET /doctors/101/slots 200",
        "POST /appointments 201",
        "GET /appointments/mine 200"
    ],
    mouseLogs: [
        { time: Date.now() - 60000, x: 350, y: 410 },
        { time: Date.now() - 59000, x: 365, y: 420 },
        { time: Date.now() - 58000, x: 380, y: 430 },
        { time: Date.now() - 50000, x: 400, y: 300 },
        { time: Date.now() - 45000, x: 450, y: 250 },
        { time: Date.now() - 40000, x: 500, y: 200 }
    ]
};

// Save sample log
const fileName = 'scenario_1_patient_registers_logs_in_and_books_an_appointment.json';
const filePath = path.join(logsDir, fileName);
fs.writeFileSync(filePath, JSON.stringify(sampleLog, null, 2));

console.log(`✅ Created sample log file: ${filePath}`);
console.log('\nYou can now run:');
console.log('  npm run generate:subtext');
console.log('  npm run generate:voiceover (requires ELEVENLABS_API_KEY)');
console.log('  npm run merge:video (requires video file)');
