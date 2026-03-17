# Notepad 📝

Notepad is a full-stack **Note Taking Web Application** that allows users to securely create, manage, update, and delete notes.  
It is built using modern web technologies with authentication and a clean UI.

---

## 🚀 Features

- User Authentication (Register & Login)
- Secure JWT-based authorization
- Create, Read, Update, Delete (CRUD) notes
- Protected routes for authenticated users
- Clean and simple UI
- RESTful API architecture

---

## 🛠️ Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)

---

## 📂 Project Structure

notepad/
│
├── backend/
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ │ ├── authController.js
│ │ └── notesDashController.js
│ ├── middleware/
│ │ └── auth.js
│ ├── models/
│ ├── routes/
│ └── server.js
│
├── frontend/
│ ├── index.html
│ └── styles.css
│
└── README.md

## ⚙️ Installation & Setup

 1️⃣ Clone the repository

git clone https://github.com/17gungunverma/notepad_project.git

2️⃣ Navigate to project directory

cd notepad

3️⃣ Install backend dependencies

cd backend

npm install

4️⃣ Configure environment variables

Create a .env file in backend/ and add:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

5️⃣ Run the backend server

npm start

6️⃣ Open frontend

Open frontend/index.html in your browser.
