# Analytics Implementation - Testing Checklist

Complete this checklist to verify all components are working correctly.

---

## Phase 1: Environment Setup

### Backend Setup
- [ ] Laravel project running: `php artisan serve`
- [ ] Database configured in `.env`
- [ ] `.env` has `APP_URL=http://localhost:8000`
- [ ] `.env` has `Sanctum` configured for API authentication

### Frontend Setup
- [ ] Next.js project running: `npm run dev`
- [ ] `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v2`
- [ ] Authentication context working (can log in to dashboard)
- [ ] auth_token stored in localStorage after login

---

## Phase 2: Database Verification

### Migrations
- [ ] Run migrations: `php artisan migrate`
- [ ] Check migration status: `php artisan migrate:status` (all shows as ran)
- [ ] New tables created:
  ```bash
  php artisan tinker
  > Schema::hasTable('campaign_feedback')  // true
  > Schema::hasTable('campaign_questions')  // true
  > Schema::hasTable('campaign_question_responses')  // true
  > exit
  ```
- [ ] Campaign table has new columns:
  ```bash
  php artisan tinker
  > Schema::hasColumn('campaigns', 'returns_count')  // true
  > Schema::hasColumn('campaigns', 'early_adopters_count')  // true
  > exit
  ```

### Data Verification
- [ ] At least 1 test campaign exists
- [ ] At least 1 pledge exists for that campaign
- [ ] Test user has creator profile

---

## Phase 3: API Endpoint Testing

### Health Check (No Auth Required)
```bash
curl http://localhost:8000/api/v2/analytics/health
```
- [ ] Returns status 200
- [ ] Response includes: `{ "status": true, "message": "...", ... }`
- [ ] Response includes timestamp

### Creator Analytics (Auth Required)
```bash
# Get token from localStorage in dev tools
TOKEN="your_token_here"

curl -X GET http://localhost:8000/api/v2/analytics/creator \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```
- [ ] Returns status 200
- [ ] Response includes `analytics` object
- [ ] Response includes all required fields:
  - [ ] `totalCampaigns`
  - [ ] `totalEarnings`
  - [ ] `totalBackers`
  - [ ] `conversionRate`
  - [ ] `campaigns.active`
  - [ ] `campaigns.sales`
  - [ ] `campaigns.closed`
  - [ ] `sizingBreakdown` (array)
  - [ ] `questionResponses` (array)
  - [ ] `demographics` (array/object)
  - [ ] `customers` (array)
  - [ ] `AOV` (average order value)
  - [ ] `feedback` (array)
  - [ ] `earlyAdopters` (count)
  - [ ] `returns` (object)

### Campaign-Specific Analytics (Auth Required)
```bash
curl -X GET http://localhost:8000/api/v2/analytics/campaign/1 \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Returns status 200
- [ ] Response includes campaign-specific metrics
- [ ] Same fields as creator analytics but filtered to one campaign

---

## Phase 4: Frontend Page Testing

### Navigation
- [ ] Dashboard sidebar shows "Analytics" (not "Backers")
- [ ] Clicking "Analytics" navigates to `/dashboard/analytics`
- [ ] Page title shows "Analytics"

### Dashboard Loads Successfully
- [ ] No error message appears
- [ ] Console (F12) shows: `✓ Analytics data loaded successfully`
- [ ] Console shows API URL being used

### Tabs Display Correctly
- [ ] "Overview" tab shows:
  - [ ] Total Campaigns count
  - [ ] Total Earnings amount
  - [ ] Total Backers count
  - [ ] Conversion Rate percentage
  - [ ] Campaign status cards (Active, Sales, Closed)

- [ ] "Customers" tab shows:
  - [ ] Customer list with names
  - [ ] Amount spent per customer
  - [ ] Number of purchases
  - [ ] First purchase date
  - [ ] Search/filter works

- [ ] "Sizing" tab shows:
  - [ ] Size breakdown chart
  - [ ] Size names and quantities
  - [ ] Visual representation

- [ ] "Questions" tab shows:
  - [ ] Campaign questions
  - [ ] Response breakdown by answer
  - [ ] Response counts

- [ ] "Demographics" tab shows:
  - [ ] Location/country data
  - [ ] Location counts

- [ ] "Feedback" tab shows:
  - [ ] Customer feedback comments
  - [ ] Ratings (if available)
  - [ ] Feedback dates

---

## Phase 5: Error Handling & Diagnostics

### Trigger Error (Optional Testing)
Stop the backend: `Ctrl+C` in Laravel terminal

- [ ] Error message appears on page
- [ ] Error card shows:
  - [ ] "Failed to load analytics" title
  - [ ] Descriptive error text
  - [ ] Error code block (red background)
  - [ ] 5-item troubleshooting checklist
  - [ ] "Retry" button
  - [ ] API URL debug info

### Run Diagnostics
Click "API Diagnostics" button in error card

- [ ] Diagnostic panel expands
- [ ] Shows 4 tests:
  - [ ] Test 1: "API URL configured" (shows ✓ or ✗)
  - [ ] Test 2: "Health check" (shows status)
  - [ ] Test 3: "Auth token" (shows Present/Missing)
  - [ ] Test 4: "Analytics endpoint" (shows status, may fail if backend down)
- [ ] Each test shows color-coded result (green=pass, red=fail)
- [ ] Failed tests show error details

### Retry Mechanism
- [ ] Start backend again: `php artisan serve`
- [ ] Click "Retry" button on error card
- [ ] Analytics page reloads and displays data successfully
- [ ] Error message disappears

---

## Phase 6: Console Logging

Open DevTools (F12) → Console tab while loading analytics:

- [ ] See message: `📊 Starting analytics data fetch`
- [ ] See message: `🔗 API URL: http://localhost:8000/api/v2/analytics/creator`
- [ ] See message: `🔐 Auth token present: true`
- [ ] See message: `👤 User role: creator`
- [ ] See message: `✓ Analytics API Response Status: 200`
- [ ] See message: `✓ Analytics data loaded successfully`
- [ ] See the full analytics object logged
- [ ] No error messages in console

