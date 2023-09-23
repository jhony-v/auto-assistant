export const multiple_functions = [
  {
    name: "identifyPossibleDiseases",
    description:
      "identify top four possible diseases if the user doesn't know or doesn't suppose what is it or even he don't mention it otherwise, don't do it",
    parameters: {
      type: "object",
      properties: {
        diseases: {
          type: "array",
          description: "List of possible diseases",
          items: {
            type: "string",
            description: "Possible disease",
          },
        },
      },
      required: ["diseases"],
    },
  },
  {
    name: "identifyPossibleListOfMedicine",
    description:
      "Identity possible list of medicine according the possible disease or if the user mention what is the feeling or if the user knows what is the her disease",
    parameters: {
      type: "object",
      properties: {
        medicine: {
          type: "array",
          description:
            "List a maximun of four possible medicine according the disease in the input",
          items: {
            type: "string",
            description: "Possible medication",
          },
        },
        disease: {
          type: "string",
          description: "name of the disease",
        },
      },
      required: ["disease", "medicine"],
    },
  },
  {
    name: "createTreatment",
    description:
      "Create a daily schedule treatment base on medication mentioned or if the user what know when consume it",
    parameters: {
      type: "object",
      properties: {
        schedule: {
          type: "array",
          description:
            "time to consume it during a day, like [ '07:00:00', '12:00:00', '22:00:00' ]",
          items: {
            type: "string",
            description: "Time to consume the medicine",
          },
        },
        days: {
          type: "number",
          description: "number of days to apply the medical treatment",
        },
        disease: {
          type: "string",
          description:
            "name of the disease according to the medication choosen for the user",
        },
        medicine: {
          type: "string",
          description: "name of medicine choosen",
        },
      },
      required: ["schedule", "medicine", "disease"],
    },
  },
];
