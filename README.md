<div align="center">

<img src="https://raw.githubusercontent.com/jaggureddy11/ShopHere/main/frontend/public/logo.png" alt="ShopHere Logo" width="120" />

<br/>

# ShopHere

### A Production-Grade Full-Stack Fashion E-Commerce Platform

<p align="center">
  <a href="https://shophere-eight.vercel.app"><img src="https://img.shields.io/badge/🌐 Live Demo-Visit Site-000000?style=for-the-badge" /></a>
  <a href="https://github.com/jaggureddy11/ShopHere"><img src="https://img.shields.io/github/stars/jaggureddy11/ShopHere?style=for-the-badge&logo=github&color=FFD700" /></a>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-CDN-3448C5?style=flat-square&logo=cloudinary&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel" />
</p>

<br/>

> *From first browse to checkout — a seamless, editorial fashion experience built end-to-end.*

</div>

---

## 📌 What is ShopHere?

**ShopHere** is a fully production-ready, full-stack fashion e-commerce platform — think Myntra meets a luxury editorial brand. It features a rich customer storefront, a complete Admin panel, Stripe-powered payments, JWT authentication, Cloudinary image hosting, and a real-time product catalogue of **60+ seeded fashion items**.

Built entirely with **TypeScript across both frontend and backend**, the project demonstrates a scalable monorepo architecture covering the full product lifecycle — browsing, carting, checkout, order tracking, and admin management.

---

## 🌟 Quick Stats

<div align="center">

| 60+ Products Seeded | 7 Mongoose Models | 18+ REST Endpoints | 2 User Roles |
|:---:|:---:|:---:|:---:|
| Full CRUD Admin Panel | Stripe Payment Flow | JWT Refresh Auth | Cloudinary CDN |

</div>

---

## 🖥️ Live Preview

