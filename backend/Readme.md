# CareFund Backend Setup

## 1) Configure database and app settings

- Update `ConnectionStrings:DefaultConnection` in `appsettings.Development.json`.
- Ensure JWT config exists in `appsettings.json` or environment vars:
	- `Jwt:Key`
	- `Jwt:Issuer`
	- `Jwt:Audience`

## 2) Apply EF Core migrations

From `backend` folder:

```bash
dotnet ef database update
```

If you change models and need a new migration:

```bash
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

## 3) Run backend

```bash
dotnet run
```

API base URL is typically `http://localhost:5292/api` in local development.

## 4) Implemented flows

- Separate signup: customer and charity
- Shared login with role-aware redirect support (customer/charity/admin)
- Charity registration is `Pending` by default and visible publicly only after `Approved`
- Admin dashboard APIs for charity request monitoring + approve/reject
- Customer and charity dashboard APIs with CSV report download by date range
- Notifications APIs (`/api/notifications/mine`) and auto notifications for:
	- customer registration
	- charity registration
	- charity approval/rejection
	- donation thank-you
	- charity sufficient-fund alert
- Forgot password + reset password by OTP

## 5) Enum scalability note

Current system uses enums (`UserRole`, `CauseType`, etc.) and works.
For higher scalability, you can move enum-like values to lookup tables (e.g., `Roles`, `Causes`) and reference by foreign keys.

Recommended safe migration path:
- Keep existing enums active (no breaking change)
- Add lookup tables + seed data
- Add nullable FK columns parallel to enums
- Backfill data in migration
- Switch application reads/writes to FK columns
- Remove enum columns in a later release

