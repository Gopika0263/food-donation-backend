````markdown
# Food Donation Backend

This is the **backend** for the Food Donation project using the **MERN stack**.

---

## Features
- User authentication with JWT
- CRUD operations for donations
- MongoDB Atlas database integration
- CORS configured for frontend

---

## Live Backend URL
[https://food-donation-backend-b8wx.onrender.com](https://food-donation-backend-b8wx.onrender.com)

---

## Frontend URL
[https://donation-frontend-coral.vercel.app](https://donation-frontend-coral.vercel.app)

---

## Environment Variables

Create a `.env` file in the backend folder with the following:

```env
PORT=5000
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=your-jwt-secret
````

> **Note:** Do **not** push `.env` to GitHub. Add `.env` to `.gitignore`.

---

## Installation & Running Locally

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Or run in production mode
npm start
```

* Backend will run on: `http://localhost:5000` (or PORT from .env)
* Make sure MongoDB Atlas is connected.

---

## Deployment

* **Backend:** [Render](https://render.com)
* **Frontend:** [Vercel](https://vercel.com)
* Auto-deploy configured via GitHub

---

## GitHub Repo

* [Backend Repository](https://github.com/Gopika0263/food-donation-backend)
* [Frontend Repository](https://github.com/Gopika0263/donation-frontend)

````

---

### 🔹 Next Step

1. Save this as `README.md` in `food-donation-backend` folder.  
2. Push to GitHub:

```bash
git add README.md
git commit -m "Add complete README"
git push origin main
````

