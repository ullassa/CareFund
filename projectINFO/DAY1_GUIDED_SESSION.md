# Day 1 (Easy Start) - CareFund

Date: April 27, 2026  
Goal: Understand only 2 things today: app startup + database tables.

---

## 1) Today plan (60 minutes only)

### Today overview (first read this)

Today is only for foundation.  
You are not trying to learn full project today.

By end of today, you should be able to say:
- how backend starts,
- how security pipeline works at high level,
- which main database tables exist,
- how donation-related tables connect.

### Next: 20 min each (what exactly to do)

- 20 min: `backend/Program.cs`
	- Read top to bottom once.
	- Mark these keywords: Services, CORS, JWT, Middleware.
	- Understand only flow, not every line.

- 20 min: `backend/Data/ApplicationDbContext.cs`
	- Find all `DbSet<>` lines (these are tables).
	- Find relationship lines (`HasOne`, `HasMany`, `WithOne`, `WithMany`).
	- Focus on Users, Customers, Charities, Donations, Payments.

- 20 min: Write short notes in your own words
	- Write 3 lines for `Program.cs`.
	- Write 3 lines for `ApplicationDbContext.cs`.
	- Write 1 line: "What I still don’t understand".

Do not study all controllers today.

---

## 2) File 1: Program.cs (very simple)

### What to find
- Which services are registered?
- Is JWT enabled?
- Is CORS enabled for Angular?
- What is middleware order?

### Quick expected answers
- Services: Jwt, Otp, Auth, NotificationEmail
- JWT: yes (`AddAuthentication().AddJwtBearer(...)`)
- CORS: yes (`AllowAngular` for localhost:4200)
- Middleware order: Swagger -> StaticFiles -> CORS -> Authentication -> Authorization -> Controllers

### Write your note (fill)
1. Program.cs is responsible for: ________
2. If JWT key is missing, app will: ________
3. If CORS is wrong, frontend issue will be: ________

---

## 3) File 2: ApplicationDbContext.cs (very simple)

### What to find
- Which tables exist (DbSet)?
- Which important relationships exist?

### Most important tables today
- Users
- Charities
- Customers
- Donations
- Payments
- OTPs
- Notifications

### Easy relationship memory
- One user -> one customer profile
- One customer -> many donations
- One charity -> many donations
- One donation -> one payment

### Write your note (fill)
1. The main donation tables are: ________
2. Donation is linked to payment by: ________
3. FavoriteCharity has unique index to prevent: ________

---

## 4) Real understanding (simple language)

Use this mental model:

- `Program.cs` = the building gate + security + staff assignment.
  - It decides: who can enter (CORS), how identity is checked (JWT auth), and which team handles requests (controllers/services).
- `ApplicationDbContext.cs` = the database map.
  - It decides: which tables exist and how they connect.

If you remember only one thing from Day 1:
- `Program.cs` controls app startup and request pipeline.
- `ApplicationDbContext.cs` controls data structure and relationships.

### Why middleware order matters (easy)

- `Authentication` should run before `Authorization`.
- Reason: app must know "who user is" before checking "what user can do".

### Why CORS matters here

- Frontend runs on `localhost:4200`, backend on another port.
- Browser blocks cross-origin calls unless backend allows it.
- So CORS policy is required for Angular to call API.

### Why unique index in FavoriteCharity

- Without unique index, same user can add same charity many times.
- Unique `(CustomerId, CharityRegistrationId)` prevents duplicate favorites.

---

## 5) Model answers (check your understanding)

Use only after you try yourself.

1. Program.cs is responsible for:  
	App startup, service registration, middleware pipeline, auth setup, DB initialization.

2. If JWT key is missing, app will:  
	Fail at startup with invalid configuration error.

3. If CORS is wrong, frontend issue will be:  
	Browser CORS error and API calls blocked from Angular app.

4. The main donation tables are:  
	`Donations`, `Payments`, `Customers`, `Charities`, `Users`.

5. Donation is linked to payment by:  
	`PaymentId` foreign key (1:1 relation).

---

## 6) Mini quiz (5 questions)

1. Which file wires dependency injection?  
2. Which file contains DbSet tables?  
3. Which middleware checks token validity?  
4. Which middleware enforces role/permission rules?  
5. Why is CORS required in this project?

---

## 7) End of Day 1 output (keep short)

Write only 6 lines:
- 2 lines: What I understood
- 2 lines: What confused me
- 2 lines: What I will read tomorrow (AuthController)

If you finish this, Day 1 is successful.
