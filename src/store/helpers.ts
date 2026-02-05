import dayjs from "@/lib/dayjs";

export const toNum = (d: string | number) => {
  return parseInt(dayjs(d).format("YYYYMMDD"), 10);
};
