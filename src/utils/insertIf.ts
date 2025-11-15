export const insertIf = <D>(condition: boolean | undefined, data: D | D[]): D[] => {
  const formattedData = Array.isArray(data) ? data : [data];

  if (condition) {
    return formattedData;
  }

  return [];
};
