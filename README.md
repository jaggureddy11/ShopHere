<div align="center">

<img src="frontend/public/logo.png" alt="ShopHere Logo" width="120" />

# 🛍️ ShopHere — Full-Stack E-Commerce Platform

**A premium, production-ready fashion e-commerce experience built with Next.js 14, Node.js, MongoDB & Stripe.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

---

> *A high-performance fashion store offering a seamless shopping experience across all devices — from the first browse to checkout.*

</div>

---

## ✨ Features

### 🛒 Customer Storefront
| Feature | Description |
|--------|-------------|
| 🏠 **Hero Homepage** | Animated hero banner with fashion models, trending collections & campaign sections |
| 🔍 **Product Discovery** | Browse 60+ curated products across Men, Women, Kids, Shoes & Accessories |
| 🗂 **Category Filtering** | Filter by category, subcategory, gender, price range, and size |
| 🔎 **Smart Search** | Real-time product search with debounce and instant results |
| ❤️ **Wishlist** | Save favourites — persisted in database per user account |
| 🛒 **Shopping Cart** | Add/update/remove items with live price totals in ₹ INR |
| 💳 **Stripe Checkout** | Secure one-click checkout with Stripe payment integration |
| 📦 **Order Tracking** | Full order history with status tracking (Pending → Shipped → Delivered) |
| ⭐ **Product Reviews** | Authenticated users can leave star ratings and written reviews |
| 👤 **User Profile** | Edit personal details, manage addresses, and view order history |
| 🔐 **Auth System** | Secure JWT-based login / register with token refresh and cookies |

### 🔧 Admin Panel
| Feature | Description |
|--------|-------------|
| 📊 **Dashboard Overview** | Real-time stats: total revenue, orders, users, and products |
| 📦 **Product Management** | Full CRUD — add, edit, upload images via Cloudinary, delete products |
| 🧾 **Order Management** | View and update order statuses (Confirm, Ship, Deliver, Cancel) |
| 👥 **User Management** | View all registered users, toggle admin roles |
| 🖼 **Image Upload** | Cloudinary-powered product image uploads with auto-optimization |

### 📱 Mobile-First Responsive Design
- Side-by-side product grid (Myntra-style) on mobile
- Touch-friendly navigation with smooth animations
- Optimized image loading with `no-referrer` policy for external image sources

---

## 🧱 Tech Stack

### Frontend
```
Next.js 14 (App Router)    → React framework with SSR/CSR
TypeScript                 → Type-safe development
Tailwind CSS               → Utility-first styling
Framer Motion              → Smooth page & component animations
Zustand                    → Lightweight global state management
React Hook Form + Zod      → Type-safe form validation
Axios                      → HTTP client with interceptors
Lucide React               → Beautiful icon library
React Toastify             → User feedback notifications
```

### Backend
```
Node.js + Express          → REST API server
TypeScript                 → Type-safe backend code
MongoDB + Mongoose         → NoSQL database & ODM
JWT (Access + Refresh)     → Authentication tokens
bcryptjs                   → Password hashing
Stripe                     → Payment processing
Cloudinary                 → Image storage & CDN
Nodemailer                 → Email notifications (SMTP)
Multer                     → Multipart file handling
```

### DevOps & Tooling
```
Vercel                     → Frontend deployment
Vercel (Serverless)        → Backend deployment
MongoDB Atlas              → Cloud database
Nodemon + ts-node          → Hot-reload development
```

---

## 🗂 Project Structure

```
stitch_shophere_full_stack_e_commerce/
│
├── 📁 frontend/                  # Next.js 14 App
│   ├── src/
│   │   ├── app/
│   │   │   ├── (shop)/           # Customer-facing pages
│   │   │   │   ├── page.tsx      # Homepage
│   │   │   │   ├── products/     # Product listing & detail
│   │   │   │   ├── cart/         # Shopping cart
│   │   │   │   ├── checkout/     # Stripe checkout flow
│   │   │   │   ├── orders/       # Order history
│   │   │   │   ├── wishlist/     # Saved items
│   │   │   │   ├── profile/      # User account
│   │   │   │   └── (auth)/       # Login / Register
│   │   │   └── admin/            # Admin panel
│   │   │       ├── dashboard/    # Stats overview
│   │   │       ├── products/     # Product CRUD
│   │   │       ├── orders/       # Order management
│   │   │       └── users/        # User management
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   └── AdminSidebar.tsx
│   │   ├── store/                # Zustand global state
│   │   │   ├── authStore.ts
│   │   │   ├── cartStore.ts
│   │   │   └── wishlistStore.ts
│   │   ├── types/                # TypeScript interfaces
│   │   └── utils/                # Axios & helpers
│
├── 📁 backend/                   # Express API Server
│   └── src/
│       ├── server.ts             # Entry point
│       ├── config/db.ts          # MongoDB connection
│       ├── models/               # Mongoose schemas
│       │   ├── User.ts
│       │   ├── Product.ts
│       │   ├── Order.ts
│       │   ├── Cart.ts
│       │   ├── Wishlist.ts
│       │   ├── Review.ts
│       │   └── Category.ts
│       ├── controllers/          # Route handlers
│       ├── routes/               # API route definitions
│       │   ├── auth.ts
│       │   ├── products.ts
│       │   ├── orders.ts
│       │   ├── cart.ts
│       │   ├── wishlist.ts
│       │   ├── reviews.ts
│       │   ├── users.ts
│       │   └── admin.ts
│       ├── middleware/           # Auth & error middleware
│       └── utils/seedData.ts    # 60+ product seed data
│
└── 📁 [design-screens]/          # UI screen references
    ├── shop_here_home/
    ├── shop_here_your_cart/
    ├── shop_here_checkout/
    ├── shop_here_wishlist/
    ├── shop_here_order_history/
    ├── shop_here_user_profile/
    ├── admin_dashboard_overview/
    ├── admin_product_management/
    └── admin_add_new_product/
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**
- **MongoDB** (local) or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **Stripe** account for payment processing
- **Cloudinary** account for image uploads

---

### 1. Clone the Repository

```bash
git clone https://github.com/jaggureddy11/ShopHere.git
cd stitch_shophere_full_stack_e_commerce
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/shophere

