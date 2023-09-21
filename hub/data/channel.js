const { supabase } = require("./data");
const { createScheduledReminder } = require("./schedule");

const upcomingEventChannel = supabase.channel("upcomingEventChannel");

upcomingEventChannel.on("broadcast", { event: "createTreatment" }, ({ payload, event }) => {
    if(event === "createTreatment") {
        const {  treatment, user } = payload;
        supabase.from('treatment').insert({
          agenda: createScheduledReminder({
            schedule: treatment.schedule,
            days: treatment.days
          }),
        });
    }
  }
);

upcomingEventChannel.subscribe(console.log);
