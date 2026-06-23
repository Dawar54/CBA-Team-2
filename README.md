# RevShop - MERN E-Commerce Marketplace

RevShop is a full-featured, scalable MERN (MongoDB, Express, React, Node.js) e-commerce marketplace platform tailored for both buyers and sellers. The application features user authentication, role-based controls, inventory management with low-stock alerts, order tracking, product reviews, and product bookmarking (favorites).

---

## 🚀 Key Features

### 🛒 Buyer Features
- **Product Discovery:** Browse products by category, search, and view item details.
- **Cart & Checkout:** Add products to a shopping cart, modify quantities, and check out.
- **Order Management:** View order history, track status (Pending, Processing, Shipped, Delivered, Cancelled), and review invoice details.
- **Reviews & Ratings:** Leave ratings (1–5 stars) and write comments on purchased products.
- **Favorites:** Save preferred products to a personalized favorites list for easy access.

### 💼 Seller Features
- **Product Management:** Add new products, update product details (title, description, price, category, discount), and delete products.
- **Stock Management:** Adjust stock levels and set custom threshold numbers to trigger alerts when inventory is low.
- **Business Identity:** Maintain business details and track sales.

### 🔒 Core Capabilities
- **Role-Based Routing:** Secure portals separated dynamically between Buyers and Sellers.
- **Robust Authentication:** Password hashing using `bcryptjs` and secure session handling via JSON Web Tokens (JWT).
- **Concurrent Development:** Run both backend and frontend applications concurrently using a single CLI command from the root directory.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (built with Vite for fast builds)
- **State Management:** Redux Toolkit & React-Redux
- **Routing:** React Router DOM (v7)
- **UI Components:** React-Bootstrap & Bootstrap 5
- **Icons:** React Icons
- **Notifications:** React-Toastify
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express (v5)
- **Database ODM:** Mongoose (MongoDB)
- **File Uploads:** Multer
- **Security:** JWT, bcryptjs, CORS

---

## 📁 Project Structure

```text
RevShop/
├── backend/                  # Node.js + Express backend server
│   ├── config/               # Database connection config
│   ├── controllers/          # Business logic controllers
│   ├── data/                 # Sample seed data
│   ├── middleware/           # Authentication & error-handling middleware
│   ├── models/               # Mongoose schemas/models
│   ├── routes/               # API routes
│   └── utils/                # Helper utilities
├── frontend/                 # React frontend application
│   ├── public/               # Public assets
│   └── src/                  # React components, pages, Redux slices
├── package.json              # Root package to coordinate backend and frontend
├── Architecture_Diagram.md   # System Architecture diagram
└── ERD_Diagram.md            # Database Entity-Relationship Diagram (ERD)
```

---

## ⚙️ Setup and Installation

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance running, or MongoDB Atlas URI)

### 2. Install Dependencies
Run the following command in the **root** folder to install dependencies for the root, backend, and frontend directories:
```bash
npm run install:all
```

### 3. Environment Variables
Create a file named `.env` in the `/backend` directory and configure the variables:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/revshop
JWT_SECRET=your_super_secret_jwt_key_here
```

### 4. Database Seeding (Optional)
To pre-populate your database with sample products and users, execute the seeder script from the `/backend` directory:
```bash
# Navigate to backend folder
cd backend

# Run the database seeder
node seeder.js
```
*To clear the database of all seeded data:*
```bash
node seeder.js -d
```

### 5. Running the Application
To run both the frontend and backend servers concurrently, execute this command from the **root** directory:
```bash
npm run dev
```
- **Backend Server:** Runs on `http://localhost:5000`
- **Frontend App:** Runs on `http://localhost:5173`

---

## 📊 Database & Architecture Diagrams

You can explore the system details using the built-in diagrams:
- **Architecture Flow:** Check out [Architecture_Diagram.md](file:///c:/Users/HARISH/Downloads/RevShop%20(2)/RevShop/Architecture_Diagram.md)
- **Database Schema:** Check out [ERD_Diagram.md](file:///c:/Users/HARISH/Downloads/RevShop%20(2)/RevShop/ERD_Diagram.md)