# Auth
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# Cloudinary (Image Upload)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISH_KEY=pk_test_...

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3003
```

**Start the development server:**
```bash
npm run dev
```

**Seed the database with 60+ products:**
```bash
npm run seed
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Start the development server:**
```bash
npm run dev
```

> 🌐 Frontend runs on **http://localhost:3003**
> ⚙️ Backend API runs on **http://localhost:5000**

---

## 📡 API Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register new user | — |
| `POST` | `/api/auth/login` | User login | — |
| `POST` | `/api/auth/refresh` | Refresh access token | Cookie |
| `GET` | `/api/products` | List all products (with filters) | — |
| `GET` | `/api/products/:id` | Get single product | — |
| `GET` | `/api/cart` | Get user's cart | ✅ |
| `POST` | `/api/cart` | Add item to cart | ✅ |
| `DELETE` | `/api/cart/:id` | Remove cart item | ✅ |
| `GET` | `/api/wishlist` | Get user's wishlist | ✅ |
| `POST` | `/api/wishlist` | Add to wishlist | ✅ |
| `GET` | `/api/orders` | Get user's orders | ✅ |
| `POST` | `/api/orders` | Place new order | ✅ |
| `GET` | `/api/reviews/:productId` | Get product reviews | — |
| `POST` | `/api/reviews` | Add a review | ✅ |
| `GET` | `/api/admin/stats` | Dashboard statistics | 🔑 Admin |
| `POST` | `/api/products` | Create product | 🔑 Admin |
| `PUT` | `/api/products/:id` | Update product | 🔑 Admin |
| `DELETE` | `/api/products/:id` | Delete product | 🔑 Admin |
| `PUT` | `/api/admin/orders/:id` | Update order status | 🔑 Admin |

---

## 🛠 Development Scripts

### Backend
```bash
npm run dev     # Start development server with hot-reload (nodemon)
npm run build   # Compile TypeScript → JavaScript
npm start       # Run compiled production server
npm run seed    # Seed database with 60+ fashion products
```

### Frontend
```bash
npm run dev     # Start Next.js development server (port 3003)
npm run build   # Build production bundle
npm start       # Start production server
npm run lint    # Run ESLint checks
```

---

## ☁️ Deployment

This project is deployed on **Vercel** with both the frontend and backend hosted separately.

### Frontend (Vercel)
1. Import the `frontend/` folder into Vercel
2. Set environment variables in the Vercel dashboard
3. Deploy — Vercel handles Next.js builds automatically

### Backend (Vercel Serverless)
1. Import the `backend/` folder into Vercel
2. Configure `vercel.json` to serve `dist/server.js`
3. Set all environment variables
4. Deploy — API becomes available at your Vercel URL

### Environment Variables for Production
> Remember to update `FRONTEND_URL` and `NEXT_PUBLIC_API_URL` to your deployed URLs!

---

## 🗃 Database Models

```
User        → name, email, passwordHash, role (user/admin), addresses
Product     → name, description, price (₹), category, images[], sizes[], stock, rating
Order       → user, items[], totalAmount, status, paymentIntent, shippingAddress
Cart        → user, items[{product, quantity, size}], updatedAt
Wishlist    → user, products[]
Review      → user, product, rating (1-5), comment, createdAt
Category    → name, slug, parentCategory
```

---

## 🎨 Design System

- **Typography**: Inter (Google Fonts) — clean, modern sans-serif
- **Color Palette**: White-dominant with charcoal accents and vibrant CTAs
- **Animations**: Framer Motion for page transitions, hover effects, and carousel motion
- **Mobile-first**: Responsive breakpoints — side-by-side product grid on mobile (Myntra-inspired)
- **Pricing**: All prices displayed in **Indian Rupees (₹ INR)**

---

## 🔒 Security

- ✅ JWT Access + Refresh Token pattern with HTTP-only cookies
- ✅ Password hashing with bcryptjs (salt rounds: 10)
- ✅ Route protection via `authMiddleware` and `adminMiddleware`
- ✅ CORS configured to allow only the frontend origin
- ✅ Environment variables for all secrets (never committed)
- ✅ Input validation with Zod on the frontend

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by the ShopHere Team**

*If you found this project helpful, please give it a ⭐ on GitHub!*

[![GitHub stars](https://img.shields.io/github/stars/jaggureddy11/ShopHere?style=social)](https://github.com/jaggureddy11/ShopHere)

</div>
