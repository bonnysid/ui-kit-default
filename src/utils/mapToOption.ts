import { SelectOption } from '@/components';

type OtherProps<T, M = string> = Omit<SelectOption<T, M>, 'value' | 'label'>;

export const mapToOption = <T, M = string>(
  value: T,
  label?: string | number,
  otherProps?: OtherProps<T, M>,
): SelectOption<T, M> => {
  return { label, value, ...(otherProps || {}) };
};
