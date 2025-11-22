// Import commands.js using ES2015 syntax:
import './commands'

let currentTestLogs: any = null;

beforeEach(() => {
    currentTestLogs = {
        testName: '',
        startedAt: Date.now(),
        steps: [],
        assertions: [],
        cypressLogs: [],
        mouseLogs: [],
    };
});

afterEach(function () {
    if (!currentTestLogs) return;

    currentTestLogs.testName = this.currentTest?.title || 'Unknown Test';
    currentTestLogs.finishedAt = Date.now();

    // Try to get mouse logs from window, but don't fail if not available
    cy.window({ log: false }).then((win: any) => {
        if (win.mouseLogs && Array.isArray(win.mouseLogs)) {
            currentTestLogs.mouseLogs = win.mouseLogs.slice(); // Copy array
        }
    }).then(() => {
        // Save logs via task (this is async-safe)
        return cy.task('saveLogs', {
            testName: currentTestLogs.testName,
            logs: currentTestLogs
        }, { log: false });
    });
});

// Capture commands
Cypress.on('command:start', (command) => {
    if (!currentTestLogs) return;

    if (['visit', 'click', 'type', 'select', 'get', 'contains'].includes(command.attributes.name)) {
        const args = command.attributes.args || [];
        currentTestLogs.steps.push(`${command.attributes.name} ${args.join(' ')}`);
    }
    currentTestLogs.cypressLogs.push(`${command.attributes.name}`);
});

// Capture assertions
Cypress.on('log:added', (log) => {
    if (!currentTestLogs) return;

    if (log.name === 'assert' && log.message) {
        currentTestLogs.assertions.push(log.message);
    }
});
