export const growthSchema = {
  getInformationSchema: {
    description: "Growth Get Information",
    tags: ["Growth"],
    body: {
      type: "object",
      properties: {
        childpid: { type: "string" },
      },
      required: ["childpid"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: {
            type: "integer",
          },
          content: {
            type: "array",
            items: {
              type: "object",
            },
          },
        },
      },
      404: {
        type: "object",
        properties: {
          success: {
            type: "integer",
          },
          content: {
            type: "array",
            items: {
              type: "object",
            },
          },
        },
      },
      500: {
        type: "object",
        properties: {
          success: { type: "number" },
          message: { type: "string" },
        },
        required: ["message"],
      },
    },
  },
};
