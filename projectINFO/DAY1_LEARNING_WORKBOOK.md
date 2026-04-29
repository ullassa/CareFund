# CareFund Day 1 Learning Workbook

Date: April 27, 2026
Goal: Understand full request flow from frontend to backend to database.

---

## How to study (best method)

Use both:
1. Chat for explanations and doubts.
2. Notebook file for your own understanding.

Rule:
- Read code.
- Write in your own words.
- Test with API calls.
- Explain it back.

If you only read, you forget.
If you write + run + explain, you remember.

---

## Today checklist (2 to 3 hours)

- [ ] Read backend startup flow in `Program.cs`
- [ ] Understand DB wiring in `Data/ApplicationDbContext.cs`
- [ ] Trace login/OTP flow in `Controllers/AuthController.cs`
- [ ] Trace donation flow in `Controllers/DonationsController.cs`
- [ ] Match one frontend API call to backend endpoint
- [ ] Write 10-line summary in your own words

---

## Step 1: Backend startup map

Open:
- `backend/Program.cs`

Write answers:
1. Which services are registered in DI?
   - 
2. How is authentication configured?
   - 
3. Which middleware runs and in what order?
   - 
4. How are controllers enabled?
   - 

---

## Step 2: Database map

Open:
- `backend/Data/ApplicationDbContext.cs`
- `backend/Models/`

Write answers:
1. What DbSet tables exist?
   - 
2. Which model is linked to donations?
   - 
3. Which model stores OTP?
   - 
4. Which model stores notifications?
   - 

---

## Step 3: Auth deep dive

Open:
- `backend/Controllers/AuthController.cs`
- `backend/Services/Auth/`
- `backend/Services/Otp/`
- `backend/Services/Jwt/`

Trace this flow and fill:
1. Request DTO received:
   - 
2. Validation checks:
   - 
3. OTP generation + storage:
   - 
4. JWT generation:
   - 
5. Final API response:
   - 

---

## Step 4: Donations deep dive

Open:
- `backend/Controllers/DonationsController.cs`
- `backend/Models/Donation.cs`

Trace and fill:
1. Create donation endpoint:
   - 
2. Required fields:
   - 
3. Status updates:
   - 
4. DB write and read:
   - 

---

## Step 5: Frontend to backend connection

Open:
- `frontend/src/app/` (services + components)

Find one API call and fill:
1. Frontend file path:
   - 
2. Method name:
   - 
3. Endpoint URL called:
   - 
4. Backend controller endpoint:
   - 
5. Response shown in UI where:
   - 

---

## End-of-day self test (important)

Answer without seeing code:
1. How OTP login works in this project?
2. How JWT is created and used?
3. How a donation is created and saved?
4. Which files you must open to debug login issue?

If you can answer these, Day 1 is successful.

---

## Daily summary (write in simple words)

Today I learned:
- 
- 
- 

Still confused about:
- 
- 

Tomorrow I will study:
- 

---

## Internship interview practice (2 mins)

Practice saying:
"In CareFund, Angular frontend calls ASP.NET Core Web API controllers. Controllers use services for business logic, Entity Framework Core for database access through ApplicationDbContext, and JWT for secured endpoints. OTP flow is handled through dedicated auth and OTP services."
