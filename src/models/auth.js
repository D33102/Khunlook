export const authSchema = {
  loginSchema: {
    description: "User Login",
    tags: ["Auth"],
    body: {
      type: "object",
      properties: {
        USERNAME: {
          type: "string",
          maxLength: 20,
          pattern: "^[a-zA-Z0-9]+$",
        },
        PASSWORD: {
          type: "string",
          minLength: 6,
        },
      },
      required: ["USERNAME", "PASSWORD"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  ID: { type: "string" },
                  username: { type: "string" },
                  email: { type: "string" },
                  phone_number: { type: "string", nullable: true },
                  PID: { type: "string" },
                },
                required: ["ID", "username", "email"],
              },
              tokens: {
                type: "object",
                properties: {
                  accessToken: { type: "string" },
                  refreshToken: { type: "string" },
                },
                required: ["accessToken", "refreshToken"],
              },
            },
            required: ["user", "tokens"],
          },
        },
        required: ["success", "message", "data"],
      },
      401: {
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
  refreshSchema: {
    description: "Refresh Token",
    tags: ["Auth"],
    body: {
      type: "object",
      properties: {
        refreshToken: { type: "string" },
      },
      required: ["refreshToken"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              accessToken: { type: "string" },
              accessTokenExpiredIn: { type: "integer" },
            },
            required: ["accessToken", "accessTokenExpiredIn"],
          },
        },
        required: ["success", "message", "data"],
      },
      401: {
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
