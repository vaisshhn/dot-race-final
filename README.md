# CRENOVA — Micro-Creator Discovery & Milestone Escrow Platform (India)

**CRENOVA** is a dedicated B2B discovery and milestone escrow platform designed specifically for the Indian influencer marketing ecosystem. It connects consumer brands and D2C startups with vetted Indian micro-creators (1,000 to 100,000 followers) across high-intent niches and tier-1/tier-2 cities, backed by milestone escrow protection in Indian Rupees (₹ INR).

---

## 🌟 Key Highlights & Features

### 1. 🔍 Micro-Creator Discovery Engine
- **Vetted Regional Creators:** Filter authentic creators across Indian hubs:
  - *Hyderabad*, *Bengaluru*, *Mumbai*, *Delhi NCR*, *Chennai*, *Kolkata*, *Pune*, *Ahmedabad*, *Jaipur*, *Kochi*, *Lucknow*.
- **Low Negative Comment Rate Filter:** Filter out bot-heavy, controversial, or high-toxicity profiles to preserve brand safety.
- **Audience Quality & Engagement:** Real-time engagement rate calculators, reach benchmarks, and multi-lingual delivery flags (Telugu, Hindi, Tamil, Kannada, Marathi, English).
- **Shortlisting & Campaigns:** Save creators into custom campaign shortlists with internal strategy notes.

### 2. 🛡️ Milestone Escrow Review Center
- **INR Escrow Protection:** Brand payments are held safely in milestone escrow until content deliverables (Instagram Reels, YouTube Shorts, X threads) are published and verified.
- **Review & Approval Workflow:** Brands inspect live deliverables, verify reach criteria, and release payouts with zero dispute friction.
- **GST Compliant Invoicing:** Ready-to-file billing details with GSTIN and Indian tax compliance.

### 3. 🔐 Comprehensive Authentication & Security Suite
The platform features an enterprise-grade authentication system tailored for Indian users:

- **🇮🇳 Mobile OTP Authentication (+91 Indian Numbers):**
  - Seamless 6-digit OTP verification with auto-advance and clipboard paste support.
  - **1-Minute Cooldown Timer (01:00 down to 00:00):** Real-time `mm:ss` tabular countdown before OTP resend unlocks.
  - **Dual Resend Channels:** Resend via SMS or instant WhatsApp dispatch when SMS network delay occurs.
  - Demo OTP: `123456` for frictionless testing.

- **🔑 Password Creation & Validation (Sign-Up):**
  - Create account with password setup.
  - **Password Strength Meter:** Evaluates password complexity (Weak, Moderate, Strong) based on length (8+ chars), numbers, and character sets.
  - **Confirm Password Verification:** Real-time visual match indicator ensuring passwords match before submission.

- **🔄 Forgot Password & Reset Password Workflow:**
  - Dedicated **"Forgot / Reset Password?"** recovery interface accessible directly from the login page.
  - **Step 1:** Enter registered email to receive a secure 6-digit verification PIN.
  - **Step 2:** Enter the 6-digit PIN with a **60-second cooldown timer**, enter a new password with the real-time strength meter, and confirm the new password.
  - **Step 3:** Instant success confirmation with one-click return to sign in with new credentials.
  - Demo Recovery PIN: `749102` (with a single-click autofill button for instant testing).

- **⚡ Instant 1-Click Demo Profiles:**
  - **Brand Partner:** Swiggy India (*Karan Sharma*, Gourmet & Dining Campaign).
  - **Micro-Creator:** Ananya Varma (*@ananyabites_hyd*, Instagram 48.2K Followers).

---

## 🏗️ Project Architecture & Directory Structure

```
├── README.md                      # Platform documentation & operational manual
├── index.html                     # HTML5 entry point with OpenGraph & font links
├── metadata.json                  # Applet metadata, capabilities & description
├── package.json                   # Dependencies, build scripts & engine config
├── server.ts                      # Express production backend with Vite middlewares
├── tsconfig.json                  # TypeScript compiler configuration
├── vite.config.ts                 # Vite bundler setup
└── src/
    ├── main.tsx                   # React root entry point
    ├── App.tsx                    # Core application layout, tab routing & state
    ├── index.css                  # Global Tailwind CSS directives & custom fonts
    ├── firebase.ts                # Firebase client initialization
    ├── components/
    │   ├── CrenovaLogo.tsx        # Official Crenova brand logo with emerald mark
    │   ├── LoginPage.tsx          # Full Auth Suite (Mobile OTP, Password, Reset Password)
    │   ├── Navbar.tsx             # Main navigation bar with role switcher & user session
    │   ├── Footer.tsx             # Indian compliance, disclaimer & links
    │   ├── LandingHero.tsx        # Hero banner with city & niche quick-search
    │   ├── FilterSidebar.tsx      # Multi-dimensional creator filters (City, Niche, Budget)
    │   ├── CreatorCard.tsx        # Creator cards displaying engagement, rates, city & badge
    │   ├── CreatorProfileModal.tsx# Deep-dive creator analytics and portfolio preview
    │   ├── EscrowReviewCenter.tsx # Milestone escrow funds management & release approval
    │   ├── ShortlistsView.tsx     # Saved creator shortlist management & campaign notes
    │   ├── EnquiriesListView.tsx  # Brand enquiry tracker & deliverable milestones
    │   ├── BrandDashboardView.tsx # Overall campaign analytics, spent INR, & ROI
    │   └── CreatorOnboardingModal.tsx # Creator registration modal
    ├── data/
    │   └── indianCreators.ts      # Vetted database of Indian micro-creators
    ├── services/
    │   └── database.ts            # Firestore document persistence + offline localStorage fallback
    └── types/
        ├── index.ts               # Core application domain types
        └── database.ts            # UserDocument, BrandProfile, CreatorProfile types
```

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS with custom Indian forest green palette (`#1B4D36`, `#0B2218`, `#FAF9F5`)
- **Icons:** Lucide React
- **Persistence & Cloud:** Firebase Firestore with offline-first LocalStorage mirroring
- **Build System:** Vite 8 + TSX
- **Backend Server:** Node.js Express 4 (`server.ts`)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The application runs on `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```

### 4. Run TypeScript Type Check / Linter
```bash
npm run lint
```

---

## 🛡️ License & Ownership
© Crenova Technologies Private Limited. All rights reserved.
Developed for the Indian creator economy.
