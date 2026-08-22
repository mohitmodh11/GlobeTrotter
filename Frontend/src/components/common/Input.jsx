import React from 'react';

export const Input = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  hint,
  required = false,
  optional = false,
  className = '',
  icon: Icon,
  prefix,
  ...props
}) => {
  const hasLeading = Icon || prefix;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          <span>
            {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
          </span>
          {optional && <span className="optional">(Optional)</span>}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        {hasLeading && (
          <div
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#15803d',
              fontWeight: 700,
              fontSize: '0.9375rem',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
            }}
          >
            {prefix ? prefix : Icon && <Icon size={16} color="#64748b" />}
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="form-input"
          style={{
            paddingLeft: hasLeading ? '36px' : '14px',
            borderColor: error ? '#fca5a5' : undefined,
          }}
          required={required}
          {...props}
        />
      </div>
      {hint && !error && <span className="form-hint">{hint}</span>}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};
