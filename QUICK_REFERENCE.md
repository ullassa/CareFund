# CareFund - Quick Reference Guide

## 🔐 Login Credentials

### Admin Account (Auto-created)
```
Email:    admin@carefund.com
Password: Admin@123
```

### Test Accounts (For Testing)
You can create these manually during testing:
- **Test Customer**: customer@test.com / Password@123
- **Test Charity**: charity@test.com / Password@123

⚠️ **Change default admin password immediately in production!**

---

## 🎯 Quick Navigation

### For Customers
1. **Register**: Click "Sign Up" → Select "Customer"
2. **Login**: `http://localhost:4200/login`
3. **Dashboard**: Auto-redirects after login
4. **Donate**: Click "Donate" in navigation
5. **View History**: Dashboard shows all donations
6. **Download Report**: Dashboard → "Generate Report" → Select dates → Download

### For Charity Managers
1. **Register**: Click "Sign Up" → Select "Charity"
2. **Fill Details**: Mission, Cause Type, Location, etc.
3. **Submit**: Registration status = **Pending**
4. **Wait for Approval**: Admin reviews and approves
5. **Dashboard**: Once approved, login to see fundraising dashboard
6. **View Donors**: Recent donations on dashboard
7. **Download Report**: Export donor list as CSV

### For Admins
1. **Login**: `admin@carefund.com` / `Admin@123`
2. **Dashboard**: `http://localhost:4200/dashboard/admin`
3. **View Requests**: Shows all pending charities
4. **Approve/Reject**: Filter by status, click button
5. **Add Comments**: Optional comment before approving/rejecting
6. **Watch KPIs**: See overall platform metrics

---

## 📊 Dashboard Guide

### Admin Dashboard
```
Top-Left: Header with filter option
    ↓
Stats Section (6 cards):
  • Pending Review - charities waiting for approval
  • Approved - active charities
  • Rejected - rejected charities
  • Total Users - customers + charities count
  • Total Donations - ₹ amount
  • Approval Rate - % of approved vs rejected
    ↓
Charity Requests (scrollable list):
  • Blue cards with charity info
  • Status badge (⏳ Pending, ✅ Approved, ❌ Rejected)
  • Click card to expand details
  • Add comment (optional)
  • Click "Approve" or "Reject"
```

### Customer Dashboard
```
Header: "My Donations"
    ↓
Statistics (3 cards):
  • Total Donated - ₹ amount
  • Donations Made - count
  • Average Donation - ₹ per donation
    ↓
Monthly Breakdown (bar chart):
  • Shows donation trends
  • Scrollable if many months
    ↓
Recent Activity (2 columns):
  Left: Recent Donations (10 latest)
  Right: Notifications (message log)
    ↓
Report Download:
  • Select date range
  • Click "Download CSV"
  • Save to computer
```

### Charity Dashboard
```
Header: "Fundraising Dashboard"
    ↓
Status Badge: Shows if Pending/Approved/Rejected
    ↓
Statistics (4 cards):
  • Total Collected - ₹ amount
  • Donors - count of people who donated
  • Average Donation - ₹ per donor
  • This Month - ₹ amount this month
    ↓
Recent Donations (grid of cards):
  • Each card shows: 🎁 + Amount + Date
  • Hover for effect
    ↓
Two-column footer:
  Left: Notifications (timeline)
  Right: Report Download (with date filters)
```

---

## 🔄 Approval Workflow (Step-by-Step)

### Step 1: Charity Registers
```
Person registers as Charity
→ Fills in: Name, Mission, Cause, City, Phone, Links
→ Account created with Status = "Pending"
→ NOT visible to customers yet
→ Charity sees: "Your registration is pending admin approval"
```

### Step 2: Admin Reviews
```
Admin logs in → Dashboard shows "Pending Review: 5"
Admin clicks on pending charity
Reads details:
  - Charity name ✓
  - Mission statement ✓
  - Cause type ✓
  - Location ✓
  - Contact info ✓
  
Admin decides: Approve or Reject
Admin optionally adds comment
Admin clicks button → Done!
```

