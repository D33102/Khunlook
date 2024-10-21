import { growthSchema } from "../models/growth.js";

export const growthController = {
  getInformation: {
    schema: growthSchema.getInformationSchema,
    handler: async (request, reply) => {
      try {
        const { childpid = null, previous_chosen = null } = request.body;
        const query = `SELECT NUTRITION.ID, NUTRITION.DATE_SERV, NUTRITION.WEIGHT, NUTRITION.HEIGHT, 
        NUTRITION.HEADCIRCUM, PERSON.SEX, PERSON.BIRTH, 
        (timestampdiff(DAY, PERSON.BIRTH, NUTRITION.DATE_SERV)) AS AGEDAY, 
        (timestampdiff(MONTH, PERSON.BIRTH, NUTRITION.DATE_SERV)) AS AGEMONTH, 
        NEWBORN.GA 
        FROM NUTRITION 
        LEFT JOIN PERSON ON PERSON.PID = NUTRITION.PID 
        LEFT JOIN NEWBORN ON NEWBORN.PID = NUTRITION.PID AND PERSON.HOSPCODE = NUTRITION.HOSPCODE 
        WHERE NUTRITION.PID = ? 
        ORDER BY NUTRITION.DATE_SERV`;

        const [rows] = await request.server.mysql.execute(query, [childpid]);
        if (rows.length > 0)
          return reply.status(200).send({
            success: true,
            message: "query successfully",
            data: rows,
          });
        return reply.status(404).send({
          success: 0,
          message: "query not found",
          error: "No data from input query",
        });
      } catch (err) {
        request.server.log.error(err);
        return reply.status(500).send({
          success: false,
          message: "Failed to get data",
          error: err.message || "Internal Server Error",
        });
      }
    },
  },
  growthValidate: {
    schema: growthSchema.growthValidateSchema,
    handler: async (request, reply) => {
      try {
        const {
          servicedatepicker,
          datepicker,
          weight,
          height,
          hcir,
          nuchildsex,
          nuchildhospcode,
          nuchildpid,
          nuchildname,
          changedropdown,
          previous_chosen,
        } = request.body;
        const requiredFields = [
          "servicedatepicker",
          "weight",
          "height",
          "hcir",
          "nuchildhospcode",
          "nuchildpid",
        ];
        const missingFields = requiredFields.filter(
          (field) => !request.body[field]
        );

        if (missingFields.length > 0) {
          return reply.status(400).send({
            success: false,
            message: "Invalid input data",
            error: "Missing required parameters: " + missingFields.join(", "),
          });
        }
        const currentdate = new Date();
        const query =
          "INSERT INTO NUTRITION (HOSPCODE,PID,DATE_SERV,WEIGHT,HEIGHT,HEADCIRCUM,D_UPDATE) VALUES (?,?,?,?,?,?,?)";
        await request.server.mysql.execute(query, [
          nuchildhospcode,
          nuchildpid,
          servicedatepicker,
          weight,
          height,
          hcir,
          currentdate,
        ]);
        return reply.status(201).send({
          success: true,
          message: "successfully insert data",
          data: {
            servicedatepicker,
            weight,
            height,
            hcir,
            nuchildhospcode,
            nuchildpid,
          },
        });
      } catch (err) {
        request.server.log.error(err);
        return reply.status(500).send({
          success: false,
          message: "Failed to insert data",
          error: err.message || "Internal Server Error",
        });
      }
    },
  },
};
