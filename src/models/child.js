import { constraint } from "../utils/parameter"
export const childSchema={
    getChildSchema:{
      description:"Get children of the specific userid",
      tags: ["child"],
      body: {
        type: "object",
        properties: {
          momcid: { type: "string"},
          childcid: { type: "string"},
          childpid: { type: "string"},
          childhospcode: { type: "string"},
          childname: { type: "string" },
          datepickerchild: { type: "string", format: "date" },
          sexchild: { type: "string", enum: ["M", "F"],  },
          gaweek: { type: "number",  },
          childfullname: { type: "string"},
          childbtime: { type: "string", format: "time", },
          childabo: { type: "string", },
          childrh: { type: "string",  },
          childmemo: { type: "string", },
          lowbtweigth: { type: "boolean", },
          birthAsphyxia: { type: "boolean",  },
        },
        required: ["momcid"], // Ensure all necessary fields are included
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
            message: { type: "string" },
            success: { type: "number" },
          },
          required: ["message"],
        },
      },

    },
    addChildSchema:{
            description: "Add child Development",
            tags: ["child"],
            body: {
              type: "object",
              properties: {
                momcid: constraint.CID(),
                childcid: constraint,
                childpid,
                childhospcode,
                childname,
                datepickerchild,
                sexchild,
                gaweek,
                childfullname,
                childbtime,
                childabo,
                childrh,
                childmemo,
                lowbtweigth,
                birthAsphyxia,
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
    }
}
