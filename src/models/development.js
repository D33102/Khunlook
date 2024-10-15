export const developmentSchema = {
    deleteDevelopmentSchema: {
      description: "Delete a child's development information",
      tags: ["Development"],
      body: {
        type: "object",
        properties: {
          childpid: { type: "string" },
          devcode: { type: "string" },
        },
        required: ["childpid", "devcode"],
      },
      response: {
        200: {
            type: "object",
            properties: {
              message: { type: "string" },
              success: {type: "number"}
            },
            required: ["message"],
          },
        500: {
            type: "object",
            properties: {
              success: {type: "number"},
              message: { type: "string" },
            },
            required: ["message"],
        }
      },
    },
  
    getDevelopmentInformationSchema: {
      description: "Get development information based on age and child details",
      tags: ["Development"],
      body: {
        type: "object",
        properties: {
          ageMin: { type: "number" },
          ageMax: { type: "number" },
          childpid: { type: "string", nullable: true },
          childbirth: { type: "string", nullable: true },
          childcorrectedbirth: { type: "string", nullable: true },
          loggedin: { type: "boolean" },
          previous_chosen: { type: "string", nullable: true },
          tableName: { type: "string", nullable: true },
          childlowbtweigth: { type: "number", nullable: true },
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
        400:{
            type: "object",
            properties: {
            message: { type: "string" },
            success: {type: "number"}
            },
            required: ["message"],
        },
        404: {
            type: "object",
            properties: {
            message: { type: "string" },
            success: {type: "number"}
            },
            required: ["message"],
        },
        500: {
          type: "object",
          properties: {
            message: { type: "string" },
            success: {type: "number"}
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
          childpid: { type: "string" },
          checkAge: { type: "number", default: 0 },
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
        400:{
            type: "object",
            properties: {
            message: { type: "string" },
            success: {type: "number"}
            },
            required: ["message"],
        },
        404: {
            type: "object",
            properties: {
            message: { type: "string" },
            success: {type: "number"}
            },
            required: ["message"],
        },
        500: {
          type: "object",
          properties: {
            message: { type: "string" },
            success: {type: "number"}
          },
          required: ["message"],
        },
      },
    },
    queryConfigDevelopmentSchema:{
        description: "Query child's parameter configuration information",
        tags: ["Development"],
        body: {
          type: "object",
          properties: {
            childpid: { type: "string" },
            checkAge: { type: "number" },
          },
          required: ["childpid"]
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
                success: {type: "number"}
                },
                required: ["message"],
            },
            500: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    success: {type: "number"}
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
          dateocc: { type: "string", format: "date" },
          childpid: { type: "string" },
          childbirth: { type: "string", format: "date" },
          childcorrectedbirth: { type: "string", format: "date", nullable: true },
          devcode: { type: "string" },
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
                success: {type: "number"}
            },
            required: ["message"],
        },
      },
    },
    typeResultDevelopmentSchema:{
      description: "get development type from gl_development and gl_development_dspm_daim",
      tags: ["Development"],
      body: {
        type: "object",
        properties: {
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success:{type:"number"},
            type: {type: "array", items: { type: "object" }, nullable: true},
            type_DSPM_DAIM: {type: "array", items: { type: "object" }, nullable:true}
          },
        },
        404: {
            type: "object",
            properties: {
                success: {type: "number"},
                message: { type: "string" },
            },
            required: ["message"],
        },
        500: {
            type: "object",
            properties: {
                success: {type: "number"},
                message: { type: "string" },
            },
            required: ["message"],
        },
      },
    }
  };
