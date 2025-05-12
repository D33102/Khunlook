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
  developmentAndVaccineInfoSchema: {
    description: "Get detailed development and vaccine information for a child",
    tags: ["Summary"],
    body: {
      type: "object",
      properties: {
        ageMin: { type: "integer" },
        ageMax: { type: "integer" },
        childpid: { type: "string" },
        childbirth: { type: "string", format: "date-time" },
        childcorrectedbirth: { type: "string", format: "date-time" },
        loggedin: { type: "integer" },
        previous_chosen: { type: "string" },
        tableName: { type: "string" },
        childlowbtweigth: { type: "string" },
      },
      required: ["ageMin", "ageMax", "childpid", "loggedin", "tableName"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          development: {
            type: "object",
            properties: {
              content: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    MIN_AGE_MONTH: { type: "integer" },
                    MAX_AGE_MONTH: { type: "integer" },
                    CODE: { type: "string" },
                    TYPE: { type: "integer" },
                    AGE_MONTH_DESCRIPTION: { type: "string" },
                    DESCRIPTION: { type: "string" },
                    INFORMATION: { type: "string" },
                    TYPE_DESCRIPTION: { type: "string" },
                    TBName: { type: "string" },
                    SCREENING: { type: "integer" },
                  },
                },
              },
              history: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    MAX_AGE_MONTH: { type: "integer" },
                    CODE: { type: "string" },
                    TYPE: { type: "integer" },
                    DATE_OCCURRED: { type: "string", format: "date-time" },
                    MONTH_AT_OCCURRED: { type: "integer" },
                    MONTH_AT_OCCURRED_CORRECTED: { type: "integer" },
                  },
                },
              },
              GA: { type: ["integer", "null"] },
              person: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    BIRTH: { type: "string", format: "date" },
                    PID: { type: "string" },
                    NAME: { type: "string" },
                  },
                },
              },
            },
          },
          vaccine: {
            type: "object",
            properties: {
              history: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    DESCRIPTION: { type: "string" },
                    DESCRIPTION_TH: { type: "string" },
                    DESCRIPTION_TABLE: { type: "string" },
                    IN_PLAN: { type: "integer" },
                    VACCINETYPE: { type: "string" },
                    DATE_SERV: { type: "string", format: "date-time" },
                    CODE: { type: "string" },
                    WEB_GRP_NAME: { type: "string" },
                    WEB_GRP_ORDER: { type: "integer" },
                    GRP_NAME: { type: "string" },
                    AGE: { type: "integer" },
                    AGE_MAX: { type: "integer" },
                    HOSPITAL: { type: "string" },
                    HOSPITALCODE: { type: "string" },
                    AGE_MONTH: { type: "integer" },
                  },
                },
              },
            },
          },
        },
        required: ["success", "development", "vaccine"],
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
