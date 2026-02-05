import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

// Extend dayjs with plugins
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Export configured dayjs instance as default export
export default dayjs;

// Also export Dayjs type for convenience
export type { Dayjs } from "dayjs";
