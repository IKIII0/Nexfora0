# Production Deployment Guide

## Current Issues
1. `/api/test-post` endpoint missing in production
2. Request body parsing issues for order creation

## Changes Made
1. ✅ Added `/api/test-post` endpoint
2. ✅ Added `/api/echo` endpoint for debugging
3. ✅ Enhanced request logging middleware
4. ✅ Extended JWT token expiry to 24h

## Deploy to Railway.app

### Option 1: Automatic Deploy (Recommended)
```bash
# Push changes to trigger automatic deploy
git add .
git commit -m "Fix request body parsing and add debug endpoints"
git push origin main
```

### Option 2: Manual Deploy
1. Go to Railway.app dashboard
2. Select your project
3. Click "Deploy" or "Redeploy"
4. Wait for deployment to complete

## Test After Deployment

### Step 1: Verify New Endpoints
Test these URLs in browser:
- `https://nexfora0-production.up.railway.app/api/test`
- `https://nexfora0-production.up.railway.app/api/auth/test`

### Step 2: Test Debug Page
1. Open: `http://localhost:5173/debug`
2. Test in order:
   - **Test Basic API** → Should work
   - **Test Echo** → Should work (new endpoint)
   - **Test Login** → Get token
   - **Create Order** → Should work now

### Step 3: Check Production Logs
- Go to Railway.app dashboard
- Click on your service
- Check "Logs" tab for errors

## Expected Results

### Working Echo Test:
```json
{
  "success": true,
  "status": 200,
  "data": {
    "status": "success",
    "echo": {
      "message": "Echo test",
      "tipe_pemesanan": "kelas",
      "nama_paket": "Test Package"
    }
  }
}
```

### Working Create Order:
```json
{
  "success": true,
  "data": {
    "status": "success",
    "message": "Order created successfully",
    "data": {
      "id_pesanan": 1,
      "tipe_pemesanan": "kelas",
      "status": "Dalam Proses"
    }
  }
}
```

## Troubleshooting

### If Echo Test Fails:
- **Problem:** Production server not updated
- **Solution:** Check deployment status in Railway.app

### If Create Order Still Fails:
- **Problem:** Request body still not parsed
- **Solution:** Check Railway.app logs for request details

### If All Tests Work:
- **Great!** Order creation should work in main app
- **Test:** Go to `/pesan` page and create real order

## Next Steps
1. Deploy changes to production
2. Test all debug endpoints
3. Test real order creation in main app
4. Monitor Railway.app logs for any issues
