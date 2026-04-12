# Analytics Dashboard - Database & CMS Integration

## Overview

The Analytics Dashboard is now fully integrated with the laravel backend database and acts as the CMS for tracking comprehensive campaign and customer insights.

## Architecture

### Frontend (Next.js)
**Location:** `/frontend/fashionindependent/app/dashboard/analytics/`

- **File:** `page.tsx` - Main Analytics Dashboard component
- **Single API Call:** Calls `/api/v2/analytics/creator` endpoint
- **Data Flow:** Receives aggregated analytics data directly from backend
- **No Multiple Calls:** All data aggregation happens server-side for better performance

### Backend (Laravel)
**Location:** `/app/Http/Controllers/Api/V2/`

- **Controller:** `AnalyticsController.php`
- **API Endpoints:**
  - `GET /api/v2/analytics/creator` - Get aggregated analytics for all creator's campaigns
  - `GET /api/v2/analytics/campaign/{id}` - Get analytics for specific campaign

## Database Tables

### Existing Tables Enhanced
- **campaigns** - Added analytics tracking fields:
  - `returns_count` - Number of returned orders
  - `feedback_comments_count` - Total feedback comments
  - `early_adopters_count` - Count of first-time backers
  - `bounced_notifications` - Failed email/notification count
  - `is_featured` - Marketing feature flag

- **pledges** - Enhanced with:
  - `size_ordered` - Size selected for the pledge
  - `quantity` - Quantity ordered
  - `is_return` - Return status
  - `return_reason` - Reason for return

### New Tables Created
1. **campaign_feedback** - Campaign-specific feedback comments
   - Stores customer feedback on campaigns
   - Links to campaign and user
   - Contains comment text and optional rating

2. **campaign_questions** - Campaign inquiry forms
   - Stores questions creators want to ask backers
   - Supports multiple types: text, multiple_choice, rating
   - Options stored as JSON for multiple choice

3. **campaign_question_responses** - Backer responses to questions
   - Tracks individual responses to campaign questions
   - Links to user and question
   - Aggregated for analytics

## Models

### New Models
```
App\Models\CampaignQuestion
App\Models\CampaignQuestionResponse
App\Models\CampaignFeedback
```

### Updated Models
```
App\Models\Campaign - Added relationships:
  - feedback() - HasMany CampaignFeedback
  - questions() - HasMany CampaignQuestion
```

## Analytics Data Structure

The Analytics endpoint returns a comprehensive data object:

```javascript
{
  // Overview Metrics
  totalCampaigns: number,
  totalEarnings: float,
  totalBackers: number,
  conversionRate: float,
  
  // Campaign Performance
  activeCampaigns: number,
  activeSales: float,
  activeShowcases: number,
  recentlyClosed: number,
  
  // Customer Metrics
  totalDonations: number,
  outboundBounces: number,
  averageOrderValue: float,
  
  // Product Analytics
  sizingBreakdown: {
    "Small": 150,
    "Medium": 300,
    "Large": 200
  },
  
  // Questions & Responses
  questionResponses: [
    {
      question: "What's your favorite feature?",
      responses: [
        { answer: "Quality", count: 25 },
        { answer: "Design", count: 18 }
      ]
    }
  ],
  
  // Engagement
  upvotes: number,
  returns: number,
  returnRate: float,
  
  // Demographics (aggregated from user profiles)
  demographics: {
    ageGroups: {},
    genders: {},
    locations: { "USA": 150, "Canada": 45 },
    education: {},
    incomeRanges: {}
  },
  
  // Customer Data
  uniqueCustomers: number,
  repeatCustomers: number,
  earlyAdopters: number,
  feedbackComments: number,
  
  // Detailed Lists
  customers: [
    {
      id, name, email, totalSpent, 
      campaignsBacked, joinDate, isEarlyAdopter
    }
  ],
  
  feedbackList: [
    {
      customerId, customerName, comment, date, campaign
    }
  ]
}
```

## API Routes

