import dayjs from "@/lib/dayjs";

export const getTimeRange = () => {
  const now = dayjs();
  const todayStart = now.startOf("day").valueOf();
  const todayEnd = now.endOf("day").valueOf();
  const yesterdayStart = now.subtract(1, "day").startOf("day").valueOf();
  const yesterdayEnd = now.subtract(1, "day").endOf("day").valueOf();

  return { todayStart, todayEnd, yesterdayStart, yesterdayEnd };
};
