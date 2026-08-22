import { CURRENCIES } from './constants';

export const formatCurrency = (amount, currencyCode = 'INR') => {
  const numericAmount = Number(amount) || 0;
  const currencyObj = CURRENCIES.find((c) => c.code === currencyCode) || { symbol: '₹' };
  
  try {
    const locale = currencyCode === 'INR' ? 'en-IN' : 'en-US';
    return `${currencyObj.symbol}${numericAmount.toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  } catch {
    return `${currencyObj.symbol}${numericAmount.toFixed(0)}`;
  }
};

export const getCurrencySymbol = (currencyCode = 'INR') => {
  const currencyObj = CURRENCIES.find((c) => c.code === currencyCode);
  return currencyObj ? currencyObj.symbol : '₹';
};
