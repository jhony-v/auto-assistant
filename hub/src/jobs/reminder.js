import { parentPort } from "worker_threads";
import { supabase, pusher } from "../data/data";
import { treatments } from "../data/memory";
import { revalidateScheduledReminder } from "../data/schedule";
import { PUSHER_AUTORESPONSE_CHANNEL, PUSHER_AUTORESPONSE_CHANNEL_BIND } from "@auto-assistant/push-handler"
import { TABLE, TREATMENT_CLOSEST_DATE } from "@auto-assistant/db-handler";

async function analizeTreatments() {
  return treatments.data.map(treatment => {
    return revalidateScheduledReminder({
      start: treatment.start,
      end: treatment.end,
      schedule: treatment.detail.schedule,
    }).then(async ({ activable, removable, schedule }) => {
      if (activable) {
        console.log("activable:autoresponse", schedule);
        await pusher.trigger(PUSHER_AUTORESPONSE_CHANNEL,PUSHER_AUTORESPONSE_CHANNEL_BIND,treatment);
      }
      if (removable) {
        console.log("remove treatment", schedule);
        supabase.from(TABLE.TREATMENT).delete().eq("id", treatment.id);
      }
    })
  })
}

async function getTreatmentsClosestCurrentDate() {
  try {
    const responseReminders = await supabase.rpc(TREATMENT_CLOSEST_DATE);
    treatments.data = responseReminders.data;
  } catch (error) {
    console.log(error);
  } 
}

(async () => {
  await getTreatmentsClosestCurrentDate();
  await Promise.allSettled(analizeTreatments)
  if (parentPort) parentPort.postMessage("done");
  else process.exit(0);
})();
