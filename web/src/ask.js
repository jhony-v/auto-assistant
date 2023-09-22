import { pubsub } from "./engine";
import { completion  } from "@auto-assistant/core-handler";


export default async function ask ({ input: { phone, message }, messages }) {
  pubsub.emit('MESSAGE_THINKING',{ message: 'Un momento... 🙂' });
  const answers = await completion({ input:{ phone, message }, messages });
  answers.forEach((answer) => {
    pubsub.emit('MESSAGE_SEND',{
      message: answer.content,
      role: answer.role,
      id: Date.now(),
    });
  })
};


