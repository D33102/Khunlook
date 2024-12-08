import { constraint } from "../utils/parameter"
export const childSchema={
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
