# E-Commerce Web Application (Internship Project)

This is a full-stack e-commerce web application built as part of an internship assignment. The goal of this project is to build a basic online store with product management and order tracking features.

## Project Requirements
- **Product catalog, add to cart, and checkout functionality**
- **User login and role-based access (Admin/User)**
- **Backend APIs for product & order management**
- **Database integration with MongoDB**

## Tech Stack
- **Frontend**: React.js, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

1. **Install Dependencies**
   Run the following command in the root folder to install packages for both frontend and backend (if needed, otherwise `npm install` handles the root workspace).
   ```bash
   npm install
   ```

2. **Environment Variables**
   Make sure you have a `.env` file in the root directory. If not, copy `.env.example` to `.env` and add your MongoDB connection string:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=4000
   CLIENT_ORIGIN=http://127.0.0.1:5173
   VITE_API_URL=/api
   ```

3. **Seed Database (Optional)**
   You can populate the database with sample products and default users:
   ```bash
   npm run seed
   ```
   **Default Users:**
   - Admin: `admin@urbancart.com` / `admin123`
   - User: `demo@urbancart.com` / `demo123`

4. **Run the Application**
   To start both the frontend and the backend servers concurrently:
   ```bash
   npm run dev:full
   ```
   - Frontend runs on `http://127.0.0.1:5173`
   - Backend API runs on `http://127.0.0.1:4000`

## Features Implemented
- **Frontend**: Responsive UI using Tailwind CSS, global state management for the cart and user session.
- **Backend**: RESTful APIs with error handling, JWT-based protected routes, and Mongoose schemas.
- **Admin Dashboard**: Create, update, and delete products, and manage order statuses.
- **User Features**: Browse catalog, add items to cart, checkout, view order history.
