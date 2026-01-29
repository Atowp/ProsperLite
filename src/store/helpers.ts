/** generate unique id */
export const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/** date to number */
export const toNum = (d: string | number) => {
  const date = new Date(d);
  return (
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  );
};
