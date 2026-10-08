import React, { useState } from 'react';

export default function ExpenseList({ expenses, onDeleteExpense }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  const filtered = expenses.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'ALL' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(val || 0);
  };

  return (
    <div className="content-card">
      <div className="card-header">
        <div>
          <h3>Expense History</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing {filtered.length} of {expenses.length} records
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="text"
            className="form-input"
            style={{ width: '180px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select"
            style={{ width: '140px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Books">Books</option>
            <option value="Fees">Fees</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        {filtered.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>🔍 No expenses found</p>
            <p style={{ fontSize: '0.85rem' }}>Add a new expense or adjust your filters above.</p>
          </div>
        ) : (
          <table className="expense-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Amount</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    {item.description && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`badge-category cat-${item.category || 'Other'}`}>
                      {item.category || 'Other'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {item.expenseDate}
                  </td>
                  <td className="amount-col">
                    {formatINR(item.amount)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn-danger-ghost"
                      onClick={() => onDeleteExpense(item.id)}
                      title="Delete expense"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
