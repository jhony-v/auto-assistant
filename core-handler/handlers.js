import { buildCompletion, upcomingEventChannel } from "./engine";
import { UPCOMING_EVENT_CHANNEL_BROADCAST } from "@auto-assistant/db-handler";
import { logger } from "./logger";
import { prompts } from "./prompts";
import { learner } from "./learner";

export const handlers = {
  async identifyPossibleDiseases(args) {
    logger("identifyPossibleDiseases");
    console.time("identifyPossibleDiseases");
    learner.learnOfNewPossibleDiseases(args);
    const finalAnswer = await buildCompletion({
      temperature: 0.7,
      max_tokens: 700,
      messages: [
        {
          role: "system",
          content: prompts.defineRole(),
        },
        {
          role: "user",
          content: prompts.rewriteSuggestion({
            content: JSON.stringify(args.diseases),
          }),
        },
      ],
    });
    const finalAnswerContent = finalAnswer.message.content;
    logger({ finalAnswerContent });
    console.timeEnd("identifyPossibleDiseases");
    return finalAnswerContent;
  },
  async identifyPossibleListOfMedicine(args) {
    logger("identifyPossibleListOfMedicine");
    logger({ args });
    const finalAnswer = await buildCompletion({
      temperature: 0.2,
      max_tokens: 700,
      top_p: 0.06,
      messages: [
        {
          role: "system",
          content: prompts.defineRole(),
        },
        {
          role: "user",
          content: prompts.rewriteSuggestion({
            content: JSON.stringify({
              disease: args.disease,
              medicineSuggestions: args.medicine,
            }),
          }),
        },
      ],
    });
    const finalAnswerContent = finalAnswer.message.content;
    logger({ finalAnswerContent });
    console.timeEnd("identifyPossibleListOfMedicine");
    return finalAnswerContent;
  },
  async createTreatment(args) {
    logger("createTreatment");
    logger({ args });
    const upcomingEventChannelBroadcast = {
      type: UPCOMING_EVENT_CHANNEL_BROADCAST.TYPE,
      event: UPCOMING_EVENT_CHANNEL_BROADCAST.EVENT,
      payload: {
        treatment: args,
        user: args.user,
      },
    };
    logger({ upcomingEventChannelBroadcast });
    upcomingEventChannel
      .send(upcomingEventChannelBroadcast)
      .then(() => console.log("sent upcoming event"));

      const finalAnswer = await buildCompletion({
        temperature: 0.9,
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: prompts.defineRole(),
          },
          {
            role: "user",
            content: prompts.rewriteSuggestion({
              content: JSON.stringify({
                timeToConsumeMEdicament: args.schedule,
                duringDays: args.days
              }),
            }),
          },
        ],
      });
      const finalAnswerContent = finalAnswer.message.content;  
    return finalAnswerContent;
  },
};
