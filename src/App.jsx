import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import StatsCards from './components/StatsCards';
import ExpenseList from './components/ExpenseList';
import CategoryBreakdown from './components/CategoryBreakdown';
import AddExpenseModal from './components/AddExpenseModal';
import { api } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, monthlyTotal: 0, expenseCount: 0, categoryTotals: {} });
  const [expenses, setExpenses] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const existingUser = api.getUser();
      if (existingUser) {
        setUser(existingUser);
        loadData();
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Error initializing user:", err);
      setLoading(false);
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [expList, dashboardStats] = await Promise.all([
        api.getExpenses(),
        api.getDashboard()
      ]);
      setExpenses(expList);
      setStats(dashboardStats);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (loginData) => {
    setUser({ name: loginData.name, email: loginData.email });
    loadData();
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setExpenses([]);
    setStats({ total: 0, monthlyTotal: 0, expenseCount: 0, categoryTotals: {} });
  };

  const handleAddExpense = async (expenseData) => {
    await api.addExpense(expenseData);
    await loadData();
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    await api.deleteExpense(id);
    await loadData();
  };

  if (!user) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div>
      <Navbar
        user={user}
        onLogout={handleLogout}
        onOpenAdd={() => setIsAddOpen(true)}
      />

      <main className="main-container">
        <StatsCards stats={stats} />

        <div className="dashboard-grid">
          <div>
            <ExpenseList
              expenses={expenses}
              onDeleteExpense={handleDeleteExpense}
            />
          </div>

          <div>
            <CategoryBreakdown
              categoryTotals={stats?.categoryTotals}
              total={stats?.total}
            />

            <div className="content-card" style={{ background: '#f8fafc', borderStyle: 'dashed' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.4rem', color: '#334155' }}>
                🎓 Academic Submission Info
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                <strong>Project:</strong> Student Expense Tracker<br />
                <strong>Architecture:</strong> Decoupled React Frontend + Spring Boot REST APIs with MySQL & JWT.
              </p>
            </div>
          </div>
        </div>
      </main>

      <AddExpenseModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddExpense={handleAddExpense}
      />
    </div>
  );
}
