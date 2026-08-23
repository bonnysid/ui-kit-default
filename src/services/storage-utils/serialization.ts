export const serializeStorageValue = <T>(value: T): string => {
  const serialized = JSON.stringify(value);

  if (serialized === undefined) {
    throw new TypeError('Value is not JSON serializable');
  }

  return serialized;
};

export const deserializeStorageValue = <T>(rawValue: string): T => {
  return JSON.parse(rawValue);
};
