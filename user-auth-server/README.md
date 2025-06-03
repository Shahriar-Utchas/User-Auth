# ⚙️ Auth Server - Secure User Authentication API (MERN Stack)

## 🔗 Live Server: [https://your-auth-server.vercel.app](https://user-auth-server-theta.vercel.app/)

---

## 🧠 About the Project

This is the **backend server** for a MERN stack authentication system. It uses **Express.js**, **MongoDB**, and **JWT** to handle secure user registration, login, session persistence via HTTP-only cookies, and logout. Shop names are enforced to be globally unique per user, and sessions persist across subdomains for dynamic shop dashboards.

---

## 🚀 Key Features

- 🧾 **User Signup** with shop uniqueness validation
- 🔐 **Login** with "Remember Me" token option
- 📦 **JWT-based Authentication** using HTTP-only cookies
- 🛡️ **Session Validation** via `/verify`
- 🚪 **Logout** support with secure cookie clearance
- 🌍 **CORS-configured** for cross-domain frontend requests
- ⚙️ **Environment Variable Support** using `.env`

---

## 🧭 API Endpoints

### 🔐 Authentication
| Method | Endpoint             | Description                                                                 |
|--------|----------------------|-----------------------------------------------------------------------------|
| POST   | `/api/auth/signup`   | Register a user with at least 3 unique shop names and a strong password    |
| POST   | `/api/auth/signin`   | Login with JWT cookie, supports "Remember Me" for 7-day token               |
| GET    | `/api/auth/verify`   | Verify and decode token from cookie, returns user session                   |
| POST   | `/api/auth/logout`   | Logout and clear JWT cookie                                                 |
