# The Cut Lab — Product Requirements Document

**Version:** 1.0
**Date:** 2023-10-27
**Status:** Draft

---

## 0. Project Overview

### Product

**Name:** The Cut Lab
**Type:** Web Application (Responsive Mobile-First for Clients, Desktop-Optimized for Admin)
**Deadline:** Q1 2024
**Status:** Draft

### Description

The Cut Lab is a comprehensive barbershop management platform designed to transition a high-traffic Detroit barbershop from manual pen-and-paper operations to a streamlined digital ecosystem. The platform handles end-to-end shop operations including online appointment scheduling, a real-time digital walk-in queue, automated client relationship management (CRM), and automated commission calculations for a team of four barbers.

### Goals

1. **Eliminate Manual Errors:** Replace pen-and-paper scheduling to prevent double-bookings and lost appointments.
2. **Optimize Shop Flow:** Balance scheduled appointments with walk-in traffic through a unified digital queue.
3. **Reduce No-Shows:** Implement automated SMS reminders to ensure high attendance rates.
4. **Automate Financials:** Remove manual math from the end-of-day process by automatically tracking barber commissions and shop revenue.

### Target Audience

| Audience | Description |
|----------|-------------|
| **Primary** | **Clients:** Local residents in Detroit seeking professional grooming services who value convenience and time-saving features. |
| **Secondary** | **Barbers:** Professional staff at The Cut Lab who need to manage their daily schedules and track earnings. |
| **Tertiary** | **Shop Owner/Admin:** Management focused on shop performance, staff oversight, and financial reporting. |

### User Types

| Type | DB Value | Description | Key Actions |
|------|----------|-------------|-------------|
| **Client** | `0` | Public users booking services | Book appointments, join walk-in queue, view history |
| **Barber** | `1` | Service providers (4 staff members) | Manage personal schedule, view commissions, check-in clients |
| **Admin** | `99` | Shop Owner / Manager | Manage shop settings, staff, services, and full financial reports |

### User Status

| Status | DB Value | Behavior |
|--------|----------|----------|
| **Active** | `0` | Full access to relevant features. |
| **Suspended** | `1` | Cannot log in or book. Shown: "Please contact the shop regarding your account status." |
| **Withdrawn** | `2` | Account deactivated. Data retained for 3 years for tax/financial audit purposes then anonymized. |

### MVP Scope

**Included:**
- Online booking engine with barber-specific availability.
- Digital walk-in queue with SMS "Ready" notifications.
- Client CRM with service history and contact notes.
- Automated SMS reminders (24hr and 2hr prior).
- Commission tracking (Percentage-based) per barber.
- Admin dashboard for shop performance.

**Excluded (deferred):**
- In-app payment processing (Stripe integration).
- Inventory management for retail products.
- Multi-location support.
- Mobile Native App (iOS/Android) — initial launch is Web-only.

---

## 1. Terminology

### Core Concepts

| Term | Definition |
|------|------------|
| **The Cut Lab** | The brand and platform name. |
| **Walk-in Queue** | A digital waitlist for clients without appointments, providing estimated wait times. |
| **Commission Rate** | The percentage of a service price that is paid to the barber (e.g., 60/40 split). |
| **Service Block** | The duration of time (e.g., 30m, 45m) allocated to a specific haircut or treatment. |

### User Roles

| Role | Description |
|------|-------------|
| **Guest** | Unauthenticated user who can view services and barbers but must register/login to book. |
| **Client** | Authenticated user with a profile and booking history. |
| **Barber** | Staff member with access to their specific calendar and commission data. |
| **Admin** | Full system access including financial data for all barbers and shop settings. |

### Status Values

| Enum | Values | Description |
|------|--------|-------------|
| **AppointmentStatus** | `PENDING`, `CONFIRMED`, `COMPLETED`, `NOSHOW`, `CANCELLED` | Tracks the lifecycle of a booking. |
| **QueueStatus** | `WAITING`, `IN_CHAIR`, `FINISHED`, `ABANDONED` | Tracks the status of a walk-in client. |
| **PaymentStatus** | `UNPAID`, `PAID` | Indicates if the commission-eligible transaction is settled. |

---

## 2. System Modules

### Module 1 — Booking & Scheduling

