import { useMemo } from 'react';
import { InputType } from '../types';

export type UseCurrentTypeProps = {
  type: InputType;
  isHidden?: boolean;
};

const TYPE_BY_TYPE: Partial<Record<InputType, InputType>> = {
  number: 'text',
};

export const useCurrentType = ({ type, isHidden }: UseCurrentTypeProps) => {
  return useMemo(() => {
    if (isHidden) {
      return 'password';
    }

    if (type !== 'password') {
      return TYPE_BY_TYPE[type] || type;
    }

    return 'text';
  }, [isHidden, type]);
};
