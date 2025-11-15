export const convertScientificNumberToString = (num: number) => {
  const numStr = String(num);

  if (numStr.includes('e')) {
    const [mantissa, exponent] = numStr.split('e');

    let result = mantissa;

    const exponentValue = parseInt(exponent);
    if (exponentValue < 0) {
      const zeroesToAdd = Math.abs(exponentValue) - 1;
      result = '0.' + '0'.repeat(zeroesToAdd) + mantissa.replace('.', '');
    } else {
      const decimalIndex = result.indexOf('.');
      if (decimalIndex !== -1 && decimalIndex < result.length - 1) {
        result = result.replace('.', '');
        result = `${result.substring(0, decimalIndex + exponentValue)}.${result.substring(
          decimalIndex + exponentValue,
        )}`;
      }
    }

    return result;
  }

  return numStr;
};
