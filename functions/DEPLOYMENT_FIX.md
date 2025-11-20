# Deployment Fix: App Engine & Service Account Setup

## Problem

The deployment failed with:
```
Could not authenticate 'service-484601663499@gcf-admin-robot.iam.gserviceaccount.com': Not found
```

This happens because:
1. **App Engine is not initialized** in your project
2. **Service accounts haven't been created** by Google Cloud

## Solution

### Option 1: Initialize App Engine (Recommended - Required for Cloud Functions v2)

1. **Via Firebase Console:**
   - Go to https://console.firebase.google.com/project/windtrackr/functions
   - Click "Get Started" or "Upgrade" if prompted
   - This will automatically initialize App Engine

2. **Via Google Cloud Console:**
   - Go to https://console.cloud.google.com/appengine?project=windtrackr
   - Click "Create Application"
   - Select region: **us-central** (or your preferred region)
   - Click "Create"
   - Wait 2-3 minutes for setup to complete

3. **Via Firebase CLI:**
   ```bash
   # Initialize App Engine
   firebase init hosting
   # Or just create the app engine app
   gcloud app create --region=us-central
   ```

### Option 2: Switch to Cloud Functions v1 (Temporary Workaround)

If you want to deploy immediately without App Engine setup, you can temporarily use Cloud Functions v1:

**Modify `functions/index.js`:**

Replace this line:
```javascript
import { onSchedule } from "firebase-functions/v2/scheduler";
```

With:
```javascript
import * as functions from "firebase-functions";
```

Then change the function declarations from:
```javascript
export const updateForecasts = onSchedule(
  {
    schedule: "0 */6 * * *",
    timeZone: "Europe/Madrid",
  },
  async (event) => { /* ... */ }
);
```

To:
```javascript
export const updateForecasts = functions
  .region("europe-west1")
  .pubsub.schedule("0 */6 * * *")
  .timeZone("Europe/Madrid")
  .onRun(async (context) => { /* ... */ });
```

**However, this is NOT recommended** because:
- v1 is deprecated
- You'll need to migrate to v2 eventually
- v2 has better performance and features

## After App Engine Setup

Once App Engine is initialized:

1. **Wait 2-3 minutes** for Google to create service accounts
2. **Retry deployment:**
   ```bash
   cd functions
   firebase deploy --only functions
   ```

3. **If still failing, enable required APIs manually:**
   ```bash
   # Enable Cloud Functions API
   firebase projects:list  # Verify you're logged in

   # Then try deploying with debug info
   firebase deploy --only functions --debug
   ```

## Verify Setup

After successful deployment:

```bash
# List deployed functions
firebase functions:list

# Check logs
firebase functions:log --only updateForecasts

# Test manual trigger
firebase functions:shell
# Then run: updateForecastManual({data: {}})
```

## Region Considerations

Your error shows `us-central1` as the default region. For a Spanish weather app, consider:

1. **Keep us-central1** (free tier eligible, but higher latency from Spain)
2. **Switch to europe-west1** (closer to Spain, may have costs)

To change region, update `functions/index.js`:

```javascript
export const updateForecasts = onSchedule(
  {
    schedule: "0 */6 * * *",
    timeZone: "Europe/Madrid",
    region: "europe-west1",  // Add this line
  },
  async (event) => { /* ... */ }
);
```

## Troubleshooting

### Error: "App Engine already exists"
Good! Just wait 2-3 minutes and retry deployment.

### Error: "Permission denied"
Your Firebase account needs Owner or Editor role. Check:
- https://console.firebase.google.com/project/windtrackr/settings/iam

### Error: Still can't find service account
Try this sequence:
```bash
# 1. Clear Firebase cache
firebase logout
firebase login

# 2. Redeploy
cd functions
firebase deploy --only functions
```

### Error: "Billing required"
Cloud Functions v2 requires Blaze plan:
- Go to https://console.firebase.google.com/project/windtrackr/usage/details
- Upgrade to Blaze (pay-as-you-go)
- Free tier includes generous quotas

## Next Steps

After successful deployment:

1. Configure stations with INE codes (see `STATION_CONFIG_EXAMPLE.md`)
2. Test manual function trigger
3. Wait for first scheduled run (next 6-hour mark)
4. Monitor logs for any errors
5. Verify forecast data appears in Realtime Database

## Quick Command Reference

```bash
# Deploy only scheduled function
firebase deploy --only functions:updateForecasts

# Deploy only HTTP function
firebase deploy --only functions:updateForecastManual

# Deploy all functions
firebase deploy --only functions

# View logs
firebase functions:log

# Delete a function
firebase functions:delete updateForecasts
```
