# CareFund - First Steps Checklist ✅

## 🚀 You Just Got The Code - Now What?

Follow these steps **in order** to get CareFund running and test the approval workflow.

---

## ✅ Day 1: Setup (30 minutes)

### Step 1: Prepare Your Environment
- [ ] Have Visual Studio Code or similar editor open
- [ ] Have a terminal/command prompt ready
- [ ] Have SQL Server running locally or cloud access
- [ ] Have admin rights to create databases

### Step 2: Configure Backend

**In `backend/appsettings.Development.json`:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=CareFund;Trusted_Connection=true;"
  }
}
```

Change `localhost\\SQLEXPRESS` to your SQL Server instance.

### Step 3: Apply Database Migrations

From `/backend` folder:
```bash
cd backend
dotnet ef database update
```

✅ **You should see**: "Done. Successfully applied migration '...'."

**What happened**: Database created with all tables, including:
- Users
- CharityRegistrationRequest  
- Customer
- Donation
- Notification
- And more...

**Bonus**: Admin user auto-created during this step!

### Step 4: Start Backend
```bash
dotnet run
```

✅ **You should see**: 
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:5292
```

✅ **Leave this running** (don't close terminal)

### Step 5: Start Frontend (New Terminal)

From `/frontend` folder:
```bash
cd frontend
ng serve
```

✅ **You should see**: 
```
✔ Compiled successfully.
✔ Browser application bundle generation complete.
Application bundle generation by Webpack complete. Watch mode started.
```

---

## ✅ Day 1: First Login (15 minutes)

### Step 1: Open Browser
- Navigate to: `http://localhost:4200`
- You'll see CareFund landing page

### Step 2: Login as Admin
**Credentials provided**:
- Email: `admin@carefund.com`
- Password: `Admin@123`

✅ **Click "Login"** → You should auto-redirect to **Admin Dashboard**

### Step 3: Verify Admin Dashboard
**You should see**:
- Header: "Admin Dashboard"
- Statistics section with 6 cards
- "Filter by Status" dropdown
- Empty charity requests list (no requests yet)

✅ **Admin dashboard working!**

### Step 4: Change Admin Password (Security)
⚠️ **Don't skip this!**

In a production system, immediately change the default password:
1. Click profile icon (top-right, if available)
2. Go to "Settings" or "Account"
3. Click "Change Password"
4. Old password: `Admin@123`
5. New password: (something secure like `MySecure@Pass2024`)
6. Save

---

## ✅ Day 2: Register Charity (30 minutes)

### Step 1: Create Test Charity Account
- Click **"Sign Up"** (top navigation or landing)
- Select **"Register as Charity"**
- Fill in form:
  - **Charity Name**: "Test Education Foundation"
  - **Email**: `charity@carefund.test`
  - **Password**: `Test@12345`
  - **Phone**: `9876543210`
  - **Mission**: "Provide education to underprivileged children"
  - **Cause Type**: "Education"
  - **City**: "New Delhi"
  - **Social Media**: (optional, can leave blank)
  - **About**: "We work in rural areas"
  - **Activities**: "Tuition, Books, Uniforms"

- [ ] Click **"Register"**

✅ **Charity registered with Status = "Pending"**

### Step 2: Verify Charity Can't See Public Profile
- You'll be redirect to login
- **DON'T login yet**
- Go to home page
- Click **"Donate"** (without logging in)
- Browse charities list

❌ **You should NOT see** "Test Education Foundation" (not approved yet!)

---

## ✅ Day 2: Admin Approves Charity (15 minutes)

### Step 1: Login as Admin
- Go to `http://localhost:4200/login`
- Email: `admin@carefund.com`
- Password: `Admin@123` (or your new password)
- Click **"Login"**

### Step 2: View Charity Request
**Admin Dashboard should show**:
- "Pending Review" card shows: **1** (instead of 0)
- Scroll down to "Charity Requests" section
- You'll see: "Test Education Foundation" listed

✅ Click on it to expand details

### Step 3: Approve the Charity
- **Optional**: Add a comment like "Verified - Good mission"
- Click **"✓ Approve"** button

✅ **What happens**:
- Status changes to ✅ **Approved**
- Charity gets notification: "Your registration has been approved!"
- "Pending Review" card now shows: **0**

---

## ✅ Day 2: Verify Charity Now Visible (10 minutes)

### Step 1: Logout from Admin
- Click logout (profile menu or button)

### Step 2: Go to Donate Page
- Click **"Donate"** in navigation
- **OR** Go directly: `http://localhost:4200/donate`

### Step 3: See Approved Charity
✅ **You should now see**:
- "Test Education Foundation" in the list!
- Charity info displayed (name, cause, city)

### Step 4: Test Search
- Type "Education" in search box
- Click search / filter
- Charity still appears

✅ **Search working!**

---

## ✅ Day 3: Customer Donation Flow (30 minutes)

### Step 1: Register as Customer
- Click **"Sign Up"** → **"Register as Customer"**
- Fill in:
  - **Name**: "John Donor"
  - **Email**: `customer@carefund.test`
  - **Password**: `Customer@123`
  - **Phone**: `9111111111` (optional)

- [ ] Click **"Register"**

### Step 2: Login as Customer
- Go to login page
- Email: `customer@carefund.test`
- Password: `Customer@123`
- Click **"Login"**

✅ **Auto-redirects to**: Customer Dashboard (empty, no donations yet)

### Step 3: Donate to Charity
- Click **"Donate"** in navigation
- Click on **"Test Education Foundation"**
- Enter amount: **500**
- Select payment method: **UPI** (or any)
- Transaction ref: (auto-generated)
- Click **"Proceed to Donate"**

✅ **What happens**:
- Donation recorded in database
- Payment record created
- Notifications sent:
  - Customer: "Thank you for your donation!"
  - Charity: "Received ₹500 donation"

### Step 4: Verify Donation
- Click **"OK"** or return to dashboard
- **Customer Dashboard** should now show:
  - Under "Donation Summary": 
    - Total Donated: **₹500**
    - Donations Made: **1**
    - Average: **₹500**
  - Under "Recent Donations": Should list your donation

✅ **Donation working!**

---

## ✅ Day 3: Test CSV Download (10 minutes)

### Step 1: On Customer Dashboard
- Scroll to bottom: **"Generate Report"** section
- **From**: Leave as is (or set to today's date)
- **To**: Leave as is (or set to today's date)
- Click **"📥 Download CSV Report"**

✅ **File downloads**: `report.csv`

### Step 2: Open CSV File
- Open with Excel or text editor
- You should see:
  ```
  DonationId,Date,Amount,CharityName
  1,2024-04-16,500,Test Education Foundation
  ```

✅ **Report working!**

### Step 3: Logout & Test Charity Dashboard
- Logout (top-right)
- Login as Charity:
  - Email: `charity@carefund.test`
  - Password: `Test@12345`

✅ **Auto-redirects to**: Charity Dashboard

- Should show:
  - Total Collected: **₹500**
  - Donors: **1**
  - Recent donation listed
  - Option to download report

---

## ✅ Day 3: Test Password Reset (15 minutes)

### Step 1: Logout
- Click logout

### Step 2: Forgot Password Page
- Click **"Forgot Password?"** on login page
- OR go directly: `http://localhost:4200/forgot-password`

### Step 3: Enter Email
- Email: `customer@carefund.test` (the customer we created)
- Click **"Send OTP"**

⏳ **In real system**: OTP would be sent via email/SMS

### Step 4: Use Test OTP
- Check your email inbox (or check backend logs)
- For testing: The OTP is usually printed in backend logs or use `123456` if mocked
- Enter: OTP, New Password, Confirm Password
- Click **"Reset Password"**

✅ **Password reset working!**

---

## ✅ Day 4: Test Admin Rejection (10 minutes)

### Step 1: Register Another Charity
- Signup as another charity with different email
- Same approval process

### Step 2: Login as Admin
- Login as `admin@carefund.com`
- Admin Dashboard → Pending requests

### Step 3: Reject the Request
- Click the new charitable request
- Add comment: "Missing required documentation"
- Click **"✕ Reject"** button

✅ **Charity Status**: Changed to ❌ **Rejected**
✅ **Charity Notification**: "Your registration was rejected"

### Step 4: Verify Rejected Charity Hidden
- Logout
- Go to Donate page
- Rejected charity should NOT appear

---

## ✅ Day 4: Advanced Testing

### Test Notifications
- After any action (approval, donation, etc.)
- Click on **"Notifications"** section in dashboard
- Check messages appear with timestamps

### Test Admin Approval Rate
- Admin Dashboard has "Approval Rate %" card
- Should show math: (Approved / (Approved + Rejected)) * 100

### Test Monthly Breakdown
- Customer Dashboard shows bar chart
- Make multiple donations on different months
- Chart updates to show monthly totals

### Test Filters
- Donate page: Search & filter by cause
- Admin dashboard: Filter by status
- All should work smoothly

---

## ✅ Verification Checklist

### Backend ✅
- [ ] Migrations applied (database created)
- [ ] Admin auto-created
- [ ] `dotnet run` works without errors
- [ ] Swagger docs accessible at `/swagger`

### Frontend ✅
- [ ] `ng serve` works without errors
- [ ] Landing page loads at localhost:4200
- [ ] Can navigate all pages without 404

### Authentication ✅
- [ ] Can login as admin
- [ ] Can register as customer
- [ ] Can register as charity
- [ ] Can reset password

### Approval Workflow ✅
- [ ] New charity registration → Status = Pending
- [ ] Admin can see pending charities
- [ ] Admin can approve charity
- [ ] Approved charity appears in public list
- [ ] Rejecting hides charity from list

### Dashboards ✅  
- [ ] Admin dashboard shows stats
- [ ] Customer dashboard after login
- [ ] Charity dashboard after approval
- [ ] All dashboards responsive on mobile

### Features ✅
- [ ] Donation creation works
- [ ] CSV download works
- [ ] Search/filter works
- [ ] Notifications appear
- [ ] Password reset works

---

## 🆘 If Something Breaks

### "Migration failed"
```bash
# Are migrations applied?
dotnet ef database update
```

### "Backend won't start"
```bash
# Check if port 5292 is in use
# Or check for syntax errors - look at console output
dotnet run
```

### "Frontend won't compile"
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
ng serve
```

### "Can't login"
1. Verify user exists in database (SQL tool)
2. Verify password matches (or reset password)
3. Try admin account: `admin@carefund.com` / `Admin@123`

### "CSS not loading"
- Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
- Clear browser cache
- Check component has `.css` file linked

---

##  📊 Success Metrics

You've successfully set up CareFund when you've completed:

✅ All 4 days of testing  
✅ All features work as described  
✅ No errors in browser console  
✅ No errors in backend logs  
✅ All 3 dashboards load  
✅ Approval workflow functions end-to-end  

---

## 🎉 You're Done!

**Next steps**:
1. Explore the codebase (understand how things work)
2. Read `SETUP_GUIDE.md` for deployment info
3. Read `FEATURES_SUMMARY.md` for all features
4. Check `QUICK_REFERENCE.md` for user guide

**To deploy**:
1. Follow deployment checklist in `SETUP_GUIDE.md`
2. Change admin password
3. Configure production database
4. Set JWT secret key
5. Deploy!

---

## 📞 Debugging Tips

- **Check browser console** (F12 → Console tab) for JavaScript errors
- **Check backend logs** (terminal running `dotnet run`) for API errors
- **Check database** with SQL tool to see if data is being saved
- **Use Swagger UI** (`/swagger` endpoint) to test APIs directly
- **Read error messages carefully** - they usually tell you what's wrong

---

**Version**: 1.0  
**Status**: Ready to Go! 🚀  
**Questions?**: Check the comprehensive guides in project root

Happy coding! 💪
