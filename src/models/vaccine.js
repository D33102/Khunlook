export const vaccineSchema = {
  vaccineInformation: {
    description: "Vaccine",
    tags: ["Vaccine"],
    body: {
      type: "object",
      required: ["childpid", "isinplan", "loggedin"],
      properties: {
        childpid: { type: "string" },
        isinplan: { type: "integer" },
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
                DESCRIPTION: { type: "string" },
                DESCRIPTION_TH: { type: "string" },
                DESCRIPTION_TABLE: { type: "string" },
                AGE: { type: "string" },
                AGE_MAX: { type: "string" },
                DISEASE: { type: "string" },
                GRP_NAME: { type: "string" },
                IN_PLAN: { type: "string" }, // changed to string to match example
                INFORMATION: { type: "string" },
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
                DESCRIPTION: { type: "string" },
                DESCRIPTION_TH: { type: "string" },
                DESCRIPTION_TABLE: { type: "string" },
                IN_PLAN: { type: "string" },
                VACCINETYPE: { type: "string" },
                DATE_SERV: { type: "string", format: "date" },
                CODE: { type: "string" },
                WEB_GRP_NAME: { type: "string" },
                WEB_GRP_ORDER: { type: "integer" },
                GRP_NAME: { type: "string" },
                AGE: { type: "string" },
                AGE_MAX: { type: "string" },
                HOSPITAL: { type: "string" },
                HOSPITALCODE: { type: "string" },
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
        childpid: { type: "string" },
        vaccinetype: { type: "string" },
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
        childpid: { type: "string" },
        vaccinetype: { type: "string" },
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
        childpid: { type: "string", description: "Child's PID" },
        vaccinetype: { type: "string", description: "Vaccine type" },
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
