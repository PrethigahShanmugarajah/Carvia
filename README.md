# 🚗 Carvia – Full Stack Car Rental Booking App (React + Node + Express + MySQL)

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green?logo=node.js)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql)](https://www.mysql.com/)
[![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey?logo=express)](https://expressjs.com/)
[![ImageKit](https://img.shields.io/badge/ImageKit-Image%20Upload-orange?logo=imagekit)](https://imagekit.io/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-critical?logo=jsonwebtokens)](https://jwt.io/)

**Carvia** is a **Full Stack Car Rental Booking Application** built using **React, Node.js, Express, and MySQL**.  
The system allows **users** to browse, filter, and rent cars online, while **owners** can manage cars and bookings.  
It includes **JWT authentication**, **ImageKit image hosting**, and a smooth, responsive frontend interface.

---

## ✨ Features

### 🚘 User Portal

- Register and log in securely using JWT
- Browse available cars with filters (brand, category, fuel type, etc.)
- View detailed car information
- Book cars for selected dates
- Manage and view all bookings
- Responsive, modern, and animated UI

### 👨‍💼 Owner (Admin) Portal

- Add, edit, and delete car listings
- Manage all bookings and cars
- Dashboard with summarized data
- Upload and manage car images via **ImageKit**
- Fully secure authentication and authorization

---

## 🛠️ Technologies Used

### ⚛️ Frontend

- React.js (Vite)
- Axios (API communication)
- React Router DOM
- Tailwind CSS / Custom CSS
- Framer Motion (animations)

### 🧩 Backend

- Node.js
- Express.js
- MySQL Database
- Sequelize ORM
- Multer (file upload)
- ImageKit (image hosting)
- JWT (authentication)
- bcrypt (password hashing)
- dotenv (environment configuration)

### 🗄️ Database

- MySQL (via XAMPP / phpMyAdmin or MySQL Workbench)

---

## ⚙️ How to Run the Project

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/PrethigahShanmugarajah/Carvia.git
cd Carvia
```

---

### 2️⃣ Backend Setup

```bash
cd Server
npm install
npm run server
```

> 💡 Make sure your MySQL server is running (via **XAMPP** or **MySQL Workbench**).
> Create a database named **carvia** before starting the backend.

---

### 3️⃣ Frontend Setup

```bash
cd Client
npm install
npm run dev
```

Your frontend will start on [http://localhost:5173](http://localhost:5173).

---

## 🔑 Environment Variables Setup

### 📂 Backend `.env`

Create a `.env` file inside the **Server/** directory:

```
# Database Configuration
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=carvia
DB_PORT=

# JWT Configuration
JWT_SECRET=
JWT_EXPIRES_IN=

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=''
IMAGEKIT_PRIVATE_KEY=''
IMAGEKIT_URL_ENDPOINT=''
```

---

### 📂 Frontend `.env`

Create a `.env` file inside the **Client/** directory:

```
VITE_CURRENCY=
VITE_BASE_URL=
```

---

## 🧠 References

📺 [Reference Video](https://youtu.be/tBObk72EYYw?si=8dLYDCK6aLUkPAb1)

This project was inspired by modern full-stack web applications and enhanced to use **MySQL + ImageKit** for real-world performance.
It follows best practices in structure, authentication, and deployment workflow.

---

## 📎 Project Link

[GitHub Repository](https://github.com/PrethigahShanmugarajah/Carvia.git)

---

## 👨‍💻 Author

**Prethigah Shanmugarajah**
Department of Software Engineering, Faculty of Computing (2020/2021)
Sabaragamuwa University of Sri Lanka

---

## 🏁 Summary

Carvia demonstrates a complete **Full Stack Web Application** with:

- Secure authentication
- Dynamic data handling
- Image upload integration
- User and owner management portals

It provides a real-world **Car Rental Booking System** experience for both users and car owners.

---
