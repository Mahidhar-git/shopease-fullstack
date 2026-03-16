# ShopEase — Full Stack E-Commerce Platform 🛒

> Browse products. Add to cart. Place orders. Track everything — all in one place.

A production-ready full-stack e-commerce application built with Spring Boot and React. Customers can register, browse 18+ products across 6 categories, manage their cart, place orders and track them in real time. The platform is managed by a **single admin (me!)** who has full control over products, orders, and the entire store — just like a real e-commerce business.

## 🌐 Live Demo

| | Link |
|---|---|
| 🖥️ Frontend | [shopease-mahidhar.netlify.app](https://shopease-mahidhar.netlify.app) |
| ⚙️ Backend API | [shopease-backend-sb1f.onrender.com](https://shopease-backend-sb1f.onrender.com) |

> ⚠️ The backend runs on Render's free tier — it may take 30–60 seconds to wake up on the first request. Thank you for your patience!

---

## 🎬 Demo

[![Watch Demo](https://img.youtube.com/vi/6c-2j5mEzGg/maxresdefault.jpg)](https://www.youtube.com/watch?v=6c-2j5mEzGg)

> Click the thumbnail to watch the full demo!

---

## 👑 How This App Works — Two Roles

### 🙋 Customer (Anyone can register)
When you visit ShopEase, you can:
- ✅ **Register** a new account and **log in** securely
- ✅ **Browse 18+ products** across 6 categories — Mobiles, Laptops, Headphones, Electronics, Fashion, Toys
- ✅ **Search products** by name instantly
- ✅ **Filter products** by category
- ✅ **View product details** — price, description, release date, image
- ✅ **Add products to cart** and manage quantities
- ✅ **Place orders** from your cart
- ✅ **View your order history** and track order status
- ✅ **Cancel orders** that are still pending

### 👑 Admin (Only Me — G Mahidhar Reddy)
There is **only one admin** for this entire platform — and that's me. The admin account has special privileges that no regular user can access:
- 👑 **Add new products** with image upload
- 👑 **Edit existing products** — update name, price, description, image
- 👑 **Delete products** from the store
- 👑 **View ALL orders** placed by every customer
- 👑 **Update order status** — PENDING → CONFIRMED → DELIVERED → CANCELLED
- 👑 **View total revenue** and order statistics on the admin dashboard
- 👑 **Full control** over what's sold and how orders are managed

> 🔒 Admin access is role-based and secured with JWT. Even if someone tries to access admin routes manually, the backend will reject unauthorized requests.

---

## ✨ Full Feature List

### 🔐 Authentication
- JWT-based secure login and registration
- Passwords encrypted with BCrypt
- Role-based access control (ROLE_USER / ROLE_ADMIN)
- Protected routes on both frontend and backend

### 🛍️ Product Management
- 18 real products across 6 categories
- Product images stored as binary data in PostgreSQL
- Search by product name
- Filter by category (Mobile, Laptop, Headphone, Electronics, Fashion, Toys)
- Admin can add, edit, delete products

### 🛒 Cart System
- Cart is saved in the database (not just browser)
- Add, remove, update quantities
- Cart persists across sessions
- Real-time total calculation

### 📦 Order System
- Place orders directly from cart
- Each order captures product, quantity, price, date
- Customers can view full order history
- Customers can cancel PENDING orders
- Admin sees all orders from all customers

### 👑 Admin Dashboard
- View all customer orders in one place
- Update order status with one click
- Revenue statistics
- Full product CRUD management

### 🎨 UI/UX
- Dark glassmorphism design with deep purple theme
- Fully mobile responsive
- Hamburger menu for mobile navigation
- Crown icon (👑) shown next to admin username in navbar
- Smooth loading states

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Backend
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=spring-security&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

### DevOps & Hosting
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-000000?style=for-the-badge&logo=neon&logoColor=white)

---

## 🏗️ Architecture
```
User / Admin Browser
        │
        ▼
Netlify (React + Vite Frontend)
        │
        │  REST API calls (JWT in headers)
        ▼
Render (Spring Boot Backend — Dockerized)
        │
        │  JDBC connection
        ▼
Neon (PostgreSQL Cloud Database)
```

---

## 📁 Project Structure
```
SpringBoot-Reactjs-Ecommerce/
├── Ecommerce-Backend/          # Spring Boot REST API
│   ├── src/main/java/
│   │   ├── controller/         # REST endpoints
│   │   ├── service/            # Business logic
│   │   ├── repository/         # JPA repositories
│   │   ├── model/              # Entity classes
│   │   ├── security/           # JWT + Spring Security
│   │   └── config/             # CORS, Security config
│   └── Dockerfile
│
└── Ecommerce-Frontend/         # React + Vite
    ├── src/
    │   ├── pages/              # Home, Cart, Orders, Admin
    │   ├── components/         # Navbar, Footer, etc.
    │   └── App.jsx
    └── .env                    # API URL config
```

---

## 🚀 Running Locally

### Prerequisites
- Java 21
- Node.js 18+
- MySQL (local) or Neon PostgreSQL (cloud)

### Backend
```bash
cd Ecommerce-Backend
# Create a .env file with:
# DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD
mvn spring-boot:run
```

### Frontend
```bash
cd Ecommerce-Frontend
npm install
# Create a .env file with:
# VITE_API_URL=http://localhost:8080
npm run dev
```

---

## 🗄️ Database

- **Local development:** MySQL via `.env` file
- **Production:** Neon PostgreSQL (cloud)
- **Image storage:** Product images stored as `bytea` in PostgreSQL

---

## 👨‍💻 Author

**G Mahidhar Reddy**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Mahidhar-git)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/g-mahidhar-reddy/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ by <a href="https://github.com/Mahidhar-git">G Mahidhar Reddy</a></p>
