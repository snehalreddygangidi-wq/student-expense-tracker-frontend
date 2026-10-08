import React from 'react';

export default function StatsCards({ stats }) {
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val || 0);
  };

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-info">
          <span>Total Spending</span>
          <h2>{formatINR(stats?.total)}</h2>
        </div>
        <div className="stat-icon-badge icon-purple">
          ₹
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <span>This Month</span>
          <h2>{formatINR(stats?.monthlyTotal)}</h2>
        </div>
        <div className="stat-icon-badge icon-green">
          📅
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <span>Total Expenses</span>
          <h2>{stats?.expenseCount || 0}</h2>
        </div>
        <div className="stat-icon-badge icon-blue">
          📊
        </div>
      </div>
    </div>
  );
}
