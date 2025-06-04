# ⚙️ Auth Client - MERN Stack Authentication Frontend

## 🔗 Live Client: [https://user-auth-client-9am.vercel.app](https://user-auth-client-9am.vercel.app)



## 🧠 About the Project

This is the **frontend** for a secure authentication system built with **React (Vite)**. It handles user registration, login, session verification, and personalized dashboards based on shop names. It supports **cross-subdomain authentication** and stores JWT tokens in **HTTP-only cookies** for maximum security.

---

## 🚀 Key Features

- 📝 **Signup Form** with:
  - Username
  - Strong password requirement
  - Minimum 3 shop names

- 🔐 **Login Form** with:
  - “Remember Me” session option
  - Validations and error messages

- 🧾 **Dashboard**:
  - Displays user info and shop names
  - Profile icon with logout functionality

- 🏪 **Dynamic Subdomain Routing**:

- 🔄 **Session Persistence**:
  - Token verified on page load
  - Auth works across subdomains and new tabs
  - Loading spinner shown during token validation

---

## 🧭 Route Structure

| Route                         | Description                                 |
|------------------------------|---------------------------------------------|
| `/signup`                    | User registration page                      |
| `/signin`                    | User login page                             |
| `/dashboard`                 | Main user dashboard                         |
| `http://<shop>.localhost:5173` | Shop-specific dashboard (dynamic subdomain) |

---

## 📁 Folder Structure
client/
├── src/
│ ├── pages/ # Signup, Signin, Dashboard, Shop
│ ├── Context/ # Auth context
│ ├── Routes/ # Routes setup , private routes
│ ├── main.jsx
├── public/
├── .env
├── package.json
