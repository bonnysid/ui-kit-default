export const formatNumber = (
  n: number | string,
  digits = 2,
  locales: Intl.LocalesArgument = 'ru-RU',
): string => {
  const nStr = String(n);
  const dotIndex = nStr.indexOf('.');
  const trunkedNum = dotIndex !== -1 ? nStr.slice(0, dotIndex + digits + 1) : nStr;

  return new Intl.NumberFormat(locales, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(trunkedNum));
};
