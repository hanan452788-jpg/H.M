# 🐾 PawHome - Pet Adoption Web Application

PawHome is a modern, responsive, full-stack pet adoption web application designed with warm, pet-friendly aesthetics. It connects animal lovers with rescue dogs, cats, and birds looking for their forever homes.

---

## 🌟 Highlights & Features

### 🖥️ Frontend (React + Vite + Tailwind CSS)
1. **Home Page (`/`)**:
   - Hero banner: *"Find Your New Best Friend"* with statistics and quick action buttons.
   - Live Search: Instant search by pet name, breed, location, or species.
   - Filter Tabs: Quickly filter by pet type (🐾 All Pets, 🐕 Dogs, 🐈 Cats, 🦜 Birds).
   - Dropdown Filters: Narrow results by gender (Male/Female) and age group (Baby, Young, Adult).
   - Pet Grid: Responsive cards featuring photo, name, breed, age, location, temperament tags, and quick-action buttons.
   - 3-step adoption journey guide.
2. **Pet Details Page (`/pet/:id`)**:
   - High-resolution pet portrait gallery view.
   - Pet story, personality traits, and adoption fee.
   - Household compatibility checks (Good with kids, dogs, cats).
   - Detailed veterinary, health, and vaccination records.
   - Prominent "Adopt Me" button that pre-selects the pet on the adoption form.
   - Shareable profile link functionality.
3. **Adoption Application Page (`/adopt` & `/adopt/:id`)**:
   - Comprehensive multi-section form (Contact info, living situation & housing type, pet experience, and personal motivation).
   - Pet selector with live preview badge.
   - Form validation with intuitive feedback.
   - Instant confirmation screen with direct link to view status.
4. **Adoption Management / Admin Page (`/admin` & `/requests`)**:
   - Real-time dashboard with metrics: Total Applications, Pending, Approved, and Rejected.
   - Status filtering tabs and search query input.
   - Detailed expandable drawer for each applicant's full household notes and story.
   - One-click status management: Approve, Reject, or set back to Pending.
   - Delete application action.

---

## ⚙️ Backend (Node.js + Express REST API)
- Stored in a lightweight, self-contained JSON datastore (`backend/data/pets.json` and `backend/data/adoptions.json`).
- Seeded with 8 realistic pets across Dogs, Cats, and Birds with real names, breeds, ages, and verified Unsplash photo URLs.
- RESTful Endpoints:
  - `GET /api/pets` - Retrieve all pets (supports `type`, `search`, `gender`, `age` query filters)
  - `GET /api/pets/:id` - Retrieve single pet profile
  - `POST /api/adoptions` - Submit an adoption application
  - `GET /api/adoptions` - Fetch all submitted applications (newest first)
  - `PATCH /api/adoptions/:id/status` - Update application status (`Pending`, `Approved`, `Rejected`)
  - `DELETE /api/adoptions/:id` - Delete application record
  - `GET /api/health` - API health check
- CORS enabled with support for frontend origins and port 5173.

---

## 🚀 How to Run

### 1. Start the Backend (Port 5000)
```bash
cd backend
npm start
```
The backend API will start at **`http://localhost:5000`**.

### 2. Start the Frontend (Port 5173)
In a new terminal window:
```bash
cd frontend
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 📁 Directory Structure
```
H.M/
├── backend/
│   ├── data/
│   │   ├── pets.json            # 8 seeded pets with photos & metadata
│   │   └── adoptions.json       # Initialized adoption applications
│   ├── package.json
│   └── server.js                # Express REST API with CORS & JSON storage
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Brand navigation & mobile menu
│   │   │   ├── Footer.jsx       # Warm footer with links & shelter info
│   │   │   └── PetCard.jsx      # Rounded card with badges & actions
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Hero, filters, search, pet grid
│   │   │   ├── PetDetails.jsx   # Big photo, story, medical records, CTA
│   │   │   ├── AdoptionForm.jsx # Multi-field application with pet preview
│   │   │   └── AdminRequests.jsx# Status metrics & approval dashboard
│   │   ├── App.jsx              # Routes & navigation wrapper
│   │   ├── index.css            # Tailwind directives & warm styling
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js       # Custom warm honey & terracotta palette
│   └── vite.config.js          # Configured on port 5173 with proxy
└── README.md
```