### Location
`/routes/api.php` (lines 165-173)

### Endpoints
```
GET  /api/v2/analytics/creator
     - Requires: Authentication (Bearer token)
     - Returns: Aggregated analytics for creator's campaigns
     
GET  /api/v2/analytics/campaign/{id}
     - Requires: Authentication (Bearer token)
     - Returns: Analytics for specific campaign
```

## Migration

### File
`/database/migrations/2024_04_12_create_analytics_tables.php`

### Setup Steps
```bash
# Run migration
php artisan migrate

# This will:
1. Create campaign_questions table
2. Create campaign_question_responses table
3. Create campaign_feedback table
4. Add new columns to campaigns table
5. Add new columns to pledges table
```

## Frontend Integration

### API Configuration
The frontend uses `process.env.NEXT_PUBLIC_API_URL` which should point to your Laravel backend (e.g., `http://localhost:8000/api/v2`)

### Authentication
Uses Bearer token stored in localStorage from auth context

### Data Fetching
```typescript
// Calls unified analytics endpoint
const analyticsRes = await fetch(`${apiUrl}/analytics/creator`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})
```

### Caching
- Data is fetched on page mount
- Can be manually refreshed via button
- Consider adding periodic refresh (if needed)

## Data Flow

### Creating Analytics Data
1. **Campaign Creation**
   - Creator submits campaign
   - Campaign record created in `campaigns` table

2. **Customer Pledging**
   - Backer supports campaign
   - Pledge recorded in `pledges` table with amount, size, etc.
   - Campaign's `backer_count` incremented

3. **Feedback Collection**
   - Backers answer questions → `campaign_question_responses`
   - Backers leave comments → `campaign_feedback`
   - Campaign tracking fields updated

4. **Analytics Aggregation**
   - AnalyticsController queries campaigns and pledges
   - Aggregates data server-side
   - Returns to frontend in single response

## Performance Considerations

### Optimizations
- ✅ Single API call instead of multiple
- ✅ Server-side aggregation
- ✅ Indexed database queries
- ✅ Lazy loading of related models
- ✅ Pagination for large customer lists (limited to 100)

### Future Improvements
- Add database query caching for frequently accessed data
- Implement pagination for feedback list
- Add date range filtering
- Create materialized views for complex aggregations
- Add search indexes on user names/emails

## Example: Adding New Analytics

To add a new metric to the analytics:

1. **Database**: Add column to `campaigns` table if needed
2. **Model**: Create method in `Campaign` model if complex logic
3. **Controller**: Add calculation method in `AnalyticsController`
4. **API Response**: Include new metric in analytics array
5. **Frontend**: Add new component/tab to display metric

## Troubleshooting

### Analytics Not Loading
1. Check API URL configuration in `.env`
2. Verify authentication token is valid
3. Check Laravel logs: `storage/logs/laravel.log`
4. Verify database migrations ran: `php artisan migrate:status`

### Missing Data
1. Ensure pledge records have proper `backer_id` reference
2. Check that campaigns have `user_id` matching authenticated user
3. Verify feedback records are linked to campaigns

### Performance Issues
1. Check database indexes on foreign keys
2. Use Laravel query logging to identify slow queries
3. Consider adding query caching for high-traffic analytics

## Testing

### API Testing (Postman/etc)
```
GET /api/v2/analytics/creator
Authorization: Bearer {your_token}
```

Expected response:
```json
{
  "status": true,
  "analytics": { ...analytics_data... }
}
```

## Security

- ✅ Requires authentication (Bearer token)
- ✅ Only returns data for authenticated creator's campaigns
- ✅ Validates user owns campaign before returning specific analytics
- ✅ Uses database relationships for data integrity

## Support

For issues or questions about the Analytics integration, refer to:
- Backend: `app/Http/Controllers/Api/V2/AnalyticsController.php`
- Frontend: `frontend/fashionindependent/app/dashboard/analytics/page.tsx`
- Database: Models in `app/Models/`
