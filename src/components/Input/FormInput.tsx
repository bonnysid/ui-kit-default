import { FC, useEffect, useRef } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';

import { Input, InputProps } from './Input';

type OwnProps = {
  name: string;
  rules?: RegisterOptions;
  clearErrorOnDisable?: boolean;
  onChangeValue?: (value: string) => void;
};

type Props = Omit<InputProps, keyof OwnProps> & OwnProps;

export const FormInput: FC<Props> = ({
  name,
  rules,
  isError,
  errorText,
  onChangeValue,
  clearErrorOnDisable,
  disabled,
  ...inputProps
}) => {
  const { control, clearErrors } = useFormContext();
  const { fieldState, field } = useController({ name, rules, control });
  const prevDisabled = useRef<boolean | undefined>(disabled);

  const handleChange = (value: string) => {
    if (onChangeValue) {
      onChangeValue(value);
    }
    field.onChange(value);
  };

  useEffect(() => {
    if (disabled !== prevDisabled.current && clearErrorOnDisable) {
      clearErrors(name);
      prevDisabled.current = disabled;
    }
  }, [disabled]);

  return (
    <Input
      {...field}
      isError={Boolean(fieldState?.error) || isError}
      errorText={fieldState?.error?.message || errorText || ''}
      onChangeValue={handleChange}
      value={field.value}
      disabled={disabled}
      {...inputProps}
    />
  );
};
