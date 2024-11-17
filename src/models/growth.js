import { constraint } from "../utils/parameter.js";
export const growthSchema = {
  getInformationSchema: {
    description: "Growth Get Information",
    tags: ["Growth"],
    body: {
      type: "object",
      properties: {
        childpid: constraint.PID(),
        previous_chosen: constraint.PID(),
      },
      required: ["childpid"],
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
              nid: { type: "integer" },
              date: constraint.DATE(),
              weight: constraint.WEIGHT(),
              height: constraint.HEIGHT(),
              hearcircum: constraint.HEADCIRCUM(),
              sex: constraint.SEX(),
              birth: constraint.DATE(),
              ageDay: constraint.AGE(),
              ageMonth: constraint.AGE_MONTH_DESCRIPTION(),
              GA: constraint.GA(),
            },
          },
        },
        required: ["success", "message", "data"],
      },
      404: {
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
  growthValidateSchema: {
    description: "Growth Validate",
    tags: ["Growth"],
    body: {
      type: "object",
      properties: {
        servicedatepicker: constraint.DATE(),
        weight: constraint.WEIGHT(),
        height: constraint.HEIGHT(),
        hcir: constraint.HEADCIRCUM(),
        nuchildhospcode: constraint.HOSPITALCODE(),
        nuchildpid: constraint.PID(),
        nuchildname: { type: "string" },
        changedropdown: { type: "number" },
        previous_chosen: constraint.PID(),
      },
      required: [
        "servicedatepicker",
        "weight",
        "height",
        "hcir",
        "nuchildhospcode",
        "nuchildpid",
      ],
    },
    response: {
      201: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: {
            type: "object",
            servicedatepicker: constraint.DATE(),
            weight: constraint.WEIGHT(),
            height: constraint.HEIGHT(),
            hcir: constraint.HEADCIRCUM(),
            nuchildhospcode: constraint.HOSPITALCODE(),
            nuchildpid: constraint.PID(),
          },
        },
        required: ["success", "message", "data"],
      },
      400: {
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
  growthQueryResultSchema: {
    description: "Growth query result",
    tags: ["Growth"],
    body: {
      type: "object",
      properties: {
        sex: constraint.SEX(),
        typeGraph: { type: "number", minimum: 1, maximum: 10 },
        maxFirstGL: { type: "number" },
        minFirstGL: { type: "number" },
        maxSecondGL: { type: "number" },
        minSecondGL: { type: "number" },
        maxThirdGL: { type: "number" },
        minThirdGL: { type: "number" },
        HC_WHO: { type: "number", enum: [1, -1] },
        HC: { type: "number", enum: [1, -1] },
      },
      required: [
        "sex",
        // "typeGraph",
        // "maxFirstGL",
        // "minFirstGL",
        // "maxSecondGL",
        // "minSecondGL",
        // "maxThirdGL",
        // "minThirdGL",
        // "HC_WHO",
        // "HC",
      ],
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: {
            oneOf: [
              {
                type: "object",
                properties: {
                  key: { type: "integer" },
                  ageYear: constraint.AGE(),
                  ageMonth: constraint.AGE(),
                  ageYearAsMonth: { type: "integer" },
                  p1: constraint.PERCENTILE(),
                  p3: constraint.PERCENTILE(),
                  p5: constraint.PERCENTILE(),
                  p15: constraint.PERCENTILE(),
                  p25: constraint.PERCENTILE(),
                  p50: constraint.PERCENTILE(),
                  p75: constraint.PERCENTILE(),
                  p85: constraint.PERCENTILE(),
                  p95: constraint.PERCENTILE(),
                  p97: constraint.PERCENTILE(),
                  p99: constraint.PERCENTILE(),
                  sex: constraint.SEX(),
                  TBName: constraint.TBName_WH(),
                },
                additionalProperties: true,
                description: "typeGraph 1, 8 (percentile)",
              },
              {
                type: "object",
                properties: {
                  height: constraint.HEIGHT(),
                  less5: { type: "number" },
                  less3: { type: "number" },
                  less1: { type: "number" },
                  more2: { type: "number" },
                  more4: { type: "number" },
                  TBName: constraint.TBName_WH(),
                },
                description: "typeGraph 2",
              },
              {
                type: "object",
                properties: {
                  ID: { type: "integer" },
                  name: { type: "string" },
                  result: { type: "string" },
                },
                description: "typeGraph 3, 4, 6, 7, 8, 9 (result)",
              },
              {
                height: { type: "integer" },
                decription: "typegraph 10",
              },
            ],
          },
        },
        required: ["success", "message", "data"],
      },
      400: {
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
