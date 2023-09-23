import { completion  } from "@auto-assistant/core-handler";


export default async function ask ({ input: { phone, message }, messages }) {
  return completion({ input:{ phone, message }, messages });
};


