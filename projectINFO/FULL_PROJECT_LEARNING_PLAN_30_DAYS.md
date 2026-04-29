# CareFund Full Project Learning Plan (30 Days)

Date: April 27, 2026  
Purpose: Learn the complete project deeply and build internship-level explanation skills.

---

## 1) Project Snapshot (What this system is)

CareFund is a full-stack donation platform:
- Frontend: Angular (`frontend/src/app`)
- Backend: ASP.NET Core Web API (`backend`)
- Database: SQL Server via Entity Framework Core (`ApplicationDbContext`)
- Security: JWT-based auth + role-based authorization + OTP verification

Core roles in system:
- Customer
- CharityManager
- Admin

---

## 2) Real Request Flow (end-to-end)

### A) Login flow
1. Angular calls `POST /api/auth/login` from `ApiService.login()`.
2. `AuthController.Login` validates user via `IAuthService`.
3. `IJwtService.GenerateToken(user)` creates JWT.
4. Frontend stores token and routes by role.
5. `authInterceptor` attaches `Authorization: Bearer <token>` on next API calls.

### B) Donation flow
1. Angular calls `POST /api/donations` from `ApiService.createDonation()`.
2. `DonationsController.CreateDonation` checks authenticated `Customer` role.
3. Creates `Payment`, then `Donation` in DB.
4. Sends donor + charity notifications.
5. Returns donation success with reference.

### C) Database flow
1. Controllers use `ApplicationDbContext`.
2. DbSets map to tables: Users, Charities, Customers, Donations, Payments, OTPs, Notifications, Feedbacks, FavoriteCharities.
3. Relationships are defined in `OnModelCreating`.

---

## 3) Architecture Map (Files you must know)

### Backend entry & setup
- `backend/Program.cs`
  - DI registrations (`IAuthService`, `IJwtService`, `IOtpService`, `INotificationEmailService`)
  - Swagger + Bearer config
  - CORS for Angular localhost
  - JWT validation config
  - DB migration/bootstrap + admin seeding

### Backend data layer
- `backend/Data/ApplicationDbContext.cs`
  - DbSet declarations
  - Entity relationships and precision rules
  - Unique index on favorite charities

### Backend feature layer (high-priority)
- `backend/Controllers/AuthController.cs`
- `backend/Controllers/DonationsController.cs`
- `backend/Controllers/DashboardController.cs`
- `backend/Controllers/AdminController.cs`
- `backend/Controllers/CharitiesController.cs`
- `backend/Controllers/NotificationsController.cs`
- `backend/Controllers/ProfileController.cs`

### Backend service layer
- `backend/Services/Auth/`
- `backend/Services/Jwt/`
- `backend/Services/Otp/`
- `backend/Services/Notifications/`

### Frontend integration layer
- `frontend/src/app/services/api.service.ts`
- `frontend/src/app/auth.interceptor.ts`
- `frontend/src/app/auth.guard.ts`
- `frontend/src/app/app.routes.ts`

---

## 4) 30-Day Learning Schedule

## Week 1: Foundation + Core flow
Day 1:
- Understand `Program.cs` and middleware order.
- Understand `ApplicationDbContext` tables and relations.

Day 2:
- Study Auth login endpoint + JWT creation.
- Trace login request from UI to backend.

Day 3:
- Study OTP flows (send/verify phone and email).
- Trace registration prerequisites.

Day 4:
- Study customer registration + charity registration.
- Note validation logic and pending approval behavior.

Day 5:
- Study `auth.interceptor`, `auth.guard`, `roleGuard`.
- Explain route protection in your own words.

Day 6:
- Study public charity listing and detail API.
- Test keyword/cause filtering.

Day 7:
- Revision + write your own architecture summary.

## Week 2: Donation + Dashboard domain
Day 8:
- Study donation creation endpoint deeply.
- Understand payment + notification sequence.

Day 9:
- Study donation receipt generation endpoint.

Day 10:
- Study customer dashboard backend and frontend bindings.

Day 11:
- Study charity dashboard backend and frontend bindings.

Day 12:
- Study report export endpoints (CSV/PDF).

Day 13:
- Study notifications (`/notifications/mine`) flow.

Day 14:
- Revision + explain full donation lifecycle in 5 minutes.

## Week 3: Admin + quality + data confidence
Day 15:
- Study admin dashboard stats APIs.

Day 16:
- Study charity request review workflow (approve/reject/hold).

Day 17:
- Study favorites feature and uniqueness constraints.

Day 18:
- Study feedback APIs and data model.

Day 19:
- Read migrations and understand schema evolution.

Day 20:
- Practice debugging 2 scenarios (login fail, donation fail).

Day 21:
- Revision + write API cheat sheet.

## Week 4: Build + present like intern engineer
Day 22-24:
- Add one small enhancement (example: dashboard filter UX improvement or extra validation).

Day 25-26:
- Test end-to-end for 3 roles.

Day 27:
- Prepare technical walkthrough note.

Day 28:
- Prepare concise project summary for interview and resume.

Day 29:
- Mock interview self-recording (5-7 minutes).

Day 30:
- Final recap document: architecture, challenges, learnings, next version ideas.

---

## 5) Daily Note Template (copy this every day)

## Day X Notes

### What I studied
- 

### Endpoints I understood
- 

### DB entities touched
- 

### Code files explored
- 

### What confused me
- 

### What I clarified
- 

### 60-second explanation (my words)
- 

### Tomorrow plan
- 

---

## 6) Weekly Skill Check (self-evaluation)

Rate 1 to 5 each:
- I can explain JWT flow here.
- I can trace one request end-to-end quickly.
- I can find where business rule is implemented.
- I can debug API error from frontend symptom.
- I can explain project architecture to interviewer.

If any score <= 2, revisit that module before moving ahead.

---

## 7) Interview-Ready Project Pitch (short)

"CareFund is an Angular + ASP.NET Core donation platform with role-based access for customers, charities, and admins. The backend uses Entity Framework Core with SQL Server, JWT authentication, and OTP verification. I worked on understanding and tracing complete flows such as login, charity approval, donation creation, notifications, and dashboard analytics, and I can debug each flow across frontend, API, and database layers."

---

## 8) Practical Rules to Learn Faster

- Read less, trace more.
- Write notes in your own language daily.
- Test every endpoint you study.
- Explain every feature in 60 seconds.
- If you cannot explain simply, study that section again.
