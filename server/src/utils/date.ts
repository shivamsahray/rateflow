export const normalizePaymentDate = (value?: string | Date | null) => {
  if (!value) return null;

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  // For <input type="date"> values like "2026-08-25"
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00.000Z`);
  }

  const parsed = new Date(value);

  return isNaN(parsed.getTime()) ? null : parsed;
};