# Hospital Appointment System

This is a monorepo containing the backend and frontend for the Hospital Appointment System.

## Project Structure

* `hospital_api`: Ruby on Rails 8 API (Backend)
* `hospital_frontend`: React + Vite + TypeScript (Frontend)

## 🧠 Antigravity Prompt Used

This is the clean and comprehensive prompt that generated the entire system in **22 minutes**:

```
You are an expert full-stack architect and test-driven developer.

I want you to DESIGN AND GENERATE a complete hospital appointment system with:

- Backend: Ruby on Rails 8 (API-only) + PostgreSQL
- Frontend: React + Vite + TypeScript (SPA)
- E2E tests: Cypress (with video recordings enabled)
- Goal: At the end I will run Cypress tests and record a demo video of the full flow.

Please work in a monorepo layout with two folders:
- `hospital_api` → Rails 8 API-only backend
- `hospital_frontend` → React + Vite + TypeScript frontend
- A root README that explains how to run both and how to run Cypress.

------------------------------------------------------
1) DOMAIN & REQUIREMENTS – HOSPITAL APPOINTMENT SYSTEM
------------------------------------------------------

We are building a hospital appointment system with three main roles:

1. Admin
2. Doctor
3. Patient

High-level features:

- User authentication and role-based authorization
- Departments & Doctors management (Admin)
- Patients can register and manage their own profile
- Doctors can define their available time slots
- Patients can search doctors and book appointments in available slots
- System must prevent double-booking of the same time slot
- Appointments have status (e.g., `scheduled`, `completed`, `cancelled`)
- Simple dashboards for each role
- End-to-end tests with Cypress that simulate real user flows and create a clean demo scenario.

Please start by clearly defining the domain models and their relationships, then implement RESTful endpoints and connect them to a TypeScript React frontend with E2E tests.

-----------------------------------
2) BACKEND – RAILS 8 API (hospital_api)
-----------------------------------

### 2.1. Tech setup

- Ruby on Rails 8 in API-only mode
- PostgreSQL as database
- Use a simple JWT-based authentication (or equivalent token-based solution) for stateless API auth
- Use `rack-cors` (or Rails 8 equivalent) to allow cross-origin requests from the frontend (`http://localhost:5173`)
- Add basic validations and proper error handling (returning JSON error messages with status codes such as 400, 401, 403, 404, 422).

### 2.2. Models

Define at least the following models, with reasonable attributes:

1. `User`
   - `id`
   - `email` (unique)
   - `password_digest`
   - `full_name`
   - `role` (enum: `admin`, `doctor`, `patient`)
   - Timestamps

2. `Department`
   - `id`
   - `name` (e.g., "Cardiology", "Dermatology")
   - `description` (optional)
   - Timestamps

3. `Doctor`
   - `id`
   - `user_id` (references User; must have `role = doctor`)
   - `department_id`
   - `title` (e.g., "Prof. Dr.", "Uzm. Dr.")
   - `bio` (short text)
   - Timestamps

4. `Patient`
   - `id`
   - `user_id` (references User; must have `role = patient`)
   - `date_of_birth`
   - `gender` (string or enum)
   - `phone`
   - Timestamps

5. `AppointmentSlot`
   - `id`
   - `doctor_id`
   - `start_time` (datetime)
   - `end_time` (datetime)
   - `is_booked` (boolean, default false)
   - Timestamps

6. `Appointment`
   - `id`
   - `patient_id`
   - `doctor_id`
   - `appointment_slot_id`
   - `status` (enum: `scheduled`, `completed`, `cancelled`)
   - `notes` (optional, text)
   - Timestamps

### 2.3. Authentication & Authorization

Create endpoints for auth:

- `POST /auth/register`  
  - Registers a new `User` with role `patient` by default and also creates a `Patient` profile.
- `POST /auth/login`  
  - Accepts email + password; returns a JWT token and basic user info including `role`.
- `GET /auth/me`  
  - Returns current user info based on token.

Implement a simple JWT strategy:

- Incoming requests send `Authorization: Bearer <token>` header.
- Protect endpoints under `/admin`, `/doctors`, `/patients`, `/appointments` appropriately.
- Only admins can manage departments and create new doctors.
- Doctors can manage their own appointment slots and see their own appointments.
- Patients can book and manage their own appointments.

### 2.4. RESTful Endpoints

Define controllers and routes similar to:

**Departments (Admin only):**
- `GET /departments`
- `POST /departments`
- `GET /departments/:id`
- `PUT /departments/:id`
- `DELETE /departments/:id`

**Doctors (Admin & public read):**
- `GET /doctors` – list all doctors, filter by department if `department_id` is provided.
- `GET /doctors/:id`
- `POST /doctors` – Admin: create a new doctor (and associated user with role=doctor if needed).
- `PUT /doctors/:id` – Admin: update.
- `DELETE /doctors/:id` – Admin: delete or deactivate.

