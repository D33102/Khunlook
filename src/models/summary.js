export const summarySchema = {
  saveSchema: {
    description: "Save or update child summary information",
    tags: ["Summary"],
    body: {
      type: "object",
      properties: {
        hospcode: { type: "string" },
        pid: { type: "string" },
        date_serv: { type: "string", format: "date" },
        age: { type: "integer" },
        eval_type: { type: "string" },
        eval_result: { type: "string" },
      },
      required: [
        "hospcode",
        "pid",
        "date_serv",
        "age",
        "eval_type",
        "eval_result",
      ],
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
        },
        required: ["success", "message"],
      },
      500: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          error: { type: "string" },
        },
        required: ["success", "message", "error"],
      },
    },
  },
};
