import { buildCompletion, supabase, upcomingEventChannel } from "./engine";
import {
  TABLE,
  UPCOMING_EVENT_CHANNEL_BROADCAST,
} from "@auto-assistant/db-handler";
import { logger } from "./logger";
import { prompts } from "./prompts";

export const handlers = {
  async indentifyPossibleDiseases(args) {
    logger("indentifyPossibleDiseases");
    const parseQueryMatches = args.diseases
      .map((currentMatch) => `'${currentMatch}'`)
      .join(" | ");
    const matchProductsForUsage = await supabase
      .from(TABLE.PRODUCTS)
      .select()
      .textSearch("for", parseQueryMatches, { type: "websearch" });
    let lastProductSuggestionsFor = [];

    if (matchProductsForUsage.count === null) {
      const queryCompletion = await buildCompletion({
        messages: [
          {
            role: "user",
            content: prompts.generateRecommendations({
              matches: parseQueryMatches,
            }),
          },
        ],
        max_tokens: 1500,
      });
      const productsSuggestions = JSON.parse(queryCompletion.message.content);
      logger({ productsSuggestions });
      const parseQueryProductNames = productsSuggestions
        .map((productSuggestion) => `'${productSuggestion.name.toLowerCase()}'`)
        .join(" | ");
      const matchSuggestedProducts = await supabase
        .from(TABLE.PRODUCTS)
        .select()
        .textSearch("name", parseQueryProductNames);
      logger({ matchSuggestedProducts });

      if (matchProductsForUsage.count === null) {
        productsSuggestions.forEach((productSuggested) => {
          let productSuggestionPayload = productSuggested;
          const findProductInDb = matchSuggestedProducts.data.find((product) =>
            productSuggested.name
              .toLowerCase()
              .includes(product.name.toLowerCase())
          );
          if (findProductInDb) {
            const currentForDiaseases = findProductInDb.for.split("|");
            const suggesstedForDiaseases = productSuggested.for.split("|");
            let suggestedFor = {};
            for (let i of currentForDiaseases) suggestedFor[i] = true;
            for (let j of suggesstedForDiaseases) suggestedFor[j] = true;
            const newMatchesForDiaseases = Object.keys(suggestedFor).join("|");
            let payload = { ...findProductInDb, for: newMatchesForDiaseases };
            productSuggestionPayload = payload;
            supabase
              .from("products")
              .update(payload)
              .eq("id", findProductInDb.id);
          } else {
            supabase
              .from("products")
              .insert({ ...productSuggested })
              .then(() =>
                logger(`${Date.now()}: product ${productSuggested.name} added`)
              );
          }
          lastProductSuggestionsFor.push(productSuggestionPayload);
        });
      }
    } else {
      lastProductSuggestionsFor = [...matchProductsForUsage.data];
    }

    const finalAnswer = await buildCompletion({
      temperature: 0.1,
      max_tokens: 700,
      messages: [
        {
          role: "user",
          content: prompts.rewriteSuggestion({
            lastProductSuggestionsFor,
            diseases: args.diseases,
          }),
        },
      ],
    });
    const finalAnswerContent = finalAnswer.message.content;
    logger({ finalAnswerContent });
    return finalAnswerContent;
  },
  async indentifyPossibleListOfMedicine(args) {
    logger("indentifyPossibleMedications");
    logger({ args });
  },
  async createTreatment(args) {
    logger("createTreatment");
    logger({ args });
    const { days, schedule } = args;
    let formattedSchedule = "";
    for (let i = 0; i < days; i++) {
      formattedSchedule += `Día ${i + 1}:\n`;
      for (const time of schedule) {
        const [hours, minutes] = time.split(":");
        const formattedTime = `${hours}:${minutes} ${
          hours >= 12 ? "PM" : "AM"
        }`;
        formattedSchedule += `  - ${formattedTime}\n`;
      }
    }
    formattedSchedule += `\nTe notificaré en estos días y hora para acompañarte en tu mejoría`;

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
    return formattedSchedule;
  },
};
