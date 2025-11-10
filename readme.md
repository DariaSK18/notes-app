# Notes App 𓂃✍︎

A full-stack note-taking application built with **Node.js**, **Express**, **MongoDB**, **EJS**, and **Vanilla JavaScript**. Users can register, log in, create, edit, and delete their own notes. Each user’s notes are private.

Deployed on Render: [https://notes-app-7rz1.onrender.com](https://notes-app-7rz1.onrender.com)

---

## Features

- User **registration** and **login** (passwords are hashed with bcrypt)
- **CRUD operations** for notes (Create, Read, Update, Delete)
- Notes are **stored per user** in MongoDB
- **User session management** with cookies
- Frontend built using **EJS templates** and vanilla JS
- Responsive UI

---

## Technologies Used

- **Backend:** Node.js, Express.js
- **Frontend:** EJS, HTML, CSS, Vanilla JavaScript
- **Database:** MongoDB (via Mongoose)
- **Authentication:** Passport.js, bcrypt
- **Deployment:** Render.com

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/DariaSK18/notes-app.git
cd notes-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file in the root directory and add:

```bash
MONGO_URI=your_mongodb_connection_string
COOKIE_SECRET=your_random_cookie_secret
PORT=3000
```

4. Start the server:

```bash
npm start
```

5. Open your browser and go to http://localhost:3000

## Author

Daria Steblovska

- Contact: [darias1896.96@gmail.com](mailto:darias1896.96@gmail.com)
