export const testSchema = {
  testGreetSchema: {
    description: "Test",
    tags: ["Test"],
    response: {
      200: {
        type: "object",
        properties: {
          hello: { type: "string" },
        },
        required: ["hello"],
      },
    },
  },

  testHandSchema: {
    description: "Test",
    tags: ["Test"],
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            CODE: { type: "string", maxLength: 3 },
            DESCRIPTION: { type: "string", maxLength: 63 },
            DESCRIPTION_TH: { type: "string", maxLength: 31 },
            DESCRIPTION_TABLE: { type: "string" },
            TYPE: { type: "string", maxLength: 7 },
            AGE: { type: "string", maxLength: 255 },
            AGE_MAX: { type: "string", maxLength: 255 },
            DISEASE: { type: "string", maxLength: 125 },
            RISK_GROUP: { type: "string", maxLength: 125 },
            ICD10: { type: "string", maxLength: 31 },
            GRP_NAME: { type: "string", maxLength: 21 },
            WEB_GRP_NAME: { type: "string", maxLength: 21 },
            WEB_GRP_ORDER: { type: "integer" },
            IN_PLAN: { type: "string", maxLength: 1 },
            CHILD_VACCINE: { type: "string", maxLength: 1 },
            INFORMATION: { type: "string" },
            START_DATE: { type: "string", format: "date-time" },
            END_DATE: { type: "string", format: "date-time" },
          },
          required: ["CODE", "DESCRIPTION", "DESCRIPTION_TH"],
        },
      },
    },
  },
};