🔗 **[shophere-eight.vercel.app](https://shophere-eight.vercel.app)**

| Page | What You'll See |
|------|-----------------|
| 🏠 **Homepage** | Hero banner · Campaign sections · Editorial lookbook |
| 🛍️ **Products** | 60+ items · Category filters · Real-time search |
| 🛒 **Cart & Checkout** | Live ₹ totals · Full Stripe payment flow |
| 📦 **Orders** | Status tracking: Pending → Shipped → Delivered |
| ❤️ **Wishlist** | Persisted per user in MongoDB |
| 🔧 **Admin Panel** | Revenue stats · Product CRUD · Order & user management |

---

## ✨ Feature Breakdown

### 🛒 Customer Storefront

| Feature | Details |
|---------|---------|
| **Hero Homepage** | Animated banner with fashion models, trending collections & seasonal campaigns |
| **Product Discovery** | Browse 60+ products across Men, Women, Kids, Shoes & Accessories |
| **Category Filtering** | Filter by category, subcategory, gender, price range, and size |
| **Smart Search** | Real-time search with debounce and instant results |
| **Wishlist** | Save favourites — persisted in MongoDB per user account |
| **Shopping Cart** | Add / update / remove items with live ₹ INR price totals |
| **Stripe Checkout** | Secure one-click checkout with full Stripe payment integration |
| **Order Tracking** | Full order history with status flow: Pending → Shipped → Delivered |
| **Product Reviews** | Authenticated star ratings + written reviews per product |
| **User Profile** | Edit personal info, manage addresses, and view full order history |
| **Auth System** | JWT access + refresh token login/register with HTTP-only cookies |

### 🔧 Admin Panel

| Feature | Details |
|---------|---------|
| **Dashboard Overview** | Real-time stats: total revenue, orders, users, and products |
| **Product Management** | Full CRUD — add, edit, upload via Cloudinary, delete products |
| **Order Management** | View and update statuses: Confirm → Ship → Deliver → Cancel |
| **User Management** | View all registered users, toggle admin roles |
| **Image Upload** | Cloudinary-powered uploads with auto-optimization |

### 📱 Mobile-First Design

- Myntra-inspired side-by-side product grid on mobile
- Touch-friendly navigation with smooth Framer Motion animations
- Optimized image loading across all viewports

---

## 🧱 Tech Stack

### Frontend
```
Next.js 14 (App Router)    → SSR/CSR React framework with file-based routing
TypeScript                 → End-to-end type safety
Tailwind CSS               → Utility-first responsive styling
Framer Motion              → Page transitions & micro-animations
Zustand                    → Lightweight global state (cart, auth, wishlist)
React Hook Form + Zod      → Type-safe form validation
Axios                      → HTTP client with interceptors
Lucide React               → Icon library
React Toastify             → Toast notification system
```

### Backend
```
Node.js + Express          → REST API server
TypeScript                 → Fully typed backend code
MongoDB + Mongoose         → NoSQL database & ODM
JWT (Access + Refresh)     → Dual-token authentication strategy
bcryptjs                   → Password hashing (salt rounds: 10)
Stripe                     → Secure payment processing
Cloudinary                 → Image storage & CDN delivery
Nodemailer                 → Email notifications via SMTP
Multer                     → Multipart file / image upload handler
```

### Infrastructure & DevOps
```
Vercel                     → Frontend deployment (Next.js native)
Vercel Serverless          → Backend API deployment
MongoDB Atlas              → Cloud-hosted database cluster
Nodemon + ts-node          → Hot-reload development environment
```

---

## 🗂️ Project Structure

```
ShopHere/
│
├── 📁 frontend/                        # Next.js 14 Application
│   └── src/
│       ├── app/
│       │   ├── (shop)/                 # Customer-facing routes
│       │   │   ├── page.tsx            # Homepage
│       │   │   ├── products/           # Product listing & detail
│       │   │   ├── cart/               # Shopping cart
│       │   │   ├── checkout/           # Stripe checkout flow
│       │   │   ├── orders/             # Order history
│       │   │   ├── wishlist/           # Saved items
│       │   │   ├── profile/            # User account
│       │   │   └── (auth)/             # Login / Register
│       │   └── admin/                  # Admin panel routes
│       │       ├── dashboard/          # Revenue & stats overview
│       │       ├── products/           # Product CRUD
│       │       ├── orders/             # Order status management
│       │       └── users/              # User role management
│       ├── components/                 # Reusable UI components
│       │   ├── Navbar.tsx
│       │   ├── Footer.tsx
│       │   ├── ProductCard.tsx
│       │   └── AdminSidebar.tsx
│       ├── store/                      # Zustand global state
│       │   ├── authStore.ts
│       │   ├── cartStore.ts
│       │   └── wishlistStore.ts
│       ├── types/                      # TypeScript interfaces & types
│       └── utils/                      # Axios instance & helpers
│
├── 📁 backend/                         # Express REST API Server
│   └── src/
│       ├── server.ts                   # Entry point
│       ├── config/db.ts                # MongoDB Atlas connection
│       ├── models/                     # Mongoose schemas
│       │   ├── User.ts
│       │   ├── Product.ts
│       │   ├── Order.ts
│       │   ├── Cart.ts
│       │   ├── Wishlist.ts
│       │   ├── Review.ts
│       │   └── Category.ts
│       ├── controllers/                # Business logic handlers
│       ├── routes/                     # API route definitions
│       │   ├── auth.ts
│       │   ├── products.ts
│       │   ├── orders.ts
│       │   ├── cart.ts
│       │   ├── wishlist.ts
│       │   ├── reviews.ts
│       │   ├── users.ts
│       │   └── admin.ts
│       ├── middleware/                 # Auth & error middleware
│       └── utils/seedData.ts          # 60+ product seed script
│
└── 📁 [design-screens]/               # UI screen reference designs
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
- **MongoDB** (local) or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **Stripe** account → [stripe.com](https://stripe.com)
- **Cloudinary** account → [cloudinary.com](https://cloudinary.com)

---

### 1 — Clone the Repository

```bash
git clone https://github.com/jaggureddy11/ShopHere.git
cd ShopHere
```

---

### 2 — Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/shophere

# Auth
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISH_KEY=pk_test_...

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3003
```

```bash
npm run dev       # Start with hot reload
npm run seed      # Seed 60+ products into MongoDB
```

---

### 3 — Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` inside `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

```bash
npm run dev
```

> 🌐 Frontend → **http://localhost:3003**
> ⚙️ Backend API → **http://localhost:5000**

---

## 📡 API Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register new user | — |
| `POST` | `/api/auth/login` | User login | — |
| `POST` | `/api/auth/refresh` | Refresh access token | Cookie |
| `GET` | `/api/products` | List all products (with filters) | — |
| `GET` | `/api/products/:id` | Get single product | — |
| `GET` | `/api/cart` | Get user's cart | ✅ User |
| `POST` | `/api/cart` | Add item to cart | ✅ User |
| `DELETE` | `/api/cart/:id` | Remove cart item | ✅ User |
| `GET` | `/api/wishlist` | Get user's wishlist | ✅ User |
| `POST` | `/api/wishlist` | Add to wishlist | ✅ User |
| `GET` | `/api/orders` | Get user's orders | ✅ User |
| `POST` | `/api/orders` | Place new order | ✅ User |
| `GET` | `/api/reviews/:productId` | Get product reviews | — |
| `POST` | `/api/reviews` | Submit a review | ✅ User |
| `GET` | `/api/admin/stats` | Dashboard statistics | 🔑 Admin |
| `POST` | `/api/products` | Create product | 🔑 Admin |
| `PUT` | `/api/products/:id` | Update product | 🔑 Admin |
| `DELETE` | `/api/products/:id` | Delete product | 🔑 Admin |
| `PUT` | `/api/admin/orders/:id` | Update order status | 🔑 Admin |

---

## 🗃️ Database Models

```
User        → name, email, passwordHash, role (user/admin), addresses[]
Product     → name, description, price (₹), category, images[], sizes[], stock, rating
Order       → user, items[], totalAmount, status, paymentIntent, shippingAddress
Cart        → user, items[{ product, quantity, size }], updatedAt
Wishlist    → user, products[]
Review      → user, product, rating (1–5), comment, createdAt
Category    → name, slug, parentCategory
```

---

## 🔒 Security

- ✅ **JWT Access + Refresh Token** pattern with HTTP-only cookies
- ✅ **bcryptjs** password hashing (salt rounds: 10)
- ✅ `authMiddleware` + `adminMiddleware` for layered route protection
- ✅ **CORS** configured to allowlist only the frontend origin
- ✅ All secrets in **environment variables** — never committed to source
- ✅ **Zod schema validation** on all frontend form inputs

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| **Typography** | Inter (Google Fonts) — clean, modern sans-serif |
| **Color Palette** | White-dominant · Charcoal accents · Vibrant CTAs |
| **Animations** | Framer Motion — page transitions, hover effects, carousels |
| **Layout Strategy** | Mobile-first · Side-by-side product grid on mobile (Myntra-inspired) |
| **Currency** | All prices displayed in ₹ Indian Rupees (INR) |

---

## 🛠️ Dev Scripts

**Backend**
```bash
npm run dev     # Hot-reload dev server (nodemon + ts-node)
npm run build   # Compile TypeScript to JavaScript
npm start       # Run compiled production server
npm run seed    # Seed database with 60+ fashion products
```

**Frontend**
```bash
npm run dev     # Next.js dev server on port 3003
npm run build   # Create production bundle
npm start       # Start production server
npm run lint    # Run ESLint checks
```

---

## ☁️ Deployment

| Layer | Platform | Notes |
|-------|----------|-------|
| **Frontend** | Vercel | Import `frontend/` — Next.js detected automatically |
| **Backend** | Vercel Serverless | Configure `vercel.json` to serve `dist/server.js` |
| **Database** | MongoDB Atlas | Cloud cluster — free M0 tier works for staging |

> ⚠️ Update `FRONTEND_URL` and `NEXT_PUBLIC_API_URL` to your deployed Vercel URLs before going live.

---

## 🤝 Contributing

Contributions are welcome!

```bash
git checkout -b feature/your-feature-name
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
# Open a Pull Request on GitHub
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ by **[R Jagadishwar Reddy](https://www.linkedin.com/in/jaggureddy/)**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-jaggureddy-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/jaggureddy/)
[![GitHub](https://img.shields.io/badge/GitHub-jaggureddy11-181717?style=flat&logo=github)](https://github.com/jaggureddy11)

**⭐ Star this repo if you found it useful — it helps others discover it!**

[![GitHub stars](https://img.shields.io/github/stars/jaggureddy11/ShopHere?style=social)](https://github.com/jaggureddy11/ShopHere)

</div>
