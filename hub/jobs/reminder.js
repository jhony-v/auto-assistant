const { parentPort } = require("worker_threads");
const { supabase, pusher } = require("../data/data");
const { treatments } = require("../data/memory");
const { revalidateScheduledReminder } = require("../data/schedule");

async function analizeTreatments() {
  return treatments.data.map(treatment => {
    return revalidateScheduledReminder({
      start: treatment.start,
      end: treatment.end,
      schedule: treatment.detail.schedule,
    }).then(async ({ activable, removable, schedule }) => {
      if (activable) {
        console.log("activable:autoresponse", schedule);
        await pusher.trigger("autoresponse","autoResponseRegardsReminder",treatment);
      }
      if (removable) {
        console.log("remove treatment", schedule);
        supabase.from("treatments").delete().eq("id", treatment.id);
      }
    })
  })
}

async function getTreatmentsClosestCurrentDate() {
  try {
    const responseReminders = await supabase.rpc("treatment_closest_date");
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
