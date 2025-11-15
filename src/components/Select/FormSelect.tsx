import { useEffect, useRef } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';

import { Select, SelectProps } from './Select';
import { SelectOption } from './types';

export type FormSelectProps<T> = SelectProps<T> & {
  name: string;
  clearErrorOnDisable?: boolean;
  rules?: RegisterOptions;
};

export const FormSelect = <T,>({
  name,
  rules,
  isError,
  errorText,
  value,
  clearErrorOnDisable,
  onChange,
  disabled,
  ...rest
}: FormSelectProps<T>) => {
  const { control, watch, clearErrors } = useFormContext();
  const { fieldState, field } = useController({ name, rules, control });
  const currentValue = value ?? watch(name);
  const prevDisabled = useRef<boolean | undefined>(disabled);

  const handleChange = (value?: SelectOption<T> | SelectOption<T>[]) => {
    if (onChange) {
      onChange(value as unknown as SelectOption<T> & SelectOption<T>[]);
    }

    field.onChange(value);
  };

  useEffect(() => {
    if (disabled !== prevDisabled.current && clearErrorOnDisable) {
      clearErrors(name);
      prevDisabled.current = disabled;
    }
  }, [disabled, currentValue]);

  return (
    <Select<T>
      {...field}
      disabled={disabled}
      value={currentValue}
      onChange={handleChange}
      isError={Boolean(fieldState?.error) || isError}
      errorText={fieldState?.error?.message || errorText}
      {...rest}
    />
  );
};
