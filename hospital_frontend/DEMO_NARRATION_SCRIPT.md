# Hospital Appointment System - Demo Narration Script

## Scenario 1: Patient Registration and Appointment Booking

**Duration**: ~60 seconds
**Target**: Professional narration for demo video

---

### Opening (0:00 - 0:05)

> "Welcome to the Hospital Appointment System demonstration. In this walkthrough, we'll see how a new patient registers, logs in, and books their first medical appointment."

---

### Registration Phase (0:05 - 0:20)

> "Our journey begins at the registration page. The system presents a clean, user-friendly form where the patient enters their personal information. We see fields for full name, email address, password, date of birth, gender, and phone number. Each field is clearly labeled with helpful placeholders."

> "Notice how the form validates the input in real-time. The interface is responsive and provides immediate feedback to ensure data accuracy."

> "Once all required information is entered, the user clicks the Register button. The system processes the registration and creates a new patient account in the database."

---

### Login Process (0:20 - 0:30)

> "After successful registration, the system redirects the user to the login page. Here, the patient enters their newly created credentials - the email address and password they just registered with."

> "Upon clicking the Login button, the system authenticates the user against the backend API. The authentication is secure, using JWT tokens for session management."

> "Once authenticated, the patient is welcomed to their personalized dashboard, where they can access all the available features of the appointment system."

---

### Appointment Booking Flow (0:30 - 0:50)

> "The patient's main goal is to book a medical appointment. They click on the 'Book Appointment' button, which opens the booking interface."

> "First, the system asks the patient to select a medical department. In this demonstration, we have departments like Cardiology and Dermatology. The patient chooses the department that matches their medical needs."

> "Once a department is selected, the system fetches and displays all available doctors within that department. Each doctor is shown with their title, name, and specialization."

> "After selecting a preferred doctor, the system retrieves the doctor's available time slots. These slots are displayed in an easy-to-browse grid format, showing dates and times that are currently open for appointments."

> "The patient reviews the available slots and clicks on their preferred time. Behind the scenes, the application sends a POST request to the appointments API endpoint, creating a new appointment record with a status of 'scheduled'."

---

### Confirmation (0:50 - 1:00)

> "The system confirms the booking and redirects the patient to their appointments page. Here, they can see all their scheduled, completed, and cancelled appointments."

> "The newly booked appointment is displayed with complete details: the doctor's name, department, appointment date and time, and current status."

> "This demonstrates a seamless, end-to-end user experience - from creating an account to successfully booking a medical appointment - all within a modern, intuitive web application."

> "Thank you for watching this demonstration of the Hospital Appointment System."

---

## Technical Notes for Voice-Over

- **Tone**: Professional, friendly, clear
- **Pace**: Moderate (not too fast, allows viewer to follow along)
- **Emphasis**: Highlight key actions (click, select, book, confirm)
- **Pauses**: Short pauses after each major step

## Key Features Highlighted

1. ✅ User-friendly registration process
2. ✅ Secure authentication
3. ✅ Department-based doctor search
4. ✅ Available time slot viewing
5. ✅ One-click appointment booking
6. ✅ Appointment management dashboard

---

**For ElevenLabs TTS:**
- Recommended voice: Rachel, Adam, or Antoni
- Stability: 0.5
- Similarity: 0.5
- Model: eleven_monolingual_v1

**Alternative**: Read this script yourself and record the narration manually for a more personal touch.