### Step 3: Status Changes
```
If Approved:
  ✅ Status = "Approved"
  ✅ Charity notified: "Your registration has been approved!"
  ✅ NOW visible in public charity list
  ✅ Customers can donate

If Rejected:
  ❌ Status = "Rejected"
  ❌ Charity notified: "Your registration has been rejected"
  ❌ Admin's comment explains why
  ❌ NOT visible to customers
```

### Step 4: Donation Begins
```
Customer browses charities
  → Sees ONLY approved charities
  → Can search by name
  → Can filter by cause
  → Selects charity
  → Enters amount
  → Donates
  
Charity receives notification: "New donation: ₹500"
Both customer & charity can see transaction in dashboards
```

---

## 💰 How to Donate (Customer)

### Quick Steps:
1. **Login**: Go to `/login`, enter credentials
2. **Navigate**: Click "Donate" or auto-redirect to customer dashboard
3. **Browse**: See list of approved charities
4. **Search** (optional): Type charity name or select cause type
5. **Select**: Click charity you want to support
6. **Amount**: Enter donation amount (e.g., 500)
7. **Method**: Select payment method (UPI/Card/NetBanking)
8. **Confirm**: Click "Donate"
9. **Success**: See confirmation + "Thank You" notification
10. **Track**: Donation appears in dashboard

---

## 📥 Download Reports (CSV)

### Customer Reports:
1. Go to **Customer Dashboard**
2. Scroll to **"Generate Report"** section
3. Select "From" date (e.g., 2024-01-01)
4. Select "To" date (e.g., 2024-12-31)
5. Click **"📥 Download CSV Report"**
6. File downloads: `report.csv`

**CSV Contents**:
```
DonationId,Date,Amount,CharityName
1001,2024-06-15,500,ABC Education Foundation
1002,2024-06-20,1000,XYZ Healthcare Initiative
...
```

### Charity Reports:
1. Go to **Charity Dashboard**
2. Scroll to **"Download Report"** section
3. Select date range
4. Click **"📊 Generate CSV"**
5. File downloads with donor data

**CSV Contents**:
```
DonationId,Date,Amount,CustomerId
5001,2024-06-15,500,cust123
5002,2024-06-18,2000,cust456
...
```

---

## 🔑 Password Reset

### If You Forgot Your Password:

1. **On Login Page**: Click **"Forgot Password?"**
2. **Enter Email**: Type your registered email
3. **Receive OTP**: Check email for 6-digit code
4. **Enter OTP**: Paste the code
5. **New Password**: Create new password (must match confirmation)
6. **Save**: Click "Reset Password"
7. **Login**: Use email + new password

⏱️ **OTP Valid For**: 60 minutes only

---

## 🔍 Search & Filter Charities

### On Donate Page:

**Search by Name** (Top-left):
```
Text input box
Type: "Education"
Results filter in real-time
```

**Filter by Cause Type** (Dropdown):
```
Click dropdown
Select: Education / Healthcare / Environment / etc.
Results filter by category
```

**Use Both Together**:
- Type "Orphan" in search + Select "ChildWelfare" → Shows orphanage charities only
- Works with AND logic

---

## 📱 Responsive Screens

### Mobile (iOS/Android)
- Tap navigation menu (hamburger icon if present)
- Cards stack vertically
- Buttons are touch-sized
- Charts are scrollable horizontally

### Tablet (iPad, etc.)
- Dashboard grid adapts
- 2-column layout possible
- Still mobile-friendly

### Desktop (PC/Mac)
- Full multi-column layout
- Side-by-side statistics
- Best viewing experience

---

## ❌ Common Errors & Solutions

