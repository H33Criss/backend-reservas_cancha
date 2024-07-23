export const normalizeDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const createDate = (year: number, month: number, day: number): Date => {
  return new Date(year, month - 1, day);
};

export const stripTimeFromDate = (date: Date): Date => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  console.log(year);
  console.log(month);
  console.log(day);
  return new Date(year, month, day);
};
