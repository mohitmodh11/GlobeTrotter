import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';

export const BudgetChart = ({ categoryBreakdown = [], currency = 'INR' }) => {
  const total = categoryBreakdown.reduce((acc, cat) => acc + (cat.amount || 0), 0);

  if (total <= 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '200px',
          color: '#94a3b8',
          fontSize: '0.875rem',
          fontStyle: 'italic',
        }}
      >
        No expense data recorded yet for chart.
      </div>
    );
  }

  // Generate SVG Donut slices
  let cumulativeAngle = 0;
  const slices = categoryBreakdown
    .filter((cat) => cat.amount > 0)
    .map((cat) => {
      const percentage = cat.amount / total;
      const angle = percentage * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;
      cumulativeAngle += angle;

      // Coordinate calculations for SVG donut
      const radStart = (startAngle - 90) * (Math.PI / 180);
      const radEnd = (endAngle - 90) * (Math.PI / 180);

      const rOuter = 85;
      const rInner = 55;
      const cx = 110;
      const cy = 110;

      const x1 = cx + rOuter * Math.cos(radStart);
      const y1 = cy + rOuter * Math.sin(radStart);
      const x2 = cx + rOuter * Math.cos(radEnd);
      const y2 = cy + rOuter * Math.sin(radEnd);

      const x3 = cx + rInner * Math.cos(radEnd);
      const y3 = cy + rInner * Math.sin(radEnd);
      const x4 = cx + rInner * Math.cos(radStart);
      const y4 = cy + rInner * Math.sin(radStart);

      const largeArc = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${x1} ${y1}`,
        `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4}`,
        'Z',
      ].join(' ');

      return {
        ...cat,
        percentage: Math.round(percentage * 100),
        pathData,
      };
    });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '10px 0',
      }}
    >
      {/* SVG Donut */}
      <div style={{ position: 'relative', width: '220px', height: '220px' }}>
        <svg width="220" height="220" viewBox="0 0 220 220">
          {slices.map((slice, idx) => (
            <path
              key={idx}
              d={slice.pathData}
              fill={slice.color}
              stroke="#ffffff"
              strokeWidth="2"
            >
              <title>{`${slice.label}: ${formatCurrency(slice.amount, currency)} (${slice.percentage}%)`}</title>
            </path>
          ))}
        </svg>

        {/* Center Total Text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
            Total Est.
          </span>
          <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a' }}>
            {formatCurrency(total, currency)}
          </span>
        </div>
      </div>

      {/* Legend & Percentages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '200px' }}>
        {slices.map((slice, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  backgroundColor: slice.color,
                }}
              />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>
                {slice.label}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                {formatCurrency(slice.amount, currency)}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '4px' }}>
                ({slice.percentage}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
