export const normalizePaymentDate = (value: unknown): Date | undefined => {
  if (!value) return undefined;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;

    const match = /^\d{4}-\d{2}-\d{2}$/.exec(trimmed);
    if (match) {
      const [year, month, day] = match.slice(1).map(Number);
      const parsed = new Date(year, month - 1, day, 12, 0, 0);
      return Number.isNaN(parsed.getTime()) ? undefined : parsed;
    }

    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }

  return undefined;
};
