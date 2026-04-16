# CareFund Application - Complete Setup Guide

## 🚀 Quick Start - Admin Credentials

**Default Admin User** (auto-created on first startup):
- **Email**: `admin@carefund.com`
- **Password**: `Admin@123`
- **Role**: Admin

⚠️ **Important**: Change this password immediately after first login in production!

---

## 📋 Table of Contents

1. [Database Setup](#database-setup)
2. [Backend Configuration](#backend-configuration)
3. [Running the Application](#running-the-application)
4. [Approval Workflow](#approval-workflow)
5. [Charity Registration Flow](#charity-registration-flow)
6. [Dashboard Overview](#dashboard-overview)
7. [Testing Checklist](#testing-checklist)
8. [Troubleshooting](#troubleshooting)

---

## 🗄️ Database Setup

### Prerequisites
- SQL Server 2016+ (Local or Cloud)
- Visual Studio Code or SQL Server Management Studio

### Step 1: Create Database Connection

Update `appsettings.Development.json` in the `backend` folder:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=CareFund;Trusted_Connection=true;MultipleActiveResultSets=true;"
  }
}
```

**Example for Azure SQL:**
```
Server=tcp:your-server.database.windows.net,1433;Initial Catalog=CareFund;Persist Security Info=False;User ID=admin;Password=YourPassword123!;Encrypt=True;Connection Timeout=30;
```

### Step 2: Apply Migrations

From the `backend` folder, run:

```bash
dotnet ef database update
```

This creates all required tables:
- ✅ Users (authentication & roles)
- ✅ CharityRegistrationRequest (charities pending/approved/rejected)
- ✅ Customers (customer profiles)
- ✅ Donations (donation records)
- ✅ Payments (payment references)
- ✅ Notifications (message audit trail)
- ✅ OTPs (temporary codes for password reset)

---

## ⚙️ Backend Configuration

### JWT Configuration

Add to `appsettings.json`:

```json
{
  "Jwt": {
    "Key": "your-secret-key-must-be-at-least-32-characters-long!",
    "Issuer": "CareFundApp",
    "Audience": "CareFundUsers",
    "ExpiryMinutes": 60
  }
}
```

### OTP/Email Configuration (Optional)

For SMS OTP via Twilio, set environment variables:
```bash
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

For Email OTP, configure SMTP:
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

---

## 🏃 Running the Application

### Backend

From `backend` folder:
```bash
cd backend
dotnet run
```

✅ **API Server**: `http://localhost:5292`
✅ **Swagger Docs**: `http://localhost:5292/swagger`
✅ **Health Check**: `http://localhost:5292/api/health` (if implemented)

### Frontend

From `frontend` folder:
```bash
cd frontend
npm install  # First time only
ng serve
```

✅ **Angular App**: `http://localhost:4200`

---

## 🔄 Approval Workflow

This is the **core feature** of CareFund. Here's how it works:

### Step 1: Charity Registration (Status = Pending)
```
User selects "Register as Charity" → Fills form with:
  - Charity name
  - Mission statement
  - Cause type (Education, Healthcare, etc.)
  - City
  - Phone number
  - Social media links
  - About & Activities
  
→ CharityRegistrationRequest created with Status = "Pending"
→ NOT visible in public charity list yet
→ Notification sent: "Your registration is pending admin approval"
```

### Step 2: Admin Reviews
```
Admin logs in → Admin Dashboard
  → Shows "Pending Review" count (5 pending, 10 approved, 2 rejected)
  → Filters requests by status
  → Clicks on pending charity
  → Reads mission, location, contact info
  → Adds optional comment: "Verified organization, approved"
  → Clicks "Approve" button
```

### Step 3: Charity Gets Approved (Status = Approved)
```
→ CharityRegistrationRequest.Status = "Approved"
→ Charity notification: "✅ Your registration has been approved!"
→ Charity NOW appears in public listing
→ Customers can donate through charity profile
```

### Step 4: Customers See Approved Charities
```
Customer → Donate Page
  → Sees ONLY approved charities in list
  → Can search by name or cause
  → Can make donations
  → Donation recorded → Notification sent to charity
```

---

## 🏢 Charity Registration Flow

### Database Flow:
```
User (signup) → User.UserRole = "CharityManager"
                ↓
            CharityRegistrationRequest created
            - Status = "Pending"
            - SubmittedAt = now
            - NOT IsActive yet
                ↓
            Admin reviewsApproves/Rejects
                ↓
            Status = "Approved" OR "Rejected"
            ReviewedAt = now
            AdminComment = "reason"
```

### Key Endpoints:

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/auth/register-charity` | POST | Register new charity | Public |
| `/api/admin/charity-requests` | GET | List all requests | Admin only |
| `/api/admin/charity-requests/{id}/review` | PUT | Approve/reject | Admin only |
| `/api/charities/public` | GET | Public approved list | Public |
| `/api/dashboard/charity` | GET | Charity stats | CharityManager |

---

## 📊 Dashboard Overview

### 👨‍💼 Admin Dashboard
**Access**: Login as `admin@carefund.com`

**Features**:
- 📈 6 KPI cards:
  - Pending review count
  - Approved charities count
  - Rejected count
  - Total customers
  - Total donations ₹amount
  - Approval ratio %
  
- 📋 Charity requests list:
  - Filter by status (All/Pending/Approved/Rejected)
  - View charity details (name, email, cause, location)
  - Add comment
  - Approve or reject with button
  - Status badges showing current state

**URL**: `http://localhost:4200/dashboard/admin`

### 🛍️ Customer Dashboard
**Access**: Login as customer

**Features**:
- 💰 Statistics:
  - Total donated amount
  - Number of donations made
  - Average donation size
  
- 📊 Charts:
  - Monthly donation breakdown (bar chart)
  
- 🎁 Recent activity:
  - Last 10 donations with amounts and dates
  - Notifications (thank-you messages, alerts)
  
- 📥 Report download:
  - Select date range
  - Download CSV with: DonationId, Date, Amount, CharityName

**URL**: `http://localhost:4200/dashboard/customer`

### 🏆 Charity Dashboard
**Access**: Login as charity (CharityManager)

**Features**:
- 💵 Statistics:
  - Total collected amount
  - Number of donors
  - Average donation per donor
  - This month's collection
  
- 🎁 Recent donations:
  - Last 10 donations with amounts and dates
  - Anonymous/public donor indicator
  
- 📬 Notifications:
  - Registration pending/approved/rejected
  - New donations received
  - Milestone alerts (e.g., ₹100k reached)
  
- 📥 Report download:
  - Select date range
  - Download CSV with: DonationId, Date, Amount, CustomerId

**URL**: `http://localhost:4200/dashboard/charity`

---

## 🧪 Testing Checklist

### Phase 1: User Registration
- [ ] Register as customer (no charity approval needed)
- [ ] Register as charity (should be Pending)
- [ ] Verify customer can login and see customer dashboard
- [ ] Verify charity can login BUT doesn't appear in public list yet

### Phase 2: Admin Approval
- [ ] Login as admin with `admin@carefund.com` / `Admin@123`
- [ ] Admin Dashboard shows 1 pending charity
- [ ] Click on the pending charity request
- [ ] Add comment and click "Approve"
- [ ] Verify status changes to "Approved" in list
- [ ] Verify notification sent to charity: "Your registration has been approved"

### Phase 3: Public Listing
- [ ] Logout from admin
- [ ] Login as customer
- [ ] Go to Donate page
- [ ] Verify approved charity now appears in list
- [ ] Search for charity by name (should find it)
- [ ] Search for charity by cause type (should filter correctly)

### Phase 4: Donation & Notifications
- [ ] Customer selects approved charity
- [ ] Enters donation amount (e.g., ₹500)
- [ ] Selects payment method
- [ ] Completes donation
- [ ] Verify donation appears in customer dashboard
- [ ] Verify "Thank you for your donation" notification sent
- [ ] Verify charity dashboard shows new donation

### Phase 5: Reports
- [ ] Customer downloads CSV report (all donations)
- [ ] Verify CSV has correct columns: DonationId, Date, Amount, CharityName
- [ ] Charity downloads CSV report (all their donations)
- [ ] Verify CSV has correct columns: DonationId, Date, Amount, CustomerId

### Phase 6: Password Reset
- [ ] Click "Forgot Password?"
- [ ] Enter customer email
- [ ] Verify OTP email/SMS received ✅
- [ ] Enter OTP
- [ ] Enter new password (must match confirm)
- [ ] Click reset
- [ ] Verify password changed - login with new password works

### Phase 7: Charity Search & Filters
- [ ] Go to Donate page
- [ ] Search by keyword (e.g., "Education") - should filter charities
- [ ] Filter by cause type dropdown
- [ ] Verify filters work together (keyword AND cause)

---

## 🆘 Troubleshooting

### Issue: "Database not found" error
**Solution**:
1. Verify connection string in `appsettings.Development.json`
2. Ensure SQL Server is running
3. Run `dotnet ef database update` to create database

### Issue: Admin user not created
**Solution**:
1. Check migrations were applied: `dotnet ef database update`
2. Check application startup logs for errors
3. Manually insert admin:
```sql
INSERT INTO Users (UserName, Email, PasswordHash, UserRole, IsActive, CreatedAt)
VALUES ('Admin', 'admin@carefund.com', 'BCrypt_HASH_HERE', 2, 1, GETUTCDATE());
```

### Issue: Charity not appearing in public list after approval
**Solution**:
1. Check charity status in database: `SELECT Status FROM CharityRegistrationRequest WHERE Id = ?`
2. Verify status is exactly "Approved" (case-sensitive in code)
3. Refresh browser page (clear cache)

### Issue: CSVdownload returns empty or malformed data
**Solution**:
1. Verify donations exist in database
2. Check date range filter is correct
3. Verify CSV escaping for special characters (commas in charity names)

### Issue: OTP not received
**Solution**:
1. Check SMTP/Twilio credentials in environment variables
2. Verify recipient email is correct
3. Check spam folder
4. For testing, use temporary credentials: `123456`

### Issue: Login always fails
**Solution**:
1. Verify user exists in Users table
2. Check password hash is correct
3. Verify user IsActive = true
4. Check JWT configuration in appsettings.json

---

## 📞 API Documentation

Once backend is running, visit **Swagger UI**:
```
http://localhost:5292/swagger
```

This provides interactive documentation for all endpoints with:
- Request/response schemas
- Try-it-out functionality
- Auth token input
- Error codes and messages

### Key Endpoints Summary:

**Authentication**:
- `POST /api/auth/register-customer` - Customer signup
- `POST /api/auth/register-charity` - Charity signup
- `POST /api/auth/login` - Login (returns JWT token)
- `POST /api/auth/forgot-password` - Send OTP
- `POST /api/auth/reset-password` - Verify OTP & reset

**Admin**:
- `GET /api/admin/dashboard` - KPI stats
- `GET /api/admin/charity-requests` - List charity requests
- `PUT /api/admin/charity-requests/{id}/review` - Approve/reject

**Public**:
- `GET /api/charities/public` - Get approved charities (searchable)

**Charities**:
- `GET /api/dashboard/charity` - Charity stats & recent donations
- `GET /api/dashboard/charity/report` - Download CSV report

**Customers**:
- `GET /api/dashboard/customer` - Customer stats & recent donations
- `GET /api/dashboard/customer/report` - Download CSV report

**Donations**:
- `POST /api/donations` - Create new donation
- `GET /api/notifications/mine` - User notifications

---

## 🔐 Security Notes

1. **Change default admin password immediately** after first login
2. **Use HTTPS in production** (not just HTTP)
3. **Regenerate JWT Key** - don't use the example key
4. **Store secrets in environment variables**, not in code/config files
5. **Use strong passwords** for database and admin users
6. **Implement rate limiting** for login/OTP endpoints
7. **Enable CORS only for your frontend domain** in production

---

## ✅ You're Ready!

You now have:
- ✅ Database configured with all tables
- ✅ Admin user auto-created (`admin@carefund.com`)
- ✅ Approval workflow implemented
- ✅ Beautiful responsive dashboards
- ✅ CSV report exports
- ✅ Notifications system
- ✅ Password reset flow
- ✅ Complete role-based access control

**Next Steps**:
1. Run migrations: `dotnet ef database update`
2. Start backend: `dotnet run` (from backend folder)
3. Start frontend: `ng serve` (from frontend folder)
4. Test with the checklist above
5. Deploy to production!

---

**Questions?** Check the backend README.md or API Swagger docs.

**Version**: 1.0 | **Last Updated**: April 2026
