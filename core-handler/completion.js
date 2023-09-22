import { openai, supabase } from "./engine";
import { multiple_functions } from "./functions";
import { logger } from "./logger";
import { handlers } from "./handlers";
import { TABLE } from "@auto-assistant/db-handler";

const systemRole = {
  role: "system",
  content:
    "You are a medical assistant and helful for suggest me with medicine and detect possible diseases.",
};

export const completion = async ({
  input: { phone, message },
  messages = [],
}) => {
  try {
    const prompt = { role: "user", content: message };
    const responseMessages = [];
    const findUserByPhone = await supabase
      .from(TABLE.USER)
      .select()
      .eq("phone", phone)
      .limit(1)
      .maybeSingle();
    if (findUserByPhone.data === null) {
      supabase.from("users").insert({ phone, fullName: "" });
      logger("user created initially");
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 300,
      messages: [systemRole, ...messages, prompt],
      functions: multiple_functions,
      function_call: "auto",
      temperature: 0.2,
    });
    const responseMessage = response.choices[0].message;

    if (responseMessage.function_call) {
      const handler = handlers[responseMessage.function_call.name];
      let response = "";
      if (handler) {
        response = await handler(
          {
            ...JSON.parse(responseMessage.function_call.arguments),
            user: { phone }
          }
        );
      }
      responseMessages.push({ role: "assistant", content: response });
      return responseMessages;
    } else {
      responseMessages.push({
        role: "assistant",
        content: responseMessage.content,
      });
      return responseMessages;
    }
  } catch (e) {
    console.log(e);
    return [];
  }
};
