import { constraint } from "../utils/parameter.js";

export const adviceSchema = {
    getProperAdvice: {
      description: "Get Proper Advice for each age",
      tags: ["Advice"],
      body: {
        type: "object",
        properties: {
            currentAge: constraint.AGE()
        },
        required: ["currentAge"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: {
                type: "array"
              },
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
  