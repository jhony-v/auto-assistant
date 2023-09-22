import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import duration from "dayjs/plugin/duration";
import customParseFormat from  "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(isBetween);

export const createScheduledReminder = (input) => {
  const format = "YYYY-MM-DD";
  const payload = {
    start: dayjs().format(format),
    end: dayjs().add(input.days, "day").format(format),
    schedule: input.schedule,
    days: input.days,
  };
  return payload;
};

export const revalidateScheduledReminder = async (input) => {
  return new Promise((resolve) => {

    inRange = dayjs().isBetween(input.start, input.end, "day", "[]"),
    removable = dayjs().isAfter(input.end);
    let activable = false,
    schedule;
    
    if (inRange) {
      for (let currentScheduleIndex in input.schedule) {
        const currentScheduleTime = dayjs(input.schedule[currentScheduleIndex],"HH:mm:ss");
        if (dayjs().isSame(currentScheduleTime,'minute')) {
          schedule = input.schedule[currentScheduleIndex];
          activable = true;
          break;
        }
      }
    }
    
    const payload = {
      schedule,
      removable,
      activable,
    };
    resolve(payload);
  })
};
