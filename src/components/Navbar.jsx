import React from 'react';

export default function Navbar({ user, isDemo, onLogout, onOpenAdd }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="brand">
          <div className="brand-icon">₹</div>
          <div>
            <span>Student Expense Tracker</span>
          </div>
          <span className="badge-tag">React + Spring Boot</span>
          {isDemo && (
            <span className="badge-tag" style={{ background: '#fef3c7', color: '#b45309' }}>
              Preview / Demo Mode
            </span>
          )}
        </div>

        {user && (
          <div className="nav-actions">
            <div className="user-badge">
              <span>Student:</span>
              <strong>{user.name}</strong>
            </div>
            <button className="btn btn-primary btn-sm" onClick={onOpenAdd}>
              + Add Expense
            </button>
            <button className="btn btn-outline btn-sm" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
