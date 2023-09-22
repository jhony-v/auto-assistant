export const prompts = {
  analizeDisease({ message }) {
    return `
    Text: "${message}"
    Recognize which ones could be possible diseases, maximun 5 closest diseases.
    Then, return a the answer separated by |, without saying more things.
    Example: alergias|rinitis alérgica|conjuntivitis alérgica|urticaria|pica
      `;
  },
  generateRecommendations({ matches }) {
    return `
    Generate maximunly 5 recomendations of medication for the following symptoms: ${matches}.
    Then, return in json format, without saying more things.
    Example: [ { "name": "", "description": "" , "usage": "por que medio", for: "matchs de la enfermedad separado por |" } ]
    `
  },
  rewriteSuggestion({ lastProductSuggestionsFor, diseases }) {
    return `
    Rewrite it more readable for pacient this suggestions. 
    medicine list: ${JSON.stringify(lastProductSuggestionsFor)}
    possible diseases: ${JSON.stringify(diseases)}      
    `;
  },
  defineRole() {
    return `You are a medical assistant and super doctor and you will help me to resolve all consultations.`
  }
};
