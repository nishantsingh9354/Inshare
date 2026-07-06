# Inshare — Instant File Sharing

Upload any file and get an instant shareable download link — no login required.

Built with **React**, **Node.js**, **Express**, and **MongoDB Atlas**.

---

## ✨ Features

- **Drag & drop** or click to upload (up to 10 MB)
- Instant shareable download links that work for anyone
- One-click **copy to clipboard**
- Files stored in MongoDB Atlas — no filesystem dependency
- Deployable on **Vercel** as a single project

---

## 🛠️ Tech Stack

| Layer    | Technology                            |
| -------- | ------------------------------------- |
| Frontend | React 18, CSS (glassmorphism dark UI) |
| Backend  | Node.js, Express, Multer             |
| Database | MongoDB Atlas (Mongoose ODM)          |
| Deploy   | Vercel (fullstack via `vercel.json`)  |

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nishantsingh9354/Inshare.git
cd Inshare
```

### 2. Set up environment variables

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=8000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/inshare
```

### 3. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 4. Run locally

```bash
# Terminal 1 — Backend
cd server
npm start

# Terminal 2 — Frontend
cd client
npm start
```

Open **http://localhost:3000**

---

## 🚀 Deploy to Vercel

1. Push code to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add `MONGO_URI` as an environment variable in Vercel's dashboard
4. Deploy — your links will use your Vercel domain automatically

---

## 📁 Project Structure

```
Inshare/
├── client/                  # React frontend
│   └── src/
│       ├── App.js           # Main UI component
│       ├── App.css          # Glassmorphism dark theme
│       └── service/api.js   # API client
├── server/                  # Express backend
│   ├── controller/          # Upload & download handlers
│   ├── database/            # MongoDB connection
│   ├── models/              # Mongoose schema (stores files as Buffer)
│   ├── routes/              # API routes
│   ├── utils/               # Multer config (memory storage)
│   ├── server.js            # Entry point
│   └── .env.example         # Environment variable template
├── vercel.json              # Vercel deployment config
└── README.md
```

---

## 📡 API Endpoints

| Method | Endpoint         | Description                        |
| ------ | ---------------- | ---------------------------------- |
| POST   | `/upload`        | Upload a file (multipart form)     |
| GET    | `/file/:fileId`  | Download a file by its MongoDB ID  |

---

## 📝 License

ISC
