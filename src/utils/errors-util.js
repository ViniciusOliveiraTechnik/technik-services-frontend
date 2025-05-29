export const parseErrors = (errorObj) => {
  if (!errorObj || typeof errorObj !== "object") return [];

  return Object.values(errorObj).flat();
};
