import React from 'react';

export default function CategoryBreakdown({ categoryTotals, total }) {
  const entries = Object.entries(categoryTotals || {});
  const safeTotal = total > 0 ? total : 1;

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const getBarColor = (cat) => {
    switch (cat) {
      case 'Food': return '#f59e0b';
      case 'Travel': return '#0284c7';
      case 'Books': return '#10b981';
      case 'Fees': return '#8b5cf6';
      case 'Entertainment': return '#f43f5e';
      case 'Shopping': return '#ea580c';
      default: return '#64748b';
    }
  };

  return (
    <div className="content-card">
      <div className="card-header">
        <h3>Category Breakdown</h3>
      </div>

      {entries.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem 0' }}>
          No category spending recorded yet.
        </p>
      ) : (
        entries.map(([category, amount]) => {
          const percent = Math.min(100, Math.round((amount / safeTotal) * 100));
          return (
            <div key={category} className="category-item">
              <div className="category-labels">
                <span>{category}</span>
                <span>
                  {formatINR(amount)}{' '}
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>({percent}%)</span>
                </span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: getBarColor(category)
                  }}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
