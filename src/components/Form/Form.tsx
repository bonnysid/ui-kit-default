import { ComponentPropsWithRef, PropsWithChildren } from 'react';
import { FieldValues, FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';

export type DefaultFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit?: SubmitHandler<T>;
};

export type FormProps<T extends FieldValues> = Omit<
  ComponentPropsWithRef<'form'>,
  keyof DefaultFormProps<T>
> &
  PropsWithChildren<DefaultFormProps<T>>;

export const Form = <T extends FieldValues>({
  form,
  onSubmit,
  ref,
  children,
  ...restProps
}: FormProps<T>) => {
  return (
    <FormProvider {...form}>
      <form {...restProps} onSubmit={onSubmit ? form.handleSubmit(onSubmit) : undefined} ref={ref}>
        {children}
      </form>
    </FormProvider>
  );
};
