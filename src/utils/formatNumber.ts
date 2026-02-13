export const formatNumber = (n: number | string, digits = 2): string => {
  const nStr = String(n);
  const trunkedNum = nStr.slice(0, nStr.indexOf('.') + digits + 1);

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(trunkedNum));
};
