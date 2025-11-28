# Quick Fix: Failed to Fetch Solution

## Problem: Production Server Not Working
- `https://nexfora0-production.up.railway.app/api/orders` returns error
- Frontend shows "Failed to Fetch"
- Need immediate working solution

## Solution: Run Local Server

### Step 1: Create .env file in server/
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your_super_secret_key_here
PORT=5000
NODE_ENV=development
```

### Step 2: Start Backend Server
```bash
cd server
npm install
npm start
```
Server will run at: `http://localhost:5000`

### Step 3: Update Frontend to Use Localhost
Edit `client/src/utils/apiHelpers.js`:
```javascript
const API_BASE_URL = "http://localhost:5000/api";
```

### Step 4: Start Frontend
```bash
cd client
npm run dev
```

### Step 5: Test
1. Open: `http://localhost:5173`
2. Login to get token
3. Try creating order
4. Check browser console (F12) for errors

## Database Setup (If Needed)
If you get database errors, create the pemesanan table:

```sql
-- Run this in PostgreSQL
CREATE TABLE IF NOT EXISTS pemesanan (
    id_pesanan SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tipe_pemesanan VARCHAR(50) NOT NULL CHECK (tipe_pemesanan IN ('kelas', 'jasa')),
    nama_paket VARCHAR(255) NOT NULL,
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'Dalam Proses' CHECK (status IN ('Selesai', 'Dalam Proses', 'Dibatalkan')),
    tanggal TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    catatan TEXT,
    nama_lengkap VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Debug Steps
1. **Check Server Console:** Look for error messages
2. **Check Browser Console:** F12 → Console tab
3. **Test Basic API:** `http://localhost:5000/api/test`
4. **Check Token:** `localStorage.getItem('token')` in browser

## Common Issues
- **Port 5000 in use:** Change PORT in .env
- **Database connection:** Check DATABASE_URL format
- **CORS errors:** Server should handle with current config
- **Missing JWT_SECRET:** Add to .env file

## Production Fix (Later)
Once local works, fix production:
1. Check Railway.app deployment logs
2. Verify environment variables
3. Check database connection
4. Redeploy if needed

**Start with local development first!**
