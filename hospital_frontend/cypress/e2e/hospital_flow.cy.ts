describe('Hospital Appointment System E2E', () => {
    const API_URL = 'http://localhost:3000';

    const mockPatient = {
        id: 1,
        email: 'patient@test.com',
        full_name: 'Test Patient',
        role: 'patient'
    };

    const mockDoctor = {
        id: 2,
        email: 'doctor@test.com',
        full_name: 'Dr. House',
        role: 'doctor'
    };

    const mockAdmin = {
        id: 3,
        email: 'admin@test.com',
        full_name: 'Admin User',
        role: 'admin'
    };

    const mockDepts = [
        { id: 1, name: 'Cardiology' },
        { id: 2, name: 'Dermatology' }
    ];

    const mockDoctorsList = [
        { id: 101, user_id: 2, department_id: 1, full_name: 'Dr. House', title: 'MD' }
    ];

    const mockSlots = [
        { id: 1, doctor_id: 101, start_time: new Date(Date.now() + 86400000).toISOString(), is_booked: false },
        { id: 2, doctor_id: 101, start_time: new Date(Date.now() + 90000000).toISOString(), is_booked: true }
    ];

    beforeEach(() => {
        cy.window().then((win) => win.localStorage.clear());
    });

    it('Scenario 1: Patient registers, logs in, and books an appointment', () => {
        cy.intercept('POST', `${API_URL}/auth/register`, {
            statusCode: 201,
            body: { message: 'User created' }
        }).as('register');

        cy.intercept('POST', `${API_URL}/auth/login`, {
            statusCode: 200,
            body: {
                token: 'fake-jwt-token',
                user: mockPatient
            }
        }).as('login');

        cy.intercept('GET', `${API_URL}/departments`, {
            statusCode: 200,
            body: mockDepts
        }).as('getDepts');

        cy.intercept('GET', `${API_URL}/doctors?department_id=1`, {
            statusCode: 200,
            body: mockDoctorsList
        }).as('getDoctors');

        cy.intercept('GET', `${API_URL}/doctors/101/slots`, {
            statusCode: 200,
            body: mockSlots
        }).as('getSlots');

        cy.intercept('POST', `${API_URL}/appointments`, {
            statusCode: 201,
            body: { id: 501, status: 'scheduled' }
        }).as('bookAppointment');

        cy.intercept('GET', `${API_URL}/appointments/mine`, {
            statusCode: 200,
            body: [
                {
                    id: 501,
                    doctor_name: 'Dr. House',
                    department_name: 'Cardiology',
                    slot_time: mockSlots[0].start_time,
                    status: 'scheduled'
                }
            ]
        }).as('getMyAppointments');

        cy.visit('/register');
        cy.get('[data-cy=fullname-input]').type('Test Patient');
        cy.get('[data-cy=email-input]').type('patient@test.com');
        cy.get('[data-cy=password-input]').type('password');
        cy.get('[data-cy=dob-input]').type('1990-01-01');
        cy.get('[data-cy=phone-input]').type('1234567890');
        cy.get('[data-cy=register-submit]').click();
        cy.wait('@register');

        cy.location('pathname').should('eq', '/login');
        cy.get('[data-cy=email-input]').type('patient@test.com');
        cy.get('[data-cy=password-input]').type('password');
        cy.get('[data-cy=login-submit]').click();
        cy.wait('@login');

        cy.location('pathname').should('eq', '/patient');
        cy.contains('Book Appointment').click();

        cy.wait('@getDepts');
        // Select by value to be precise
        cy.get('[data-cy=dept-select]').select('1');

        cy.wait('@getDoctors');
        cy.get('[data-cy=doctor-select]').select('101');

        cy.wait('@getSlots');
        cy.get('[data-cy=slot-1]').click();

        cy.wait('@bookAppointment');

        cy.location('pathname').should('eq', '/patient/appointments');
        cy.wait('@getMyAppointments');
        cy.contains('Dr. House');
        cy.contains('SCHEDULED');
    });

    it('Scenario 2: Doctor views appointments and updates status', () => {
        cy.intercept('POST', `${API_URL}/auth/login`, {
            statusCode: 200,
            body: {
                token: 'doctor-jwt-token',
                user: mockDoctor
            }
        }).as('loginDoctor');

        // Initial load
        cy.intercept('GET', `${API_URL}/appointments/doctor`, {
            statusCode: 200,
            body: [
                {
                    id: 501,
                    patient_id: 1,
                    slot_time: mockSlots[0].start_time,
                    status: 'scheduled'
                }
            ]
        }).as('getDocAppointments');

        cy.intercept('GET', `${API_URL}/doctors/2/slots`, {
            statusCode: 200,
            body: mockSlots
        }).as('getDocSlots');

        cy.intercept('PUT', `${API_URL}/appointments/501/status`, {
            statusCode: 200,
            body: { id: 501, status: 'completed' }
        }).as('updateStatus');

        cy.visit('/login');
        cy.get('[data-cy=email-input]').type('doctor@test.com');
        cy.get('[data-cy=password-input]').type('password');
        cy.get('[data-cy=login-submit]').click();
        cy.wait('@loginDoctor');

        cy.location('pathname').should('eq', '/doctor');
        cy.wait('@getDocAppointments');

        cy.contains('SCHEDULED');

        // Prepare for the re-fetch after update
        cy.intercept('GET', `${API_URL}/appointments/doctor`, {
            statusCode: 200,
            body: [
                {
                    id: 501,
                    patient_id: 1,
                    slot_time: mockSlots[0].start_time,
                    status: 'completed'
                }
            ]
        }).as('getDocAppointmentsUpdated');

        cy.get('[data-cy=complete-btn-501]').click();
        cy.wait('@updateStatus');

        cy.wait('@getDocAppointmentsUpdated');
        cy.contains('COMPLETED');
    });

    it('Scenario 3: Admin manages departments', () => {
        cy.intercept('POST', `${API_URL}/auth/login`, {
            statusCode: 200,
            body: { token: 'admin-jwt-token', user: mockAdmin }
        }).as('loginAdmin');

        cy.intercept('GET', `${API_URL}/departments`, {
            statusCode: 200,
            body: mockDepts
        }).as('getDepts');

        cy.intercept('GET', `${API_URL}/doctors`, {
            statusCode: 200,
            body: mockDoctorsList
        }).as('getDoctors');

        cy.intercept('POST', `${API_URL}/departments`, {
            statusCode: 201,
            body: { id: 3, name: 'Neurology' }
        }).as('createDept');

        cy.visit('/login');
        cy.get('[data-cy=email-input]').type('admin@test.com');
        cy.get('[data-cy=password-input]').type('password');
        cy.get('[data-cy=login-submit]').click();
        cy.wait('@loginAdmin');

        cy.location('pathname').should('eq', '/admin');
        cy.wait('@getDepts');

        // Prepare for re-fetch
        cy.intercept('GET', `${API_URL}/departments`, {
            statusCode: 200,
            body: [...mockDepts, { id: 3, name: 'Neurology' }]
        }).as('getDeptsUpdated');

        cy.get('[data-cy=dept-input]').type('Neurology');
        cy.get('[data-cy=add-dept-btn]').click();
        cy.wait('@createDept');

        cy.wait('@getDeptsUpdated');
        cy.contains('Neurology');
    });
});
