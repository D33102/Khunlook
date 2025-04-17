export const userSchema = {
  userRegisterSchema: {
    description: "User registration",
    tags: ["User"],
    body: {
      type: "object",
      properties: {
        NAME: { type: "string", maxLength: 100 },
        USERNAME: { type: "string", maxLength: 20, pattern: "^[a-zA-Z0-9]+$" },
        CID: {type: "string", minLength: 13, maxLength: 13, pattern: "^[0-9]"}, 
        PASSWORD: { type: "string", minLength: 6 },
        EMAIL: { type: "string", format: "email" },
        PHONE_NUMBER: {type: "string"},
      },
      required: ["NAME", "USERNAME", "CID", "PASSWORD", "EMAIL", "PHONE_NUMBER"],
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
