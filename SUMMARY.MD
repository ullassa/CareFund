# CareFund Project Summary

## Overview
CareFund is a multi-role charitable giving platform with an admin approval workflow, modern dashboards, notifications, and CSV reporting. The solution includes an ASP.NET Core backend (net8.0) and an Angular frontend (Angular CLI 19.2.23).

## Core Capabilities
- Role-based authentication for Customer, CharityManager, and Admin.
- Charity registration with Pending/Approved/Rejected lifecycle and admin review.
- Dashboards for Admin, Customer, and Charity with KPIs, recent activity, and reports.
- Donation flow with payments and automated notifications.
- Charity search and cause filtering on the public listing.
- Password reset using OTP verification.

## Application Structure
- Backend: ASP.NET Core Web API in backend/ with controllers, services, DTOs, and EF Core migrations.
- Frontend: Angular app in frontend/ with routes, components, styles, and assets.
- Documentation: Setup, features, quick reference, and learning guides in root and projectINFO/.

## Key Backend Modules
- Controllers: Auth, Admin, Dashboard, Donations, Notifications, Charities, and more.
- Data: ApplicationDbContext and EF Core migrations.
- Models: Charity, Donation, Payment, User, Notification, OTP, and related entities.
- Services: Auth, JWT, Notifications, OTP.

## Key Frontend Areas
- Role dashboards with KPI cards, charts, and CSV export.
- Donation and charity browsing experiences with search and filters.
- Notification timelines.
- Responsive layouts and gradient themes per dashboard.

## Main API Endpoints
Authentication
- POST /api/auth/register-customer
- POST /api/auth/register-charity
- POST /api/auth/login
- POST /api/auth/forgot-password
- POST /api/auth/reset-password

Admin
- GET /api/admin/dashboard
- GET /api/admin/charity-requests
- PUT /api/admin/charity-requests/{id}/review

Public
- GET /api/charities/public?keyword=...&cause=...

Dashboards and Reports
- GET /api/dashboard/customer
- GET /api/dashboard/customer/report?from=...&to=...
- GET /api/dashboard/charity
- GET /api/dashboard/charity/report?from=...&to=...

Donations and Notifications
- POST /api/donations
- GET /api/notifications/mine

## Default Admin (Dev)
- Email: admin@carefund.com
- Password: Admin@123

## Run Locally (Summary)
1) Configure connection string in backend/appsettings.Development.json.
2) Apply migrations: dotnet ef database update (backend/).
3) Start backend: dotnet run (backend/).
4) Start frontend: npm install; ng serve (frontend/).

## Notes
- Admin account is auto-created after the first migration run.
- Only approved charities appear in public listings.
- CSV exports are available for customer and charity dashboards with date filters.
