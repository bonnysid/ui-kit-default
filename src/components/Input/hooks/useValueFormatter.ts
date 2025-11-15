import { useCallback, useMemo } from 'react';
import { UseMaskOptions, useMask } from '@/hooks';
import { convertThousands, isUndefinedOrNull } from '@/utils';
import { InputType } from '../types';

export type UseValueFormatterProps = UseMaskOptions & {
  type?: InputType;
};

export type FormatterOptions = {
  isAllowNegative?: boolean;
  decimals?: number;
  maxLength?: number;
  isWithThousandSeparator?: boolean;
  decimalSeparator?: string;
};

export type FormatterFunctionProps = FormatterOptions & {
  value: string;
};

export type FormatterFunction = (props: FormatterFunctionProps) => string;

export type CleanerFunction = (value: string) => string;

const defaultFormat: FormatterFunction = ({ value, maxLength }) => {
  if (!isUndefinedOrNull(maxLength)) {
    return value.slice(0, maxLength);
  }

  return value;
};

const defaultClean: CleanerFunction = (value) => value;

const FORMATTER_BY_TYPE: Partial<Record<InputType, FormatterFunction>> = {
  tel: ({ value, ...rest }) => {
    const regex = /(?<!^)\+|[^\d+]/g;
    return defaultFormat({ value: value.replace(regex, ''), ...rest });
  },
  number: ({
    isAllowNegative,
    maxLength,
    decimals,
    value,
    isWithThousandSeparator,
    decimalSeparator = '.',
  }) => {
    let newValue = value;

    if (!isAllowNegative) {
      newValue = newValue.replace('-', '');
    }

    let [val, dec] = newValue.split('.');

    if (!isUndefinedOrNull(maxLength)) {
      val = val.slice(0, maxLength);
    }

    if (decimals && newValue.includes('.')) {
      dec = dec?.slice(0, decimals) || '';
      newValue = [val, dec].join(decimalSeparator);
    } else {
      newValue = val;
    }

    if (isWithThousandSeparator) {
      newValue = convertThousands(newValue);
    }

    return newValue;
  },
};

const CLEANER_BY_TYPE: Partial<Record<InputType, CleanerFunction>> = {
  number: (value) => {
    let newValue = value.replace(',', '.');

    const regex = /(?!^-)[^0-9.]|(?<=\..*)\.|(?<!\d)\./g;

    newValue = newValue.replace(regex, '');

    return newValue;
  },
  tel: (value) => {
    const regex = /(?<!^)\+|[^\d+]/g;
    return value.replace(regex, '');
  },
};

export const useValueFormatter = ({
  type = 'text',
  replacementPlaceholder,
  replacement,
  mask,
}: UseValueFormatterProps) => {
  const maskFormatter = useMask({ mask, replacement, replacementPlaceholder });

  const formatter = useMemo(() => FORMATTER_BY_TYPE[type] ?? defaultFormat, [type]);
  const cleaner = useMemo(() => CLEANER_BY_TYPE[type] ?? defaultClean, [type]);

  const format = useCallback<FormatterFunction>(
    (props) => {
      const formattedValue = formatter(props);

      return maskFormatter.apply(formattedValue);
    },
    [formatter, maskFormatter.apply],
  );

  const clean = useCallback<CleanerFunction>(
    (value) => {
      return cleaner(maskFormatter.clean(value));
    },
    [type],
  );

  return { format, clean };
};
