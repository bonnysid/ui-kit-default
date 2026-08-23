export const isCorrectEvent = <T>(e: Event): e is CustomEvent<T> => {
  return e instanceof CustomEvent && 'detail' in e;
};
