import { summarySchema } from "../models/summary.js";
import { convertThaiDatetoStd } from "../utils/date.js";

export const summaryController = {
  saveInfo: {
    schema: summarySchema.saveSchema,
    handler: async (request, reply) => {
      try {
        let { hospcode, pid, date_serv, age, eval_type, eval_result } =
          request.body;

        if (
          !hospcode ||
          !pid ||
          !date_serv ||
          !age ||
          !eval_type ||
          !eval_result
        ) {
          return reply
            .status(400)
            .send({ success: false, message: "Missing required fields" });
        }

        date_serv = convertThaiDatetoStd(date_serv);

        const query = `
      INSERT INTO SUMMARY_INFO (HOSPCODE, PID, DATE_SERV, AGE, EVALUATION_TYPE, EVALUATION_RESULT)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        DATE_SERV = VALUES(DATE_SERV),
        AGE = VALUES(AGE),
        EVALUATION_RESULT = VALUES(EVALUATION_RESULT);
    `;

        await request.server.execute(query, [
          hospcode,
          pid,
          formattedDate,
          age,
          eval_type,
          eval_result,
        ]);

        return reply
          .status(200)
          .send({ success: true, message: "Data saved successfully" });
      } catch (err) {
        request.server.log.error(err);
        return reply.status(500).send({
          success: false,
          message: "Internal Server Error",
          error: err.message,
        });
      }
    },
  },
};
