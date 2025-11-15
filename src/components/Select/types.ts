import { ReactNode } from 'react';

export type SelectOption<D = string, M = {}> = {
  value: D;
  label?: ReactNode;
  meta?: M;

  disabled?: boolean;
  description?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
};
