import { constraint } from "../utils/parameter.js";
export const vaccineSchema = {
  vaccineInformation: {
    description: "Vaccine",
    tags: ["Vaccine"],
    body: {
      type: "object",
      required: ["childpid", "isinplan", "loggedin"],
      properties: {
        childpid: constraint.PID(),
        isinplan: constraint.IN_PLAN(),
        loggedin: { type: "integer" },
        previous_chosen: { type: "string", nullable: true },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "integer" },
          content: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CODE: { type: "string" },
                DESCRIPTION: constraint.DESCRIPTION(),
                DESCRIPTION_TH: { type: "string" },
                DESCRIPTION_TABLE: { type: "string" },
                AGE: constraint.AGE(),
                AGE_MAX: constraint.AGE(),
                DISEASE: constraint.DISEASE(),
                GRP_NAME: constraint.GRP_NAME(),
                IN_PLAN: constraint.IN_PLAN(),
                INFORMATION: constraint.INFORMATION(),
                WEB_GRP_NAME: { type: "string" },
                WEB_GRP_ORDER: { type: "integer" },
              },
              required: [
                "CODE",
                "DESCRIPTION",
                "DESCRIPTION_TH",
                "DESCRIPTION_TABLE",
                "AGE",
                "AGE_MAX",
                "DISEASE",
                "GRP_NAME",
                "IN_PLAN",
                "INFORMATION",
                "WEB_GRP_NAME",
                "WEB_GRP_ORDER",
              ],
            },
          },
          history: {
            type: "array",
            items: {
              type: "object",
              properties: {
                DESCRIPTION: constraint.DESCRIPTION(),
                DESCRIPTION_TH: { type: "string" },
                DESCRIPTION_TABLE: { type: "string" },
                IN_PLAN: constraint.IN_PLAN(),
                VACCINETYPE: constraint.VACCINETYPE(),
                DATE_SERV: { type: "string", format: "date" },
                CODE: { type: "string" },
                WEB_GRP_NAME: { type: "string" },
                WEB_GRP_ORDER: { type: "integer" },
                GRP_NAME: constraint.GRP_NAME(),
                AGE: constraint.AGE(),
                AGE_MAX: constraint.AGE(),
                HOSPITAL: constraint.HOSPITAL(),
                HOSPITALCODE: constraint.HOSPCODE(),
                AGE_MONTH: { type: "integer" },
              },
              required: [
                "DESCRIPTION",
                "DESCRIPTION_TH",
                "DESCRIPTION_TABLE",
                "IN_PLAN",
                "VACCINETYPE",
                "DATE_SERV",
                "CODE",
                "WEB_GRP_NAME",
                "WEB_GRP_ORDER",
                "GRP_NAME",
                "AGE",
                "AGE_MAX",
                "HOSPITAL",
                "HOSPITALCODE",
                "AGE_MONTH",
              ],
            },
          },
          inplan: { type: "integer" },
        },
        required: ["success", "content", "history", "inplan"],
      },
    },
  },
  vaccineCreateInformationSchema: {
    description: "Save or update vaccine records",
    tags: ["Vaccine"],
    body: {
      type: "object",
      properties: {
        vaccineplace: { type: "string" },
        childpid: constraint.PID(),
        vaccinetype: constraint.VACCINETYPE(),
        vaccinated_date: { type: "string", format: "date" },
        months: { type: "string", nullable: true },
      },
      required: ["vaccineplace", "childpid", "vaccinetype", "vaccinated_date"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "integer" },
          message: { type: "string", nullable: true },
          error: { type: "string", nullable: true },
        },
      },
    },
  },
  vaccineGetHospitalSchema: {
    description: "Test",
    tags: ["Vaccine"],
    body: {
      type: "object",
      properties: {
        search: { type: "string" },
        momcid: { type: "string" },
      },
      required: ["search", "momcid"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          content: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                text: { type: "string" },
              },
              required: ["id", "text"],
            },
          },
        },
        required: ["content"],
      },
      400: {
        type: "object",
        properties: {
          success: { type: "integer" },
          error: { type: "string" },
        },
        required: ["success", "error"],
      },
    },
  },
  vaccineDeleteSchema: {
    description: "Vaccine",
    tags: ["Vaccine"],
    body: {
      type: "object",
      properties: {
        childpid: constraint.PID(),
        vaccinetype: constraint.VACCINETYPE_GA(),
        months: { type: "integer" },
        dateserv: { type: "string" },
      },
      required: ["childpid", "vaccinetype", "dateserv"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
        },
      },
    },
  },
  vaccineUpdateSchema: {
    description: "Test",
    tags: ["Vaccine"],
    body: {
      type: "object",
      required: [
        "vaccineplace",
        "childpid",
        "vaccinetype",
        "vaccinated_date",
        "prev_dateserv",
      ],
      properties: {
        vaccineplace: { type: "string", nullable: true },
        childpid: constraint.PID(),
        vaccinetype: constraint.VACCINETYPE(),
        vaccinated_date: {
          type: "string",
          description: "Updated vaccination date (DD-MM-YYYY)",
        },
        prev_dateserv: {
          type: "string",
          description: "Previous vaccination date (DD-MM-YYYY)",
        },
        months: {
          type: "string",
          nullable: true,
          description: "Age in months",
        },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "integer", enum: [0, 1] },
          message: { type: "string" },
        },
      },
      400: {
        type: "object",
        properties: {
          success: { type: "integer", enum: [0] },
          error: { type: "string" },
        },
      },
    },
  },
};