---

## Phase 7: Data Accuracy

### Create Test Data
1. Create a new campaign
2. Get multiple pledges/orders for that campaign
3. Vary the sizes ordered
4. Add some feedback comments
5. Add some campaign questions

### Verify Calculations
- [ ] Total campaigns count is correct
- [ ] Total backers count matches pledge count
- [ ] Conversion rate calculation is reasonable
- [ ] Sizing breakdown sums to total pledges
- [ ] Customer list shows correct amounts spent
- [ ] Repeat customer counting is accurate
- [ ] Early adopters (first buyers) identified correctly
- [ ] Returns count is accurate

---

## Phase 8: Performance

### Load Time Test
- [ ] Analytics page loads within 3 seconds
- [ ] No "Request timeout" errors
- [ ] DevTools Network tab shows single `/analytics/creator` request
- [ ] Request returns in < 1000ms

### Large Data Test (Optional)
If you have many campaigns/pledges:
- [ ] Still loads in < 3 seconds
- [ ] No memory warnings in console
- [ ] Customer list pagination works (if >100 customers)

---

## Phase 9: Security

### Authentication
- [ ] Cannot access `/api/v2/analytics/creator` without Bearer token
  ```bash
  # Test without token - should get 401 Unauthorized
  curl http://localhost:8000/api/v2/analytics/creator
  ```
- [ ] Cannot access others' analytics from campaign endpoint
  ```bash
  # As creator A, try accessing campaign from creator B
  # Should get 403 Forbidden
  ```

### Token Validation
- [ ] Expired token shows auth error
- [ ] Invalid token shows auth error
- [ ] Token refresh/renewal works if configured

---

## Phase 10: Browser Compatibility

Test in different browsers:
- [ ] Chrome/Chromium
  - [ ] Page loads
  - [ ] All tabs functional
  - [ ] Charts display correctly
  - [ ] No console errors
  
- [ ] Firefox
  - [ ] Page loads
  - [ ] All tabs functional
  - [ ] Charts display correctly
  - [ ] No console errors

- [ ] Edge
  - [ ] Page loads
  - [ ] All tabs functional
  - [ ] Charts display correctly
  - [ ] No console errors

---

## Phase 11: Responsive Design

- [ ] Desktop (1920px): All content visible, no horizontal scroll
- [ ] Laptop (1440px): All content visible
- [ ] Tablet (768px): Responsive layout works
- [ ] Mobile (375px): Mobile-friendly display

---

## Phase 12: Edge Cases

### Empty Analytics
- [ ] New creator with no campaigns:
  - [ ] All metrics show 0
  - [ ] No errors displayed
  - [ ] Empty state messages shown

### Single Campaign
- [ ] Creator with 1 campaign:
  - [ ] All metrics calculated for that campaign
  - [ ] Conversion rate calculated correctly

### No Pledges
- [ ] Campaign with no orders:
  - [ ] Shows 0 customers
  - [ ] Shows 0 earnings
  - [ ] Shows 0 sizing data
  - [ ] No errors

### Large Numbers
- [ ] Creator with 10+ campaigns and 1000+ pledges:
  - [ ] Numbers calculated correctly
  - [ ] No integer overflow issues
  - [ ] Page still loads quickly

---

## Final Sign-Off

Once all tests pass:

- [ ] Date tested: _______________
- [ ] Tester name: _______________
- [ ] Environment:
  - [ ] Backend URL: `http://localhost:8000`
  - [ ] Frontend URL: `http://localhost:3000`
  - [ ] Database: _______________

### Issues Found & Resolved

| Issue | Resolution | Status |
|-------|-----------|--------|
| | | |
| | | |

### Notes

```
[Add any additional notes here]
```

---

## Deployment Checklist (When Ready for Production)

- [ ] All tests above pass on staging server
- [ ] Database migrations run on production
- [ ] Environment variables set:
  - [ ] `APP_URL` correct for production
  - [ ] `NEXT_PUBLIC_API_URL` correct for production
  - [ ] `SANCTUM_STATEFUL_DOMAINS` includes frontend domain
- [ ] CORS configured for production domains
- [ ] SSL certificates valid
- [ ] API rate limiting configured (if needed)
- [ ] Database backups configured
- [ ] Error logging to production service (Sentry, etc.)
- [ ] Monitoring configured for API performance
- [ ] Performance tested with production data volume

---

**All tests completed?** ✅ Ready for production!
