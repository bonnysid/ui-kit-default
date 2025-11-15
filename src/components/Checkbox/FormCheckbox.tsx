import { FC, useEffect, useRef } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';
import { Checkbox, CheckboxProps } from './Checkbox';

type Props = CheckboxProps & {
  name: string;
  rules?: RegisterOptions;
  clearErrorOnDisable?: boolean;
};

export const FormCheckbox: FC<Props> = ({
  name,
  rules,
  isError,
  errorText,
  clearErrorOnDisable,
  disabled,
  onChangeValue,
  ...rest
}) => {
  const { control, clearErrors } = useFormContext();
  const { fieldState, field } = useController({ name, rules, control });
  const prevDisabled = useRef<boolean | undefined>(disabled);

  const handleChange = (value: boolean) => {
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
    <Checkbox
      {...field}
      isError={Boolean(fieldState?.error) || isError}
      errorText={fieldState?.error?.message || errorText || ''}
      onChangeValue={handleChange}
      value={field.value}
      disabled={disabled}
      {...rest}
    />
  );
};
