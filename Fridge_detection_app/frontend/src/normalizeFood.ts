export const normalizeFoodName = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ");
};
