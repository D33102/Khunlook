export const authSchema = {
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
    response: {
      // Corrected the key from 'resposne' to 'response'
      200: {
        type: "object",
        properties: {
          accessToken: { type: "string" },
          refreshToken: { type: "string" },
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
  refreshSchema: {
    description: "Refresh Token", // Added a description for clarity
    tags: ["Auth"], // Added tags for consistency
    body: {
      type: "object",
      properties: {
        refreshToken: { type: "string" },
      },
      required: ["refreshToken"],
    },
    response: {
      // Corrected the key from 'resposne' to 'response'
      200: {
        type: "object",
        properties: {
          accessToken: { type: "string" },
        },
      },
      403: {
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