Manages the core calendar logic, ensuring barbers are only booked during their working hours and preventing overlaps.

#### Main Features

1. **Dynamic Availability** — Real-time calculation of open slots based on barber schedules and existing appointments.
2. **Service Selection** — Multi-service booking (e.g., Haircut + Beard Trim) with additive durations.
3. **Buffer Management** — Automatic 5-10 minute buffers between appointments for cleaning.

#### Technical Flow

##### Appointment Booking Flow

1. User selects a service and a preferred barber (or "Any Barber").
2. App queries the backend for available time slots for the selected date.
3. User selects a slot and confirms contact details.
4. Backend creates an `Appointment` record with status `CONFIRMED`.
5. On success:
   - SMS confirmation sent to Client.
   - Push/Email notification sent to Barber.
   - Calendar UI updates globally.
6. On failure:
   - Error: "Slot no longer available" → Refresh slots.

---

### Module 2 — Walk-in Queue Management

A digital alternative to "sitting and waiting," allowing clients to join a list and receive a text when it's their turn.

#### Main Features

1. **Estimated Wait Time (EWT)** — Calculated based on the number of people in queue and average service time.
2. **SMS "Ready" Trigger** — Barber clicks a button to alert the next client.
3. **Public Display Mode** — A simplified view for a shop-mounted tablet/TV showing the current queue.

#### Technical Flow

1. Client scans QR code in-shop or visits the "Walk-in" URL.
2. Client enters Name and Phone Number.
3. Backend checks if the client is already in the queue or has a conflicting appointment.
4. On success: Client added to `Queue` with status `WAITING`.
5. Barber marks client as `IN_CHAIR` → SMS sent to the *next* person in line: "You're up next! Please head to the shop."

---

### Module 3 — Commission & Financials

Replaces manual ledger tracking with automated calculation of earnings based on completed services.

#### Main Features

1. **Tiered Commission** — Ability to set different percentages per barber (e.g., Senior vs. Junior).
2. **Daily/Weekly Summaries** — Instant view of "Total Sales" vs "Barber Cut" vs "Shop Cut".
3. **Manual Adjustment** — Admin can add tips or deductions (e.g., booth rent).

#### Technical Flow

1. Barber marks an Appointment or Walk-in as `COMPLETED`.
2. System triggers `CalculateCommission` logic.
3. System fetches `Barber.commission_rate` and `Service.price`.
4. A `Transaction` record is created linking the Barber, Client, and Service.
5. Barber Dashboard updates in real-time to show updated "Daily Earnings."

---

## 3. User Application

### 3.1 Page Architecture

**Stack:** React (Vite), React Router, Tailwind CSS, React Query.

#### Route Groups

| Group | Access |
|-------|--------|
| Public | Anyone (Landing, Service Menu, Queue Status) |
| Auth | Unauthenticated (Login, Signup) |
| Protected (Client) | Logged-in Clients |
| Protected (Staff) | Barbers & Admins |

#### Page Map

**Public**
| Route | Page |
|-------|------|
| `/` | Home / Shop Info |
| `/services` | Service Menu & Pricing |
| `/queue/public` | Live Waitlist View (TV Display) |

**Auth**
| Route | Page |
|-------|------|
| `/login` | Login |
| `/register` | Client Registration |

**Protected (Client)**
| Route | Page |
|-------|------|
| `/book` | Booking Wizard (Step-by-step) |
| `/my-appointments` | Upcoming & Past Cuts |
| `/profile` | Contact Info & Preferences |

**Protected (Staff/Barber)**
| Route | Page |
|-------|------|
| `/staff/dashboard` | Daily Schedule & Queue Management |
| `/staff/earnings` | Personal Commission Reports |
| `/staff/clients` | CRM - Client Search & Notes |

---

### 3.2 Feature List by Page

#### `/book` — Booking Wizard

- **Barber Selection:** View profiles of the 4 barbers with photos and specialties.
- **Service Selection:** Toggle between Haircuts, Beard, Shaves, and Combos.
- **Date/Time Picker:** Calendar view with blocked-out dates and greyed-out unavailable times.
- **Confirmation:** Summary of service, price, and time before final submission.

#### `/staff/dashboard` — Barber Command Center

