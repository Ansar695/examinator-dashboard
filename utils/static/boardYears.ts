const currentYear = new Date().getFullYear();
export const boardYears = Array.from({ length: 20 }, (_, i) => {
  const year = currentYear - i - 1; // exclude current year
  return { label: year?.toString(), value: year?.toString() };
});
