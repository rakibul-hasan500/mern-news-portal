# MERN News Portal

A complete **MERN News Portal** project where the backend is built with **Node.js, Express, MongoDB**, the user panel is built with **Next.js**, and the admin dashboard is built with **React.js**.

---

## 🚀 Features

### ✅ Authentication & Security
- JWT Authentication (Access Token)
- Email OTP Verification (Register + Verify)
- Resend OTP
- Forgot Password with OTP
- Reset Password
- Protected Routes
- Role Based Access Control (RBAC)

### 👥 Roles
- **User**
- **Writer**
- **Editor**
- **Admin**

### 📰 News System
- Create News (Writer)
- Edit News (Writer/Editor)
- Approve / Reject News (Editor/Admin)
- Publish News (after approval)
- News Categories
- Search News by Title/Tags

### 👍👎 Interactions
- Like / Dislike News
- Comment on News
- Reply to Comments
- Like / Dislike Comments
- Delete Own Comment (User)
- Admin can delete any comment/news

### 🛠 Admin Dashboard
- Manage Users
- Manage News
- Approvals Panel
- Manage Categories
- Role Management (Admin)

---

## 🧰 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- Nodemailer
- bcrypt

### Frontend (User Panel)
- Next.js
- React.js
- Tailwind CSS
- Redux Toolkit
- RTK Query

### Admin Dashboard
- React.js
- Tailwind CSS (optional)
- Redux Toolkit
- RTK Query

---

## ⚡ How to Run

### 1️⃣ Backend
```bash
cd backend
npm install
# Fill your environment variables in .env
npm run dev

---

2️⃣ Frontend (User Panel)
cd frontend
npm install
npm run build
# Fill your environment variables in .env
npm run dev

---

3️⃣ Admin Dashboard
cd dashboard
npm install
npm start
