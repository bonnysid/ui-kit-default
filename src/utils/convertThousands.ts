export const THOUSAND_SEPARATOR_REGEXP = /\B(?=(\d{3})+(?!\d))/g;

export const convertThousands = (value: number | string) => String(value).replace(THOUSAND_SEPARATOR_REGEXP, ' ');
