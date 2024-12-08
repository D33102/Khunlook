import { constraint } from "../utils/parameter.js";

export const developmentSchema = {
  deleteDevelopmentSchema: {
    description: "Delete a child's development information",
    tags: ["Development"],
    body: {
      type: "object",
      properties: {
        childpid: constraint.PID(),
        devcode: constraint.DEVELOPMENT(),
      },
      required: ["childpid", "devcode"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" },
          success: { type: "number" },
        },
        required: ["message"],
      },
      500: {
        type: "object",
        properties: {
          success: { type: "number" },
          message: { type: "string" },
        },
        required: ["message"],
      },
    },
  },

  getDevelopmentInformationSchema: {
    description: "Get development information based on age and child details",
    tags: ["Development"],
    body: {
      type: "object",
      properties: {
        ageMin: constraint.AGE(),
        ageMax: constraint.AGE(),
        childpid: constraint.PID(),
        childbirth: constraint.DATE_NULLABLE(),
        childcorrectedbirth: constraint.DATE_NULLABLE(),
        loggedin: { type: "boolean" },
        tableName: constraint.TBName_DEVELOPMENT(),
        // childlowbtweigth: constraint.WEIGHT_NULLABLE(),
      },
      required: ["ageMin", "ageMax", "loggedin"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "number" },
          content: { type: "array", items: { type: "object" } },
          history: { type: "array", items: { type: "object" }, nullable: true },
          GA: { type: "string", nullable: true },
          person: { type: "array", items: { type: "object" }, nullable: true },
        },
      },
      400: {
        type: "object",
        properties: {
          message: { type: "string" },
          success: { type: "number" },
        },
        required: ["message"],
      },
      404: {
        type: "object",
        properties: {
          message: { type: "string" },
          success: { type: "number" },
        },
        required: ["message"],
      },
      500: {
        type: "object",
        properties: {
          message: { type: "string" },
          success: { type: "number" },
        },
        required: ["message"],
      },
    },
  },

  queryChildDevelopmentSchema: {
    description: "Query child's development information",
    tags: ["Development"],
    body: {
      type: "object",
      properties: {
        mompid: constraint.PID()
      },
      required: ["childpid"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "number" },
          content: { type: "array", items: { type: "object" } },
        },
      },
      400: {
        type: "object",
        properties: {
          message: { type: "string" },
          success: { type: "number" },
        },
        required: ["message"],
      },
      404: {
        type: "object",
        properties: {
          message: { type: "string" },
          success: { type: "number" },
        },
        required: ["message"],
      },
      500: {
        type: "object",
        properties: {
          message: { type: "string" },
          success: { type: "number" },
        },
        required: ["message"],
      },
    },
  },
  addChildDevelopmentSchema:{
    description: "add child development information",
    tags: ["Development"],
    body:{
      type:"object",
      properties:{
        pid: constraint.PID()
      }
    }
  },
  queryConfigDevelopmentSchema: {
    description: "Query child's parameter configuration information",
    tags: ["Development"],
    body: {
      type: "object",
      properties: {
        childpid: constraint.PID(),
        checkAge: constraint.AGE(),
      },
      required: ["childpid"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "number" },
          content: { type: "array", items: { type: "object" } },
        },
      },
      404: {
        type: "object",
        properties: {
          message: { type: "string" },
          success: { type: "number" },
        },
        required: ["message"],
      },
      500: {
        type: "object",
        properties: {
          message: { type: "string" },
          success: { type: "number" },
        },
        required: ["message"],
      },
    },
  },

  saveDevelopmentSchema: {
    description: "Save or update development information",
    tags: ["Development"],
    body: {
      type: "object",
      properties: {
        dateocc: constraint.DATE(),
        childpid: constraint.PID(),
        childbirth: constraint.DATE(),
        childcorrectedbirth: constraint.DATE_NULLABLE(),
        devcode: constraint.DEVELOPMENT(),
        isUpdate: { type: "number" },
      },
      required: ["dateocc", "childpid", "childbirth", "devcode", "isUpdate"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "number" },
          monthdiff: { type: "number" },
          ga_minus_week: { type: "number", nullable: true },
          correctedmonthdiff: { type: "number", nullable: true },
        },
      },
      500: {
        type: "object",
        properties: {
          message: { type: "string" },
          success: { type: "number" },
        },
        required: ["message"],
      },
    },
  },
  typeResultDevelopmentSchema: {
    description:
      "get development type from gl_development and gl_development_dspm_daim",
    tags: ["Development"],
    body: {
      type: "object",
      properties: {},
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "number" },
          type: { type: "array", items: { type: "object" }, nullable: true },
          type_DSPM_DAIM: {
            type: "array",
            items: { type: "object" },
            nullable: true,
          },
        },
      },
      404: {
        type: "object",
        properties: {
          success: { type: "number" },
          message: { type: "string" },
        },
        required: ["message"],
      },
      500: {
        type: "object",
        properties: {
          success: { type: "number" },
          message: { type: "string" },
        },
        required: ["message"],
      },
    },
  },
};
