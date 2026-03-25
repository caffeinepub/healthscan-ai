# HealthScan-AI

## Current State
New project. Empty Motoko backend actor. No frontend code yet.

## Requested Changes (Diff)

### Add
- User authentication (signup/login with username + password, session management)
- Dashboard with past report cards, quick stats (total reports, avg severity, last scan date), recharts health trend chart, upload CTA
- Prominent doctor disclaimer banner on all pages post-login
- Report upload page: file upload (PDF/JPG/PNG/TXT) and text paste fallback
- Frontend AI analysis engine: keyword extraction, condition detection (Diabetes, Hypertension, Anemia, etc.), severity scoring (Mild/Moderate/Severe), confidence score
- Analysis results page: Detected Conditions card, Severity Level badge card, Confidence Score card, Recommendations (Treatments / Medicines / Surgical), Abnormal Values table
- Download Report button (generates JSON/text summary)
- Floating AI chatbot (rule-based, keyword responses for common medical questions)
- Multi-language support (EN/ES/FR/HI) via language switcher in header
- Past Reports History page: list with date/condition/severity, click to re-view full analysis
- Fully responsive layout: hamburger menu on mobile, bottom nav on mobile
- Motoko backend: user account storage (username, hashed password), report storage per user (text content, analysis results, date), CRUD APIs

### Modify
- Empty Motoko actor → full backend with auth + report storage

### Remove
- Nothing

## Implementation Plan
1. Select `authorization` and `blob-storage` Caffeine components
2. Generate Motoko backend with: user management (signup/login/session), report storage (create/list/get per user), analysis result persistence
3. Build React frontend:
   - Auth context + protected routes
   - Login/Signup page
   - Dashboard (stats, trend chart, report list)
   - Upload & Analyze page (file/text input, frontend analysis engine)
   - Results page (conditions, severity, confidence, recommendations, abnormal values table)
   - History page (past reports list + detail view)
   - Floating chatbot component
   - Language switcher (i18n state with EN/ES/FR/HI)
   - Responsive layout with hamburger + bottom nav
   - Doctor disclaimer banner component
   - Download report functionality
