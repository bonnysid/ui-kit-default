import { FC } from 'react';

import { InputIcon } from '../InputIcon';

type Props = {
  isHidden?: boolean;
  hide: () => void;
  reveal: () => void;
  disabled?: boolean;
  isPlaceholder?: boolean;
};

export const HiddenControl: FC<Props> = ({ isHidden, reveal, hide, disabled, isPlaceholder }) => {
  return (
    <InputIcon
      onClick={isHidden ? reveal : hide}
      type={isHidden ? 'eye' : 'eye-off'}
      disabled={disabled}
      isPlaceholder={isPlaceholder}
    />
  );
};
