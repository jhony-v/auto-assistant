import { pubsub, autoresponseChannel } from "./engine";
import { PUSHER_AUTORESPONSE_CHANNEL_BIND } from "@auto-assistant/push-handler"
import ask from "./ask";
import { logger } from "./logger";
import { messages } from "./store";

pubsub.on("MESSAGE_SEND", async (input) => {
  await ask({ input, messages: messages.map(message => ({
    role: message.role,
    content: message.content
  })) });
});

pubsub.on("MESSAGE_THINKING", async ({ message }) => {
  pubsub.emit("MESSAGE", { message });
});

pubsub.on("MESSAGE_SEND_BY_OWN", ({ message }) => {
  messages.push({
    message: message,
    role: "user",
    id: Date.now(),
  });
});

autoresponseChannel.bind(PUSHER_AUTORESPONSE_CHANNEL_BIND, (payload) => {
  logger({ autoResponseRegardsSchedule: payload });
  pubsub.emit("MESSAGE", { message: "hello it is time to take your med" });
});

pubsub.on("MESSAGE", (payload) => {
  messages.push(payload);
});