**Patients:**
- `GET /patients/me` – Patient: get own profile.
- `PUT /patients/me` – Patient: update own profile (phone, etc.)

**Appointment Slots (Doctor):**
- `GET /doctors/:doctor_id/slots` – list slots for a doctor.
- `POST /doctors/:doctor_id/slots` – doctor creates available slots; input can be a single slot or a range.
- `PUT /slots/:id` – update a slot (e.g., mark as unavailable).
- `DELETE /slots/:id` – delete a slot (if no appointment is booked).

**Appointments:**
- `GET /appointments/mine` – for patients: list their own appointments.
- `GET /appointments/doctor` – for doctors: list their own appointments (with optional filters: date range, status).
- `POST /appointments` – patient books an appointment:
  - Request: `doctor_id`, `appointment_slot_id`, optional `notes`.
  - Validations:
    - Slot belongs to that doctor.
    - Slot is not in the past.
    - Slot is not already booked.
    - On success: mark slot as booked and create Appointment with status `scheduled`.
- `PUT /appointments/:id/cancel` – patient can cancel their own appointment (update status, free up slot if appropriate).
- `PUT /appointments/:id/status` – doctor can mark appointment status as `completed` or `cancelled`.

Return clean JSON responses, including nested details where useful (for example, for an appointment: include doctor name, department, slot time).

### 2.5. Seeds

Add a seed file to populate example data for demo:

- 1 Admin user
- 2 Departments (e.g., Cardiology, Dermatology)
- 3–4 Doctors across these departments (with corresponding Users as `role=doctor`)
- A demo patient user and patient profile
- A few `AppointmentSlot`s for each doctor over the next few days.

Provide instructions in README to run migrations and seeds:

- `bin/rails db:create db:migrate db:seed`

-------------------------------------------------
3) FRONTEND – REACT + VITE + TYPESCRIPT (hospital_frontend)
-------------------------------------------------

### 3.1. Tech setup

- Create a Vite + React + TypeScript app.
- Organize code with a simple structure:
  - `src/api` → API client functions (using `fetch` or `axios`)
  - `src/pages` → route pages
  - `src/components` → shared components (forms, tables, layout)
  - `src/router` or directly use React Router
- Use React Router for navigation.
- Manage auth token in a simple way (e.g., localStorage) plus a React context or simple hook.

### 3.2. Auth flow (shared across roles)

Create pages:

1. `LoginPage`
   - Form with email + password.
   - On success, save JWT token and user info (`role`) to localStorage.
   - Redirect based on role:
     - `admin` → Admin dashboard
     - `doctor` → Doctor dashboard
     - `patient` → Patient dashboard

2. `RegisterPage`
   - For new patients.
   - Calls `POST /auth/register`.
   - After registration, auto-login or redirect to login.

Implement a simple `ProtectedRoute` component that checks for token and role before allowing access to role-specific routes.

### 3.3. Admin UI

Create an `AdminDashboard` with:

- A section to view all departments in a table:
  - list name, description
  - actions: edit, delete
- A form to create a new department
- A section to view all doctors:
  - doctor name, department, title
  - a form to create a new doctor:
    - create doctor user (email, password, full_name, role=doctor)
    - assign department
    - title, bio

Routes example:
- `/admin` → main dashboard
- `/admin/departments`
- `/admin/doctors`

### 3.4. Doctor UI

Create a `DoctorDashboard` with:

- A list of upcoming appointments:
  - show patient name, department, date/time, status, notes
  - allow doctor to change the status to `completed` or `cancelled`
- A section to manage appointment slots:
  - View existing slots for the doctor
  - Create new slots (form with date, start_time, end_time)
  - Delete / disable slots that are in the future and not booked.

Routes example:
- `/doctor` → main dashboard
- `/doctor/slots`
- `/doctor/appointments`

### 3.5. Patient UI

Create a `PatientDashboard` with two main experiences:

1. **Book Appointment Flow**
   - A page where patient can:
     - Choose a department from a dropdown.
     - See list of doctors in that department.
     - Select a doctor.
     - See that doctor’s available slots (in the upcoming days).
     - Click on a slot to book an appointment.
   - Show a confirmation message and redirect to "My Appointments".

2. **My Appointments**
   - A page showing logged-in patient’s appointments:
     - doctor name, department, date/time, status
     - ability to cancel future appointments (calling `PUT /appointments/:id/cancel`)

Routes example:
- `/patient` → dashboard
- `/patient/book` → booking flow
- `/patient/appointments` → list of appointments

### 3.6. UX notes

- Keep styling simple and functional, no need for fancy design.
- Use clear labels such as:
  - “Book Appointment”
  - “Available Slots”
  - “My Appointments”
  - “Upcoming Appointments”
- Show API validation errors and success messages.

---------------------------------------------
4) TESTS – CYPRESS E2E (hospital_frontend/cypress)
---------------------------------------------

Please configure Cypress for E2E tests that run against the real backend and frontend:

