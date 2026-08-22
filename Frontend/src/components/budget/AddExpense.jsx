import React, { useState } from 'react';
import { useTrips } from '../../context/TripContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { getCurrencySymbol } from '../../utils/formatCurrency';
import { Calendar, FileText, Plus } from 'lucide-react';

export const AddExpense = ({ isOpen, onClose, tripId, currency = 'INR' }) => {
  const { addExpense } = useTrips();
  const { addToast } = useToast();

  const today = new Date().toISOString().split('T')[0];
  const [category, setCategory] = useState('food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(today);

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      addToast('Please enter a valid expense amount', 'error');
      return;
    }
    if (!description.trim()) {
      addToast('Please enter a description for this expense', 'error');
      return;
    }

    addExpense(tripId, {
      category,
      amount: numericAmount,
      description: description.trim(),
      date,
    });

    addToast(`Logged expense of ${getCurrencySymbol(currency)}${numericAmount}`, 'success');

    // Reset & Close
    setAmount('');
    setDescription('');
    setDate(today);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Trip Expense"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} icon={Plus}>
            Save Expense
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="exp-category">
            Expense Category
          </label>
          <select
            id="exp-category"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label={`Expense Amount (${getCurrencySymbol(currency)})`}
          id="exp-amount"
          type="number"
          min="1"
          step="any"
          placeholder="e.g. 2500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          prefix={getCurrencySymbol(currency)}
          required
        />

        <Input
          label="Description / Purpose"
          id="exp-description"
          placeholder="e.g. Airport Taxi or Train passes"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          icon={FileText}
          required
        />

        <Input
          label="Date of Expense"
          id="exp-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          icon={Calendar}
          required
        />
      </form>
    </Modal>
  );
};
