import { ComponentPropsWithRef } from 'react';

export type DefaultInputProps = ComponentPropsWithRef<'input'>;

export type InputType = Extract<
  DefaultInputProps['type'],
  'email' | 'number' | 'tel' | 'search' | 'password' | 'text'
>;
