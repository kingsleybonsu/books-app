# Simple MERN Books App

A small MERN assignment: Sign Up, Login, and a CRUD Books homepage.

## Features
- User Sign Up
- User Login with JWT
- Protected Books page
- Add book: title, author, year
- Edit book
- Delete book
- MongoDB persistence
- Ready for Render (backend) and Vercel (frontend)

## 1. Backend setup

Open a terminal:

```bash
cd backend
npm install
```

Create `backend/.env` by copying the example file:

PowerShell:

```powershell
Copy-Item .env.example .env
```

Then edit `backend/.env` and set your MongoDB Atlas connection string and a long,
random JWT secret:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
JWT_SECRET=change_this_to_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

The backend will not start until `MONGO_URI` and `JWT_SECRET` are set. Do not
commit `backend/.env` or put these values in the frontend.

Start backend:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`.

## 2. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

The frontend uses `VITE_API_URL=http://localhost:5000/api` by default.

For Vercel, create a frontend environment variable:

```env
VITE_API_URL=https://YOUR-RENDER-BACKEND.onrender.com/api
```

Then deploy the `frontend` folder to Vercel.

## 3. MongoDB Atlas

Create a MongoDB Atlas cluster and database user. Put the connection string in `MONGO_URI`.

Example:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/books_app
```

For a quick classroom demo, make sure your Atlas network access allows the deployed backend to connect.

## 4. Deploy backend to Render

Create a new Web Service from the project repository.

Set:
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

Environment variables:
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL` = your Vercel frontend URL
- `PORT` can be omitted because Render provides it

After deployment, copy the Render URL and use:

```env
VITE_API_URL=https://YOUR-RENDER-URL.onrender.com/api
```

in Vercel.

## 5. Deploy frontend to Vercel

Create a new Vercel project.

Set:
- Root Directory: `frontend`
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

Environment variable:

```env
VITE_API_URL=https://YOUR-RENDER-URL.onrender.com/api
```

Redeploy after setting the variable.

## Important

Do NOT put MongoDB passwords or JWT secrets inside React/frontend code. They belong only in backend environment variables.
