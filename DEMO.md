# 🎬 Demo Script — Smart Restaurant System

## Setup (Before Demo)
1. Start XAMPP → Apache + MySQL
2. Terminal 1: `cd backend && php artisan serve`
3. Terminal 2: `cd frontend && npm run dev`
4. Open: `http://localhost:5173`

## Demo Flow (10 minutes)

### Part 1 — Customer Experience (4 mins)
1. Open `http://localhost:5173`
2. Show home page — features section
3. Click Menu — browse food items
4. Search for "chicken" — show search
5. Filter by category — show filter
6. Add items to cart
7. Click Order Now — redirects to login
8. Register new account
9. Place order — show confirmation
10. Go to Orders — show order history
11. Click order — show live tracking
12. Go to Queue — join virtual queue
13. Show queue position and wait time

### Part 2 — Staff Experience (3 mins)
1. Open new tab — login as staff
2. Go to `/staff`
3. Show Orders tab — incoming orders
4. Click Mark as Confirmed → Preparing → Ready → Served
5. Show Tables tab — change table status
6. Show Queue tab — call next customer
7. Show real-time update in customer tab

### Part 3 — Admin Experience (3 mins)
1. Login as admin
2. Go to `/admin`
3. Show Dashboard — stats cards + charts
4. Show Menu tab — add new item
5. Show Tables tab — show QR code
6. Show Users tab — change role
7. Show Reviews tab — customer reviews

## Key Points to Mention
- Real-time updates using Pusher WebSockets
- Role-based access control (3 roles)
- QR code for each table
- Stripe payment integration
- Progressive auth (login only when needed)
- Mobile responsive with bottom navigation