### "Charity not visible after approval"
**Problem**: You approved a charity but it doesn't show in public list
**Solution**: 
- Refresh browser (Ctrl+F5)
- Clear browser cache
- Wait 2-3 seconds for database sync

### "OTP not received"
**Problem**: No email with login code
**Solution**:
- Check spam/junk folder
- Verify email address is correct
- Try again (new OTP expires old one)

### "Donation failed"
**Problem**: Payment didn't process
**Solution**:
- Check amount is valid (min ₹10)
- Verify charity is approved (status check on dashboard)
- Check connection is stable
- Try again

### "Can't login - wrong password"
**Problem**: Password appears correct but login fails
**Solution**:
- Check CAPS LOCK is off
- Verify email is exactly correct (case-insensitive)
- Click "Forgot Password?" to reset
- Try admin account if testing: admin@carefund.com / Admin@123

### "Dashboard not loading"
**Problem**: Dashboard shows loading spinner forever
**Solution**:
- Refresh page (F5)
- Clear browser cache
- Close & reopen browser
- Ensure backend is running (dotnet run)

---

## 📞 Admin Troubleshooting

### Admin user missing
**Problem**: Can't login as admin
**Solution**:
1. Check backend is running
2. Run migrations: `dotnet ef database update`
3. Restart backend: Press Ctrl+C, then run `dotnet run` again
4. Admin should be auto-created on startup

### Charity approval button disabled
**Problem**: Button is greyed out after approval
**Solution**:
- This is correct! Shows charity is already processed
- Status shows ✅ Approved - task is done

### CSV download is empty
**Problem**: Downloaded CSV has no data rows
**Solution**:
- Check donations exist in database
- Verify date range includes actual donations
- Try wider date range (e.g., all of 2024)
- Check a known donation date

---

## 🎨 UI Features Guide

### Status Badges
```
⏳ Pending   (Yellow) - Waiting for approval
✅ Approved (Green)  - Active, can receive donations
❌ Rejected (Red)    - Not approved
```

### KPI Cards
- **Top-left color bar** = Category indicator
- **Large number** = Main metric
- **Small text below** = Description

### Hover Effects
- Cards lift up slightly
- Shadows get more prominent
- Buttons change color
- Smooth 0.3s animation

### Notifications
```
Icon + Message + Date/Time
When something important happens, you get a notification
Check "Notifications" section in dashboard
```

---

## 🚀 Performance Tips

### For Faster Experience:
1. **Close unused tabs** - Other apps slow dashboard
2. **Clear cache monthly** - Settings → Clear browsing data
3. **Use modern browser** - Chrome, Firefox, Edge (not IE)
4. **Stable internet** - Don't on slow WiFi connections
5. **Desktop preferred** - Better than mobile for dashboards

---

## ☎️ Need Help?

### Resources:
- **Full Guide**: See `SETUP_GUIDE.md` in project root
- **Features**: See `FEATURES_SUMMARY.md`
- **Backend API**: Swagger docs at `http://localhost:5292/swagger`
- **Frontend Code**: Check component folders for comments

### Contact:
- Check browser console for errors (F12 → Console tab)
- Check backend logs for API errors (dotnet run output)
- Review database directly with SQL tools if needed

---

## ✨ Pro Tips

### Admin Tips:
- ✅ Use "All" filter to see everything
- ✅ Sort requests by newest first
- ✅ Add descriptive comments for charity managers
- ✅ Check total donations KPI weekly to see platform growth

### Customer Tips:
- ✅ Use filters to find causes you care about
- ✅ Download CSV annually for taxes
- ✅ Check notifications for thank-you messages
- ✅ Share favorite charities with friends

### Charity Tips:
- ✅ Complete all fields in registration for better approval chances
- ✅ Share your dashboard link with volunteers
- ✅ Monitor donations daily on dashboard
- ✅ Use CSV report for fundraising reports

---

**Last Updated**: April 2026
**Status**: Ready for Production ✅

Enjoy using CareFund! 🎉
