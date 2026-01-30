export const isNil = (val: unknown): val is null | undefined => {
  return (
    val === null || val === undefined || (typeof val === "number" && isNaN(val))
  );
};

export const isEmpty = (val: unknown): boolean => {
  if (isNil(val)) return true;
  if (typeof val === "string") return val.trim().length === 0;
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val === "object") return Object.keys(val).length === 0;
  return false;
};
