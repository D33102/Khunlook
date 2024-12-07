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
    getUserChildSchema: {
      description: 'Retrieve PERSON records associated with the given user_id.',
      tags: ['Person'],
      params: {
        type: 'object',
        properties: {
          user_id: {
            type: 'integer',
            description: 'The ID of the user (positive integer).',
            minimum: 1,
          },
        },
        required: ['user_id'],
      },
      responses: {
        200: {
          description: 'A JSON array of PERSON records.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  persons: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        ID: { type: 'integer' },
                        HOSPCODE: { type: 'string' },
                        CID: { type: 'string' },
                        PID: { type: 'string' },
                        HID: { type: 'string' },
                        PRENAME: { type: 'string' },
                        NAME: { type: 'string' },
                        LNAME: { type: 'string' },
                        HN: { type: 'string' },
                        SEX: { type: 'string' },
                        BIRTH: { type: 'string', format: 'date' },
                        MSTATUS: { type: 'string' },
                        OCCUPATION_OLD: { type: 'string' },
                        OCCUPATION_NEW: { type: 'string' },
                        RACE: { type: 'string' },
                        NATION: { type: 'string' },
                        RELIGION: { type: 'string' },
                        EDUCATION: { type: 'string' },
                        FSTATUS: { type: 'string' },
                        FATHER: { type: 'string' },
                        MOTHER: { type: 'string' },
                        COUPLE: { type: 'string' },
                        VSTATUS: { type: 'string' },
                        MOVEIN: { type: 'string', format: 'date' },
                        DISCHARGE: { type: 'string' },
                        DDISCHARGE: { type: 'string', format: 'date' },
                        ABOGROUP: { type: 'string' },
                        RHGROUP: { type: 'string' },
                        LABOR: { type: 'string' },
                        PASSPORT: { type: 'string' },
                        TYPEAREA: { type: 'string' },
                        D_UPDATE: { type: 'string', format: 'date-time' },
                        START_DATE: { type: 'string', format: 'date-time' },
                        END_DATE: { type: 'string', format: 'date-time' },
                      },
                      required: ['ID', 'CID', 'NAME', 'LNAME'], // Adjust as necessary
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Invalid user_id supplied.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                },
                example: {
                  error: 'Invalid user_id. It must be a positive integer.',
                },
              },
            },
          },
        },
        404: {
          description: 'User not found or no PERSON records associated.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                },
                example: {
                  error: 'User not found or no PERSON records associated.',
                },
              },
            },
          },
        },
        500: {
          description: 'Internal Server Error.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                },
                example: {
                  error: 'Internal Server Error.',
                },
              },
            },
          },
        },
      },
    }
  };
