# Analytics System - Setup & Deployment Guide

## Quick Start Checklist

### Backend Setup

#### 1. Run Migrations
```bash
cd d:\laragon\www\mirrormefashion

# Run all pending migrations
php artisan migrate

# Or run specific migration
php artisan migrate --path=database/migrations/2024_04_12_create_analytics_tables.php
```

#### 2. Verify Routes
```bash
# List all API routes
php artisan route:list | grep analytics

# Expected output:
# GET  /api/v2/analytics/creator
# GET  /api/v2/analytics/campaign/{id}
```

#### 3. Test the API
```bash
# Using curl
curl -X GET "http://localhost:8000/api/v2/analytics/creator" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Expected response
{
  "status": true,
  "analytics": { ...data... }
}
```

### Frontend Setup

#### 1. Verify Environment Variables
```bash
cd frontend/fashionindependent

# Check .env or .env.local for:
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v2
```

#### 2. Test Dashboard
```bash
# Navigate to dashboard
http://localhost:3000/dashboard/analytics

# You should see:
- Loading spinner while fetching data
- Tabbed interface (Overview, Customers, Sizing, etc.)
- Analytics data populated from backend
```

#### 3. Verify API Integration
```bash
# Open browser DevTools (F12)
# Go to Network tab
# Reload analytics page
# Should see single request to /analytics/creator
```

## File Changes Summary

### Backend Files Created/Modified

#### New Files
1. `app/Http/Controllers/Api/V2/AnalyticsController.php` - Main analytics logic
2. `app/Models/CampaignQuestion.php` - Question model
3. `app/Models/CampaignQuestionResponse.php` - Question response model
4. `app/Models/CampaignFeedback.php` - Feedback model
5. `database/migrations/2024_04_12_create_analytics_tables.php` - Database schema

#### Modified Files
1. `app/Models/Campaign.php` - Added relationships (feedback, questions)
2. `routes/api.php` - Added analytics routes
3. `app/Http/Controllers/Api/V2/PledgeController.php` - No changes (existing endpoints used)

### Frontend Files Modified

1. `app/dashboard/analytics/page.tsx` - Updated data fetching to use single endpoint
2. `components/dashboard-sidebar.tsx` - Changed "Backers" to "Analytics"

## Database Schema Changes

### New Tables
```sql
-- Campaign Feedback
CREATE TABLE campaign_feedback (
  id BIGINT PRIMARY KEY,
  campaign_id BIGINT,
  user_id BIGINT,
  comment TEXT,
  rating INT,
  timestamps
);

-- Campaign Questions
CREATE TABLE campaign_questions (
  id BIGINT PRIMARY KEY,
  campaign_id BIGINT,
  question_text VARCHAR,
  question_type VARCHAR,
  options JSON,
  timestamps
);

-- Question Responses
CREATE TABLE campaign_question_responses (
  id BIGINT PRIMARY KEY,
  campaign_question_id BIGINT,
  user_id BIGINT,
  answer TEXT,
  timestamps
);
```

### Enhanced Columns
```sql
ALTER TABLE campaigns ADD COLUMN returns_count INT DEFAULT 0;
ALTER TABLE campaigns ADD COLUMN feedback_comments_count INT DEFAULT 0;
ALTER TABLE campaigns ADD COLUMN early_adopters_count INT DEFAULT 0;
ALTER TABLE campaigns ADD COLUMN bounced_notifications INT DEFAULT 0;
ALTER TABLE campaigns ADD COLUMN is_featured BOOLEAN DEFAULT 0;

ALTER TABLE pledges ADD COLUMN size_ordered VARCHAR;
ALTER TABLE pledges ADD COLUMN quantity INT DEFAULT 1;
ALTER TABLE pledges ADD COLUMN is_return BOOLEAN DEFAULT 0;
ALTER TABLE pledges ADD COLUMN return_reason TEXT;
```

## Testing Scenarios

### Scenario 1: New Creator with Campaign
```
1. Create creator account
2. Create campaign with funding goal
3. Get some pledges (test as different users)
4. Navigate to analytics
5. Should show: campaigns count, earnings, backers count
```

### Scenario 2: Multiple Campaigns
```
1. Create 3 campaigns
2. Add pledges to each different amounts
3. Check analytics sums all campaigns correctly
4. Check customers list shows unique backers
5. Check repeat customers calculated correctly
```

### Scenario 3: Feedback & Questions
```
1. Add questions to campaign
2. Have backers respond to questions
3. Add feedback comments
4. Check analytics shows responses aggregated
5. Check feedback list displays comments
```

## Performance Metrics

### Baseline Queries
- Single campaign: ~100-200ms
- 5 campaigns: ~300-500ms
- 10+ campaigns: ~500-1000ms

### Optimization Tips
- Add indexes on foreign keys
- Use query caching for frequent requests
- Implement pagination for feedback list
- Use database query logging to identify bottlenecks

## Troubleshooting

### Issue: 401 Authentication Error
**Solution:**
- Verify Bearer token is valid
- Check token hasn't expired
- Ensure Authorization header format: `Bearer {token}`

### Issue: 404 Not Found
**Solution:**
- Verify routes are registered: `php artisan route:list | grep analytics`
- Check API URL in frontend .env
- Verify campaign belongs to authenticated user

### Issue: No Data Showing
**Solution:**
- Verify migrations ran: `php artisan migrate:status`
- Check database tables exist: `php artisan tinker` → `DB::table('campaigns')->count()`
- Verify pledges exist for campaigns
- Check Laravel logs for errors

### Issue: Slow Analytics Loading
**Solution:**
- Check database indexes
- Use query logging: `\DB::enableQueryLog()`
- Profile with Laravel Debugbar
- Consider adding query caching

## Rollback Instructions

If you need to rollback the analytics system:

```bash
# Rollback only analytics migration
php artisan migrate:rollback --path=database/migrations/2024_04_12_create_analytics_tables.php

# Or rollback all
php artisan migrate:rollback

# Verify rollback
php artisan migrate:status
```

## Deployment Checklist

- [ ] Run migrations on production database
- [ ] Verify API endpoints accessible
- [ ] Test with real data
- [ ] Check performance under load
- [ ] Monitor error logs
- [ ] Set up log rotation
- [ ] Configure backup strategy
- [ ] Document any custom configurations

## Next Steps

1. **Populate Demo Data** (optional)
   - Create test campaigns and pledges
   - Add test feedback and responses

2. **Performance Optimization**
   - Add database indexes
   - Implement caching layer
   - Monitor query performance

3. **Feature Extensions**
   - Date range filtering
   - Export to CSV/PDF
   - Advanced segmentation
   - Real-time updates

4. **Security Hardening**
   - Add rate limiting to analytics endpoint
   - Implement more granular permissions
   - Add audit logging for data exports

## Support & Documentation

- **API Documentation:** `ANALYTICS_INTEGRATION.md`
- **Backend Controller:** `app/Http/Controllers/Api/V2/AnalyticsController.php`
- **Frontend Component:** `frontend/fashionindependent/app/dashboard/analytics/page.tsx`
- **Database Models:** `app/Models/Campaign*.php`
