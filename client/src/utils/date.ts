export const toLocalDateInput = (value?: string | Date | null): string => {
  if (!value) return "";

  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const parseDateOnly = (value?: string | Date | null): Date | null => {
  if (!value) return null;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const isoMatch = /^\d{4}-\d{2}-\d{2}$/.exec(trimmed);
    if (isoMatch) {
      const [year, month, day] = isoMatch[0].split("-").map(Number);
      const localDate = new Date(year, month - 1, day, 12, 0, 0);
      return Number.isNaN(localDate.getTime()) ? null : localDate;
    }

    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return Number.isNaN(value.getTime()) ? null : value;
};
