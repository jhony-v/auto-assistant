import mitt from "mitt"
import * as dbHandler from "@auto-assistant/db-handler"
import * as pusherHandler from "@auto-assistant/push-handler/client"
import { PUSHER_AUTORESPONSE_CHANNEL } from "@auto-assistant/push-handler"

export const pubsub = mitt();
export const pusher = pusherHandler.pusher;
export const autoresponseChannel = pusher.subscribe(PUSHER_AUTORESPONSE_CHANNEL);
export const supabase = dbHandler.db;
export const upcomingEventChannel = supabase.channel(dbHandler.UPCOMING_EVENT_CHANNEL);
upcomingEventChannel.subscribe(console.log);
