import { buildCompletion, supabase } from "./engine";
import { TABLE } from "@auto-assistant/db-handler";
import { logger } from "./logger";
import { prompts } from "./prompts";

export const learner = {
  async learnOfNewPossibleDiseases(args) {
    const parseQueryMatches = args.diseases
      .map((currentMatch) => `'${currentMatch}'`)
      .join(" | ");
    const matchProductsForUsage = await supabase
      .from(TABLE.PRODUCTS)
      .select()
      .textSearch("for", parseQueryMatches, { type: "websearch" })
      .limit(5);
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
  },
};
