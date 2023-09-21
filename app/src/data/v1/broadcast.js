import { pubsub, autoresponseChannel } from "./engine";
import { completion } from "./completion";
import { logger } from "./logger";
import { messages } from "../../store";
import { PUSHER_AUTORESPONSE_CHANNEL_BIND } from "@auto-assistant/push-handler"

pubsub.on("MESSAGE_SEND", async (input) => {
  const message = await completion({ input });
  pubsub.emit("MESSAGE", { message });
});

pubsub.on("MESSAGE_THINKING", async ({ message }) => {
  pubsub.emit("MESSAGE", { message });
});

pubsub.on("MESSAGE_SEND_BY_OWN", ({ message }) => {
  messages.push({
    own: true,
    message: message,
    id: Date.now(),
  });
});

autoresponseChannel.bind(PUSHER_AUTORESPONSE_CHANNEL_BIND, (payload) => {
  logger({ autoResponseRegardsSchedule: payload });
  pubsub.emit("MESSAGE", { message: "hello it is time to take your med" });
});

pubsub.on("MESSAGE", (payload) => {
  messages.push({
    own: false,
    message: payload.message,
    id: Date.now(),
  });
});
