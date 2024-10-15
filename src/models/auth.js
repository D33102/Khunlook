export const loginSchema = {
  loginSchema: {
    description: "User Login",
    tags: ["Auth"],
    body: {
      type: "object",
      properties: {
        USERNAME: { type: "string", maxLength: 20, pattern: "^[a-zA-Z0-9]+$" },
        PASSWORD: { type: "string", minLength: 6 },
      },
      required: ["USERNAME", "PASSWORD"],
    },
    resposne: {
      200: {
        type: "object",
        properties: {
          accesstoken: { type: "string" },
          refreshtoken: { type: "string" },
        },
      },
      401: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
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