- Cypress should run with `video: true` so that I can later use the recorded video as a demo.
- Put tests under `cypress/e2e/`.

Create at least the following high-level E2E test scenarios:

### Scenario 1 – Patient registers and books an appointment

1. Visit the app as a new visitor.
2. Go to "Register" page, create a new patient account.
3. Login with that account.
4. Navigate to "Book Appointment".
5. Select a department.
6. Select a doctor from that department.
7. See the list of available slots.
8. Choose a slot and book it.
9. Assert that a success message appears.
10. Go to "My Appointments" and assert that the new appointment is listed with status `scheduled`.

### Scenario 2 – Prevent double booking of a slot

1. Use seed data or an existing patient.
2. Book a specific available slot for a given doctor.
3. Attempt to book the same slot again (either as the same patient or another patient).
4. Assert that the API rejects the second booking, and UI shows a clear error (e.g., “This slot is already booked.”).

### Scenario 3 – Doctor views their appointments and updates status

1. Login as a doctor (using seeded doctor credentials).
2. Go to "Doctor Dashboard" or "Appointments" page.
3. Assert that appointments booked in Scenario 1 appear in the list.
4. Change one appointment status from `scheduled` to `completed`.
5. Assert that the UI updates correctly and that the backend reflects the change.

### Scenario 4 – Admin manages departments and doctors

1. Login as admin (seeded credentials).
2. Go to "Departments" management page.
3. Create a new department.
4. Verify it appears in department list.
5. Go to "Doctors" management page.
6. Create a new doctor assigned to that department.
7. Verify the doctor appears in doctor list and is available when booking appointments.

All tests should:

- Use realistic selectors (e.g., `data-cy` or `data-testid` attributes on UI elements).
- Be robust and readable.
- Cleanly express the flow in Given/When/Then style comments.

-------------------------------------------
5) PROJECT SCRIPTS & RUN INSTRUCTIONS
-------------------------------------------

In the root README, clearly document:

- How to set up the backend:
  - `cd hospital_api`
  - Install dependencies
  - Set database config
  - `bin/rails db:create db:migrate db:seed`
  - `bin/rails s` to start the API (on port 3000)

- How to set up the frontend:
  - `cd hospital_frontend`
  - Install dependencies (npm or pnpm)
  - Set environment variable for API base URL (e.g., `VITE_API_BASE_URL=http://localhost:3000`)
  - `npm run dev` to start frontend (expected on port 5173)

- How to run Cypress:
  - `cd hospital_frontend`
  - `npx cypress open` for interactive mode
  - `npx cypress run` for headless mode (with video recording enabled, default Cypress behavior)
  - Explain where the videos are stored (e.g., `cypress/videos/`).

--------------------------------
6) QUALITY & CODE ORGANIZATION
--------------------------------

- Use TypeScript types/interfaces for API data in the frontend.
- Keep controllers and services on the backend clean and separated where appropriate.
- Handle errors gracefully both in the API and in the frontend.
- Add comments where needed so a student can understand the flow.
- Make sure the system is runnable end-to-end on a typical local dev environment.
- Ensure that the E2E tests pass against the seeded database and demonstrate a realistic user flow suitable for a demo video.

Now, please generate all necessary code, configuration, and documentation to implement this system exactly as described.

```

## Prerequisites

* Ruby 3.x
* Rails 8.x
* PostgreSQL
* Node.js & npm

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

**Note:** Tests currently use **network mocking** (`cy.intercept`) to simulate backend responses. To test against a real backend, remove the interceptors.

## Automated Narrated Demo Pipeline

This project includes an automated pipeline to create narrated demo videos from Cypress E2E tests.

### Prerequisites for Narrated Demos

* **ffmpeg**: Install from [https://ffmpeg.org/](https://ffmpeg.org/)
* **ElevenLabs API Key**: Set `ELEVENLABS_API_KEY`

### Pipeline Overview

1. Mouse Tracking
2. Log Collection
3. Narration Generation
4. Video Merging

### How It Works

#### 1. Run Cypress Tests with Logging

```bash
cd hospital_frontend
npm run test:e2e
```

Logs stored in `cypress/logs/`.

#### 2. Generate Narration Script

```bash
npm run generate:subtext
```

#### 3. Generate Voice-Over Audio

```bash
export ELEVENLABS_API_KEY=your_api_key_here
npm run generate:voiceover
```

#### 4. Merge Audio with Video

```bash
npm run merge:video
```

Final videos saved to `cypress/narrated_videos/`.

### One-Command Pipeline

```bash
export ELEVENLABS_API_KEY=your_api_key_here
npm run make:narrated-demo
```

### Output Structure

```
cypress/
├── logs/
├── subtext/
├── audio/
├── videos/
└── narrated_videos/
```

### Customization

* Change voice settings in `scripts/generateVoiceover.js`
* Customize narration script in `scripts/generateSubtext.js`
* Adjust merging logic in `scripts/mergeVideoAudio.js`
