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
  getInfoSchema: {
    description: "Get summary information",
    tags: ["Summary"],
    body: {
      type: "object",
      properties: {
        query_childpid: { type: "string" },
      },
      required: ["query_childpid"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          content: {
            type: "array",
            items: {
              type: "object",
              properties: {
                NAME: { type: "string" },
                SEX: { type: "string" },
                BIRTH: { type: "string", format: "date-time" },
                MOTHER: { type: "string" },
                PID: { type: "string" },
                IN_PLAN: { type: "string" },
                VACCINETYPE: { type: "string" },
                DATE_SERV: { type: "string", format: "date-time" },
                CODE: { type: "string" },
                WEB_GRP_NAME: { type: "string" },
                WEB_GRP_ORDER: { type: "integer" },
                GRP_NAME: { type: "string" },
                DESCRIPTION_TH: { type: "string" },
                DESCRIPTION_TABLE: { type: "string" },
                AGE: { type: "integer" },
                AGE_MAX: { type: "integer" },
                HOSPITAL: { type: "string" },
                HOSPITALCODE: { type: "string" },
                AGE_MONTH: { type: "integer" },
              },
              required: ["NAME", "SEX", "BIRTH", "MOTHER", "PID"],
            },
          },
        },
        required: ["success", "content"],
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
