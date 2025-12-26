export const formatNumber = (n: number | string, digits = 2): string =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(n));
