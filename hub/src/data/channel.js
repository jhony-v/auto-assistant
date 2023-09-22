import { supabase } from "./data";
import { createScheduledReminder } from "./schedule";
import {
  UPCOMING_EVENT_CHANNEL,
  TABLE,
  UPCOMING_EVENT_CHANNEL_BROADCAST,
} from "@auto-assistant/db-handler";

const upcomingEventChannel = supabase.channel(UPCOMING_EVENT_CHANNEL);

upcomingEventChannel.on(
  UPCOMING_EVENT_CHANNEL_BROADCAST.TYPE,
  { event: UPCOMING_EVENT_CHANNEL_BROADCAST.EVENT },
  ({ payload, event }) => {
    if (event === UPCOMING_EVENT_CHANNEL_BROADCAST.EVENT) {
      const { treatment, user } = payload;
      supabase.from(TABLE.TREATMENT).insert({
        agenda: createScheduledReminder({
          schedule: treatment.schedule,
          days: treatment.days,
        }),
      });
    }
  }
);

upcomingEventChannel.subscribe(console.log);
