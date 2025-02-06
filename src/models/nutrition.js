import { constraint } from "../utils/parameter.js";

export const nutritionSchema = {
    queryNutritionPlot: {
      description: "Get Nutrition Plot",
      tags: ["Nutrition"],
      body: {
        type: "object",
        properties: {
            childpid: constraint.PID(),
        },
        required: ["childpid", "hospid"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: {
                type: "array",
                // properties:{
                //     id: {type:"string"},
                //     dataDateServ: constraint.DATE(),
                //     dataWeight: constraint.WEIGHT(),
                //     dataHeight: constraint.HEIGHT(),
                //     dataHeadcircum: constraint.HEADCIRCUM(),
                //     dataSex: constraint.SEX(),
                //     dataBirth: constraint.DATE(),
                //     dataAgeMonth: {type:"string"},
                //     dataAgeDay: {type:"string"},
                //     dataAgeDayBet: {type:"string"},
                // }
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
  