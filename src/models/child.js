import { constraint } from "../utils/parameter.js";
export const childSchema = {
  getChildSchema: {
    description: "Get children of the specific userid",
    tags: ["child"],
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" },
          data: { type: "object", additionalProperties: true },
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
  addChildSchema: {
    description: "Add child Development",
    tags: ["child"],
    body: {
      type: "object",
      properties: {
        momcid: constraint.CID(),
        childcid: constraint.CID(),
        childpid: constraint.PID(),
        childhospcode: constraint.HOSPCODE(),
        childname: { type: "string" },
        datepickerchild: constraint.DATE(),
        sexchild: constraint.SEX(),
        gaweek: constraint.GA(),
        childfullname: { type: "string" },
        childbtime: constraint.BTIME(),
        childabo: constraint.ABOGROUP(),
        childrh: constraint.RHGROUP(),
        childmemo: constraint.MEMO(),
        lowbtweigth: constraint.BWEIGHT(),
        birthAsphyxia: constraint.ASPHYXIA(),
      },
      required: ["childpid"],
    },
    response: {
      201: {
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
};
