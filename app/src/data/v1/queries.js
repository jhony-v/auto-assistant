export const queries = {
  analizeDisease({ message }) {
    return `
    Texto: "${message}"
    Reconoce cuales podrían ser las posibles enfermedades.
    Retorna la respuesta separada por |, sin decir más. 
    Ejemplo: alergias|rinitis alérgica|conjuntivitis alérgica|urticaria|pica
      `;
  },
  generateRecommendations({ matches }) {
    return `
    Generar maximo 5 recomendaciones de medicamentos para los siguientes síntomas: ${matches}.
    Retorna en json, sin decir más.
    Ejemplo: [ { "name": "", "description": "" , "usage": "por que medio", for: "matchs de la enfermedad separado por |" } ]
    `
  }
};
