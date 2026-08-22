import React, { useState } from 'react';
import { useTrips } from '../../context/TripContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateUtils';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { Trash2, Plus, Receipt, Filter } from 'lucide-react';

export const CostBreakdown = ({ trip, onOpenAddExpense }) => {
  const { deleteExpense } = useTrips();
  const { addToast } = useToast();
  const [filterCategory, setFilterCategory] = useState('ALL');

  const expenses = trip.expenses || [];

  const filteredExpenses = expenses.filter((e) => {
    if (filterCategory !== 'ALL' && e.category !== filterCategory) return false;
    return true;
  });

  const handleDeleteExpense = (expId) => {
    deleteExpense(trip.id, expId);
    addToast('Expense removed', 'info');
  };

  const getCategoryLabel = (catId) => {
    const cat = EXPENSE_CATEGORIES.find((c) => c.id === catId);
    return cat ? cat.label : catId;
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Logged Expenses & Receipts
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Detailed breakdown of individual expenditures
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            className="form-select"
            style={{ padding: '6px 12px', fontSize: '0.8125rem', width: 'auto' }}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={onOpenAddExpense}
          >
            Add Expense
          </Button>
        </div>
      </div>

      {filteredExpenses.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>Date</th>
                <th style={{ padding: '10px 12px' }}>Description</th>
                <th style={{ padding: '10px 12px' }}>Category</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', width: '50px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => (
                <tr
                  key={exp.id}
                  style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '12px', color: '#64748b' }}>
                    {formatDate(exp.date)}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#0f172a' }}>
                    {exp.description}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: '#f0fdf4',
                        color: '#15803d',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: '1px solid #bbf7d0',
                      }}
                    >
                      {getCategoryLabel(exp.category)}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#15803d' }}>
                    {formatCurrency(exp.amount, trip.currency)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#dc2626',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                      title="Delete expense"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          style={{
            padding: '30px',
            textAlign: 'center',
            backgroundColor: '#f8fafc',
            borderRadius: '10px',
            color: '#94a3b8',
            fontSize: '0.875rem',
          }}
        >
          No logged expenses recorded in this category yet.
        </div>
      )}
    </div>
  );
};
