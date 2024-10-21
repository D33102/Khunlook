export const growthSchema = {
  getInformationSchema: {
    description: "Growth Get Information",
    tags: ["Growth"],
    body: {
      type: "object",
      properties: {
        childpid: { type: "string" },
        previous_chosen: { type: "string" },
      },
      required: ["childpid"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: { type: "object", additionalProperties: true },
        },
        required: ["success", "message", "data"],
      },
      404: {
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
  growthValidateSchema: {
    description: "Growth Validate",
    tags: ["Growth"],
    body: {
      type: "object",
      properties: {
        servicedatepicker: { type: "string", format: "date" },
        weight: { type: "number" },
        height: { type: "number" },
        hcir: { type: "number" },
        nuchildhospcode: { type: "string" },
        nuchildpid: { type: "string" },
        nuchildname: { type: "string" },
        changedropdown: { type: "string" },
        previous_chosen: { type: "string" },
      },
      required: [
        "servicedatepicker",
        "weight",
        "height",
        "hcir",
        "nuchildhospcode",
        "nuchildpid",
      ],
    },
    response: {
      201: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: { type: "object", additionalProperties: true },
        },
        required: ["success", "message", "data"],
      },
      400: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          error: { type: "string" },
        },
        required: ["success", "message", "error"],
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
  growthQueryResultSchema: {
    description: "Growth query result",
    tags: ["Growth"],
    body: {},
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: { type: "object", additionalProperties: true },
        },
        required: ["success", "message", "data"],
      },
      400: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          error: { type: "string" },
        },
        required: ["success", "message", "error"],
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
