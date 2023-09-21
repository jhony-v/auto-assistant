export const multiple_functions = [
    {
      name: "indentifyPossibleDiseases",
      description: "Identity possible diseases according what the user says",
      parameters: {
        type: "object",
        properties: {
          diseases: {
            type: "array",
            description: "List 10 of possible diseases",
            items: {
              type: "string",
              description: "Possible disease"
            }
          }
        },
        required: [ "possibleDisease" ]
      }
    },
    {
      name: "indentifyPossibleListOfMedicine",
      description: "Identity possible list of medicine according the possible diseases",
      parameters: {
        type: "object",
        properties: {
          medicine: {
            type: "array",
            description: "List 10 of possible medicine",
            items: {
              type: "string",
              description: "Possible medication"
            }
          }
        },
        required: [ "medicine" ]
      }
    },
    {
      name: "createTreatment",
      description: "Create a daily treatment base on medication mentioned",
      parameters: {
        type: "object",
        properties: {
          schedule: {
            type: "array",
            description: "time to consume it during a day, like [ '07:00:00', '12:00:00', '07:00:00' ]",
            items: {
              type: "string",
              description: "12:53:00"
            }
          },
          days: {
            type: "number",
            description: "number of days to apply the medical treatment"
          },
          disease: {
            type: "string",
            description: "name of the disease according to the medication choosen for the user"
          },
          medicine: {
            type: "string",
            description: "name of medicine"
          },
        },
        required: [ "medicine", "scheduleByDay" ]
      }
    }
  ]