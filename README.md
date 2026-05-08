# 🍽️ Smart Restaurant Pre-Order & Queue Management System

A full-stack web application that digitizes the restaurant experience for customers, kitchen staff, and administrators.

## 🌟 Features

### Customer
- Browse menu with search & filter
- Pre-order food online
- QR Code table scan
- Join virtual queue
- Real-time order tracking
- Online payment (Stripe)
- Rating & reviews
- Order history
- Push notifications

### Kitchen / Staff
- View & manage incoming orders
- Update order status in real-time
- Manage table availability
- Control virtual queue
- Notify customers

### Admin
- Full dashboard with analytics
- Menu management (CRUD)
- Table management with QR codes
- User management
- Sales reports with charts

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite |
| Styling | Tailwind CSS |
| State | Zustand |
| Backend | Laravel 12 (PHP) |
| Database | MySQL |
| Auth | Laravel Sanctum |
| Real-time | Pusher + Laravel Echo |
| Charts | Recharts |
| Payment | Stripe |
| Version Control | Git + GitHub |

## 🚀 Local Setup

### Prerequisites
- PHP 8.2+
- Composer
- Node.js & npm
- MySQL
- Git

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

**Backend (.env)**
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=restaurant_db
DB_USERNAME=root
DB_PASSWORD=
PUSHER_APP_ID=your_pusher_app_id
PUSHER_APP_KEY=your_pusher_key
PUSHER_APP_SECRET=your_pusher_secret
PUSHER_APP_CLUSTER=ap2
STRIPE_KEY=your_stripe_publishable_key
STRIPE_SECRET=your_stripe_secret_key

**Frontend (.env)**
VITE_PUSHER_APP_KEY=your_pusher_key
VITE_PUSHER_APP_CLUSTER=ap2
VITE_STRIPE_KEY=your_stripe_publishable_key
VITE_API_URL=http://127.0.0.1:8000/api

## 👥 Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@test.com | password123 |
| Staff | staff@test.com | password123 |
| Customer | Register new account | - |

## 💳 Test Payment

Use Stripe test card:
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

## 📊 Database

10 tables:
- users
- tables
- menu_categories
- menu_items
- orders
- order_items
- queue
- reservations
- reviews
- notifications

## 👨‍💻 Developer

**Anees**
Student ID: KAN/IT/2324F/0224
Advanced Technological Institute (ATI) Kandy
Final Year — Information Technology

## 📄 License

This project is for academic purposes only.