import { useCallback } from 'react';
import { isUndefinedOrNull } from '@/utils';

export type UseIncrementProps = {
  value?: string;
  onChangeValue: (value: string) => void;
  isAllowNegative?: boolean;
  decimals?: number;
  max?: number;
  min?: number;
};

const toNumber = (value: string) => {
  if (value === '-') {
    return 0;
  }

  const numValue = Number(value);

  if (!Number.isNaN(numValue)) {
    return numValue;
  } else {
    return 0;
  }
};

export const useIncrement = ({
  onChangeValue,
  value = '',
  isAllowNegative,
  decimals,
  min,
  max,
}: UseIncrementProps) => {
  const increment = useCallback(() => {
    const valueNum = toNumber(value) + 1;

    if (!isUndefinedOrNull(max) && valueNum > max) {
      return;
    }

    const roundedValue = valueNum.toFixed(decimals);
    onChangeValue(String(roundedValue));
  }, [decimals, onChangeValue, value]);

  const decrement = useCallback(() => {
    const valueNum = toNumber(value) - 1;

    if (!isUndefinedOrNull(min) && valueNum < min) {
      return;
    }

    const roundedValue = valueNum.toFixed(decimals);

    if (isAllowNegative) {
      onChangeValue(roundedValue);
    } else {
      if (Number(roundedValue) >= 0) {
        onChangeValue(roundedValue);
      }
    }
  }, [isAllowNegative, decimals, onChangeValue, value]);

  return { increment, decrement };
};