- **Schedule View:** Vertical timeline of the day's appointments.
- **Queue Toggle:** View the list of walk-ins assigned to them or the general pool.
- **Action Buttons:** "Check-in", "No-Show", "Complete Service".
- **Client Notes:** Quick-view of "Last cut: Mid-fade, #2 on top."

#### `/staff/clients` — Client CRM

- **Search:** Find clients by name or phone number.
- **Profile Detail:** View total visits, total spend, and preferred barber.
- **Service History:** List of all past dates and services provided.
- **Technical Notes:** Internal-only notes for barbers to remember specific client requests.

---

## 4. Admin Dashboard

### 4.1 Page Architecture

**Access:** Admin role only

| Route | Page |
|-------|------|
| `/admin` | Shop Overview (KPIs) |
| `/admin/barbers` | Staff Management |
| `/admin/services` | Service & Price Management |
| `/admin/reports` | Financial & Commission Exports |
| `/admin/settings` | Shop Hours & SMS Config |

---

### 4.2 Feature List by Page

#### `/admin` — Shop Overview

- **Real-time Stats:** Total revenue today, active walk-ins, remaining appointments.
- **Barber Utilization:** Chart showing which barbers are most booked vs. idle.
- **Recent Activity:** Log of new bookings and cancellations.

#### `/admin/barbers` — Staff Management

- **Profile CRUD:** Add/Edit barber info, photos, and bio.
- **Schedule Override:** Set specific days off, vacations, or shift changes.
- **Commission Settings:** Set the % split for each individual barber.

#### `/admin/services` — Service Management

- **Service CRUD:** Name, Description, Price, and Duration (in 15m increments).
- **Category Management:** Group services (e.g., "Standard", "Premium", "Add-ons").

#### `/admin/reports` — Financials

- **Date Range Filter:** View data by day, week, month, or custom range.
- **Commission Breakdown:** Table showing: `Barber Name | Total Sales | Commission % | Payout Amount`.
- **Export:** Download CSV for payroll processing.

---

## 5. Tech Stack

### Architecture

The system follows a modern monolithic-repo structure with a clear separation between the API and the UI.

```
the-cut-lab/
├── backend/    ← NestJS API (Node.js)
├── frontend/   ← React (Client & Barber UI)
└── shared/     ← TypeScript types and constants
```

### Technologies

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Backend | NestJS | 10.x | Scalable API architecture |
| Language | TypeScript | 5.x | Type safety across stack |
| ORM | TypeORM | 0.3.x | Database mapping and migrations |
| Database | PostgreSQL | 15.x | Relational data for financial accuracy |
| Frontend | React | 18.x | User interface |
| Styling | Tailwind CSS | 3.x | Responsive, utility-first design |
| State | TanStack Query | 5.x | Server state management |
| SMS | Twilio | — | Transactional SMS notifications |

### Third-Party Integrations

| Service | Purpose |
|---------|---------|
| **Twilio** | Sending appointment reminders and walk-in "Ready" alerts. |
| **Cloudinary** | Hosting barber profile photos and shop gallery images. |
| **Google Calendar API** | (Optional) Syncing barber schedules to their personal phones. |

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| **PostgreSQL** | Essential for financial data (commissions) where ACID compliance and relational integrity are non-negotiable. |
| **NestJS** | Provides a structured framework that makes it easy to implement complex business logic like the booking engine. |
| **SMS over Email** | Barbershop clients are mobile-first; SMS has a 98% open rate compared to <20% for email. |

---

## 6. Open Questions

| # | Question | Context / Impact | Owner | Status |
|:-:|----------|-----------------|-------|--------|
| 1 | **Deposit Policy?** | Do we want to require a credit card hold or deposit to prevent no-shows? This requires Stripe integration. | Client | ⏳ Open |
| 2 | **Commission on Tips?** | Are tips handled through the app or cash-only? Does the shop take a cut of digital tips? | Client | ⏳ Open |
| 3 | **Walk-in Priority?** | If an appointment is 5 mins late, does a walk-in get the slot? We need to define the "grace period" logic. | Client | ⏳ Open |
| 4 | **Existing Data?** | Is there a digital list of clients to import, or are we starting the CRM from scratch? | Client | ⏳ Open |
| 5 | **Hardware?** | Will there be a dedicated tablet at the front for walk-ins, or do they use their own phones via QR? | Client | ⏳ Open |