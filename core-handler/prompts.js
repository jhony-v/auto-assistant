export const prompts = {
  generateRecommendations({ matches }) {
    return `
    Generate a maximum of 4 recomendations of medication for the following symptoms: """${matches}""".
    Then, return in json format, without saying more things.
    Example: 
    [ { "name": "", "description": "Antibiotic | Analgesic | etc", "usage": "oral | inhalation | etc", for: "name of possible diseases and use cases just words separate by |" } ].
    For each prop value add it in the language of the user, Spanish, English, etc. 
    `
  },
  rewriteSuggestion({ content }) {
    return `
    json: """${content}""".
    Output in friendly human text for your a patient, just the text.
    Answer in the language of the user, Spanish, English, etc. 
    `;
  },
  defineRole() {
    return `You are a medical assistant and a super doctor, your task will be resolve all consultations or recognize possible diseases.
    If the user what know what may be proper medicine for their feeling or disease.
    Answer in the language of the user, Spanish, English, etc. 
    `
  }
};
