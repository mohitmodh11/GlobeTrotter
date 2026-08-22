import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTrips } from '../../context/TripContext';
import { useToast } from '../../context/ToastContext';
import { userService } from '../../services/userService';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { CURRENCIES } from '../../utils/constants';
import { IndianRupee } from '../common/IndianRupee';
import { Settings, Tag, Download, RotateCcw, ShieldCheck } from 'lucide-react';

const TRAVEL_STYLE_OPTIONS = [
  'Culture & History',
  'Food & Wine',
  'Nature Trails',
  'Photography',
  'Beaches & Coastal',
  'Solo Backpacking',
  'Luxury Travel',
  'Adventure Sports',
  'Architecture & Design',
  'Wellness & Spa',
];

export const Preferences = () => {
  const { user, updateProfile } = useAuth();
  const { trips, resetToDemoData } = useTrips();
  const { addToast } = useToast();

  const [currency, setCurrency] = useState(user?.currency || 'INR');
  const [units, setUnits] = useState(user?.units || 'km');
  const [selectedStyles, setSelectedStyles] = useState(user?.travelStyles || []);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleToggleStyle = (style) => {
    let updated;
    if (selectedStyles.includes(style)) {
      updated = selectedStyles.filter((s) => s !== style);
    } else {
      updated = [...selectedStyles, style];
    }
    setSelectedStyles(updated);
    updateProfile({ travelStyles: updated });
    addToast('Travel preferences updated', 'info');
  };

  const handleCurrencyChange = (e) => {
    const newCurr = e.target.value;
    setCurrency(newCurr);
    updateProfile({ currency: newCurr });
    addToast(`Preferred currency changed to ${newCurr}`, 'success');
  };

  const handleUnitsChange = (e) => {
    const newUnits = e.target.value;
    setUnits(newUnits);
    updateProfile({ units: newUnits });
    addToast(`Distance units set to ${newUnits}`, 'info');
  };

  const handleExportData = () => {
    const exportObject = {
      user,
      trips,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `globetrotter_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('All itinerary & profile data exported as JSON!', 'success');
  };

  const handleResetData = () => {
    resetToDemoData();
    addToast('All sample trips restored to initial demo state!', 'success');
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="section-header" style={{ marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Travel Planning Preferences & Data
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Customize units, currency, travel style tags, and manage local data
          </p>
        </div>
      </div>

      {/* Regional Formats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="pref-currency">
            Default Currency
          </label>
          <select
            id="pref-currency"
            className="form-select"
            value={currency}
            onChange={handleCurrencyChange}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="pref-units">
            Distance Units
          </label>
          <select
            id="pref-units"
            className="form-select"
            value={units}
            onChange={handleUnitsChange}
          >
            <option value="km">Kilometers (km)</option>
            <option value="miles">Miles (mi)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="pref-language">
            Language
          </label>
          <select
            id="pref-language"
            className="form-select"
            value={user?.language || 'en'}
            onChange={async (e) => {
              const newLang = e.target.value;
              updateProfile({ language: newLang });
              try {
                await userService.changeLanguage(newLang).catch(() => {});
              } catch (err) {
                console.warn('Language sync error:', err);
              }
              addToast(`Language updated to ${newLang.toUpperCase()}`, 'info');
            }}
          >
            <option value="en">English (en)</option>
            <option value="hi">हिंदी (hi)</option>
            <option value="gu">ગુજરાતી (gu)</option>
          </select>
        </div>
      </div>

      {/* Travel Style Tags */}
      <div style={{ marginBottom: '28px' }}>
        <label className="form-label" style={{ marginBottom: '10px' }}>
          Travel Interests & Personal Style Tags
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {TRAVEL_STYLE_OPTIONS.map((style) => {
            const isSelected = selectedStyles.includes(style);
            return (
              <button
                key={style}
                type="button"
                onClick={() => handleToggleStyle(style)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: '1px solid',
                  borderColor: isSelected ? '#15803d' : '#cbd5e1',
                  backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                  color: isSelected ? '#15803d' : '#475569',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isSelected ? '✓ ' : '+ '}
                {style}
              </button>
            );
          })}
        </div>
      </div>

      {/* Data Management Section */}
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
        <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
          Data Portability & Reset
        </h4>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={handleExportData}
          >
            Export All Data (JSON)
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={RotateCcw}
            onClick={() => setIsResetModalOpen(true)}
          >
            Reset Demo Data
          </Button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetData}
        title="Reset All Travel Data"
        message="This will reset all your current itineraries, stops, and expenses back to the initial demo trips. Are you sure?"
        confirmText="Reset Everything"
      />
    </div>
  );
};
