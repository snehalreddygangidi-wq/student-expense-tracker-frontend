// API Service for Student Expense Tracker

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const STORAGE_EXPENSES_KEY = "student_expenses";
const STORAGE_USERS_KEY = "registered_users";

const getInitialExpenses = () => [
  { id: 1, title: "College Semester Books", amount: 1200, category: "Books", expenseDate: new Date().toISOString().split('T')[0], description: "Data Structures & Java Textbooks" },
  { id: 2, title: "Monthly Bus Pass", amount: 650, category: "Travel", expenseDate: new Date().toISOString().split('T')[0], description: "RTC College Route" },
  { id: 3, title: "Cafeteria Lunch", amount: 140, category: "Food", expenseDate: new Date().toISOString().split('T')[0], description: "Meals with classmates" },
  { id: 4, title: "Exam Fee", amount: 2500, category: "Fees", expenseDate: new Date().toISOString().split('T')[0], description: "Mid-term examination fee" },
];

function getLocalExpenses() {
  const data = localStorage.getItem(STORAGE_EXPENSES_KEY);
  if (!data) {
    const initial = getInitialExpenses();
    localStorage.setItem(STORAGE_EXPENSES_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch {
    return getInitialExpenses();
  }
}

function saveLocalExpenses(expenses) {
  localStorage.setItem(STORAGE_EXPENSES_KEY, JSON.stringify(expenses));
}

function computeDashboard(expenses) {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthlyTotal = expenses
    .filter(e => e.expenseDate && e.expenseDate.startsWith(currentMonth))
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  
  const categoryTotals = {};
  expenses.forEach(e => {
    const cat = e.category || "Other";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(e.amount || 0);
  });

  return {
    total,
    monthlyTotal: monthlyTotal || total,
    expenseCount: expenses.length,
    categoryTotals
  };
}

export const api = {
  getToken() {
    return localStorage.getItem("jwt");
  },

  getUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  async register(name, email, password) {
    if (BASE_URL) {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });
        if (res.ok) {
          return await res.json();
        }
        const errJson = await res.json().catch(() => null);
        if (errJson && errJson.message) {
          throw new Error(errJson.message);
        }
      } catch (err) {
        if (!err.message.includes("fetch") && err.name !== "TypeError") {
          throw err;
        }
      }
    }

    // Seamless client-side registration for deployed frontend
    const users = JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || "[]");
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      existing.password = password;
      existing.name = name;
    } else {
      users.push({ name, email, password });
    }
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

    return {
      message: "Account created successfully! Please sign in with your email and password.",
      name
    };
  },

  async login(email, password) {
    if (BASE_URL) {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
          return data;
        }
        const errJson = await res.json().catch(() => null);
        if (errJson && errJson.message) {
          throw new Error(errJson.message);
        }
      } catch (err) {
        if (!err.message.includes("fetch") && err.name !== "TypeError") {
          throw err;
        }
      }
    }

    // Seamless client-side login for deployed frontend
    const users = JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || "[]");
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    let studentName = matched?.name;

    if (!studentName) {
      const emailPrefix = email.split('@')[0] || "Student";
      studentName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    }

    const token = "jwt-student-token-" + Date.now();
    localStorage.setItem("jwt", token);
    localStorage.setItem("user", JSON.stringify({ name: studentName, email }));

    return {
      message: "Login successful.",
      name: studentName,
      email,
      token
    };
  },

  logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
  },

  async getExpenses() {
    if (BASE_URL) {
      try {
        const res = await fetch(`${BASE_URL}/api/expenses`, {
          headers: {
            "Authorization": `Bearer ${this.getToken()}`
          }
        });
        if (res.ok) return await res.json();
      } catch {
        // Fallback to local storage
      }
    }
    return getLocalExpenses();
  },

  async addExpense(expense) {
    if (BASE_URL) {
      try {
        const res = await fetch(`${BASE_URL}/api/expenses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.getToken()}`
          },
          body: JSON.stringify(expense)
        });
        if (res.ok) return await res.json();
      } catch {
        // Fallback to local storage
      }
    }

    const list = getLocalExpenses();
    const newEntry = {
      ...expense,
      id: Date.now(),
      amount: Number(expense.amount)
    };
    list.unshift(newEntry);
    saveLocalExpenses(list);
    return newEntry;
  },

  async deleteExpense(id) {
    if (BASE_URL) {
      try {
        const res = await fetch(`${BASE_URL}/api/expenses/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${this.getToken()}`
          }
        });
        if (res.ok) return true;
      } catch {
        // Fallback to local storage
      }
    }

    const list = getLocalExpenses().filter(e => e.id !== id);
    saveLocalExpenses(list);
    return true;
  },

  async getDashboard() {
    if (BASE_URL) {
      try {
        const res = await fetch(`${BASE_URL}/api/dashboard`, {
          headers: {
            "Authorization": `Bearer ${this.getToken()}`
          }
        });
        if (res.ok) return await res.json();
      } catch {
        // Fallback to local storage
      }
    }

    return computeDashboard(getLocalExpenses());
  }
};
