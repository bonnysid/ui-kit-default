import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  id?: string;
  children: React.ReactNode;
};

const createElement = (id = 'popup-root') => {
  const element = document.querySelector<HTMLDivElement>(`#${id}`);

  if (element) {
    return {
      element,
      alreadyHas: true,
    };
  }

  const ref = document.createElement('div');
  ref.setAttribute('id', id);
  return {
    element: ref,
    alreadyHas: false,
  };
};

export const Portal: React.FC<Props> = ({ children, id }) => {
  const ref = useRef<{
    element: HTMLDivElement;
    alreadyHas: boolean;
  }>(createElement(id));

  useEffect(() => {
    if (!ref.current.alreadyHas) {
      document.body.appendChild(ref.current.element);
    }
  }, []);

  return createPortal(children, ref.current.element);
};
