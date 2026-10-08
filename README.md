# Student Expense Tracker - Frontend (React + Vite)

A modern, responsive React web application for the **Student Expense Tracker** system. It connects to the Spring Boot REST API backend with JWT authentication.

## Features
- **Student Authentication**: Secure Register & Login using JWT tokens.
- **Interactive Dashboard**:
  - Live financial overview: Total Spending (₹), This Month Spending (₹), and Expense Count.
  - Visual category breakdown with spending percentages.
- **Expense Operations (CRUD)**:
  - Add expenses categorized under Food, Travel, Books, Fees, Entertainment, Shopping, etc.
  - Real-time search and filter by category or title.
  - Delete expenses with instant stat recalculation.
- **Evaluation Preview / Demo Mode**: Built-in graceful fallback so faculty reviewers can interact with all UI features even when reviewing asynchronously.

## Tech Stack
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Modern CSS3 (Plus Jakarta Sans, responsive grid & card architecture)
- **Deployment**: Vercel / Netlify / Render

## Local Setup & Run

1. **Clone repository**:
   ```bash
   git clone https://github.com/snehalreddygangidi-wq/student-expense-tracker-frontend.git
   cd student-expense-tracker-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Production Build**:
   ```bash
   npm run build
   ```

## Connect to Backend
By default, the Vite development proxy forwards `/api` requests to `http://localhost:8080`.
For production deployment, configure the backend API URL using:
```env
VITE_API_BASE_URL=https://your-backend-api-url.com
```
