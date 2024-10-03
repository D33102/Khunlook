export const userSchema = {
    userRegisterSchema: {
      description: "User registration",
      tags: ["User"],
      body: {
        type: "object",
        properties: {
          NAME: { type: "string", maxLength: 100 },
          USERNAME: { type: "string",maxLength: 20, pattern: "^[a-zA-Z0-9]+$" },
          PASSWORD: { type: "string", minLength: 6 },
          EMAIL: { type: "string", format: "email" },
        },
        required: ["NAME", "USERNAME", "PASSWORD", "EMAIL"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
          required: ["message"],
        },
        400: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
            required: ["message"],
        },
        500: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
          required: ["message"],
        },
      },
    },
  };
