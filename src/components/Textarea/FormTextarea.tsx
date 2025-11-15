import { FC, useEffect, useRef } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';

import { Textarea, TextareaProps } from './Textarea';

type Props = Omit<TextareaProps, 'value'> & {
  name: string;
  rules?: RegisterOptions;
  clearErrorOnDisable?: boolean;
  onChangeValue?: (value: string) => void;
};

export const FormTextarea: FC<Props> = ({
  name,
  rules,
  isError,
  errorText,
  onChangeValue,
  clearErrorOnDisable,
  disabled,
  ...rest
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
    <Textarea
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
