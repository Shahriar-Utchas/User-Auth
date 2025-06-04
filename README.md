# ⚙️ MERN Stack – User Authentication & Authorization System

This is a full-stack MERN application built to manage secure user authentication, shop name validation, and personalized subdomain dashboards. It uses **React (Vite)** for the frontend and **Node.js + Express + MongoDB** for the backend, with **JWT and HTTP-only cookies** for session handling.

---

## 🔗 Live Demo

- 🌐 **Frontend**: [https://user-auth-client-9am.vercel.app](https://user-auth-client-9am.vercel.app)
- 🛠 **Backend**: [https://user-auth-server-theta.vercel.app](https://user-auth-server-theta.vercel.app)

---

## 📚 Project Features

### ✅ 1. Signup Page
- Register with:
  - **Username**
  - **Password** (min 8 chars, 1 number, 1 special char)
  - **3 or more shop names**
- Validates global uniqueness of all shop names
- Stores user info securely in MongoDB

---

### 🔐 2. Signin Page
- Login with:
  - Username & Password
  - “Remember Me” option:
    - 7-day session if selected
    - 30-minute session otherwise
- Shows validation messages (e.g., incorrect credentials)

---

### 🧾 3. Dashboard
- Displays after login
- Shows:
  - Logged-in user
  - Profile icon
  - Shop names
- Profile dropdown includes:
  - List of shops
  - Logout (with confirmation popup)

---

### 🏪 4. Shop-Specific Dashboards (Dynamic Subdomains)
- Displays:  
  `"This is <shopname> shop"`
- Works if opened directly in a new tab
- Shows a loading spinner while verifying the token
- Session persists across subdomains via HTTP-only cookies

---

## 🧭 Backend API Endpoints

| Method | Endpoint             | Description                                                |
|--------|----------------------|------------------------------------------------------------|
| POST   | `/api/auth/signup`   | Register a new user with shop validation                   |
| POST   | `/api/auth/signin`   | Login user and return token in HTTP-only cookie            |
| GET    | `/api/auth/verify`   | Verify and decode token from cookie                        |
| POST   | `/api/auth/logout`   | Logout user and clear session cookie                       |

---

## 🛠 Technologies Used

### Frontend (`client/`)
- React.js (Vite)
- React Router
- Axios
- Tailwind CSS (optional)
- Dynamic subdomain handling

### Backend (`server/`)
- Node.js
- Express.js
- MongoDB (Atlas)
- JWT (`jsonwebtoken`)
- dotenv
- cookie-parser
- cors


