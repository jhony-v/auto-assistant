import mitt from "mitt"
import * as aiHandler from "@auto-assistant/ai-handler"
import * as dbHandler from "@auto-assistant/db-handler"
import * as pusherHandler from "@auto-assistant/push-handler/client"
import { PUSHER_AUTORESPONSE_CHANNEL } from "@auto-assistant/push-handler"

export const pubsub = mitt();
const pusher = pusherHandler.pusher;
export const autoresponseChannel = pusher.subscribe(PUSHER_AUTORESPONSE_CHANNEL);
export const supabase = dbHandler.db;

export const upcomingEventChannel = supabase.channel(dbHandler.UPCOMING_EVENT_CHANNEL);
upcomingEventChannel.subscribe(console.log);


export const openai =aiHandler.openai;


export const buildCompletion = async ({ messages, max_tokens = 100, temperature = 0.1 }) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    max_tokens,
    messages: [
      { role: 'system', content: 'Eres un medico asistente genial y me ayudarás a resolver consultas' },
      ...messages
    ],
    temperature,
  })
  return response.choices[0];
}