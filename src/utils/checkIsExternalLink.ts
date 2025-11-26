const checkIsExternalLink = (to: string) => {
  try {
    return Boolean(new URL(to));
  } catch (e) {
    return false;
  }
};

export { checkIsExternalLink };
