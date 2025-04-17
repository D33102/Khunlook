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

        const formattedDate = convertThaiDatetoStd(date_serv);

        const query = `
      INSERT INTO SUMMARY_INFO (HOSPCODE, PID, DATE_SERV, AGE, EVALUATION_TYPE, EVALUATION_RESULT)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        DATE_SERV = VALUES(DATE_SERV),
        AGE = VALUES(AGE),
        EVALUATION_RESULT = VALUES(EVALUATION_RESULT);
    `;

        await request.server.mysql.execute(query, [
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
  infoGetInformation: {
    schema: summarySchema.getInfoSchema,
    handler: async (request, reply) => {
      try {
        let { query_childpid: childpid } = request.body;

        if (!childpid) {
          return reply
            .status(400)
            .send({ success: false, message: "Missing required fieldss" });
        }
        const query = `
      SELECT PERSON.NAME, PERSON.SEX, PERSON.BIRTH, PERSON.MOTHER, 
                       EPI.PID, CODE_EPI_VACCINETYPE.IN_PLAN, EPI.VACCINETYPE, 
                       EPI.DATE_SERV, CODE_EPI_VACCINETYPE.CODE, CODE_EPI_VACCINETYPE.WEB_GRP_NAME, 
                       CODE_EPI_VACCINETYPE.WEB_GRP_ORDER, CODE_EPI_VACCINETYPE.GRP_NAME, 
                       CODE_EPI_VACCINETYPE.DESCRIPTION_TH, CODE_EPI_VACCINETYPE.DESCRIPTION_TABLE, 
                       CODE_EPI_VACCINETYPE.AGE, CODE_EPI_VACCINETYPE.AGE_MAX, 
                       CODE_HOSPITAL.HOSPITAL, CODE_HOSPITAL.HOSPITALCODE, 
                       EPI_ADDITIONAL.AGE_MONTH 
                FROM EPI 
                LEFT JOIN CODE_EPI_VACCINETYPE ON EPI.VACCINETYPE = CODE_EPI_VACCINETYPE.CODE 
                LEFT JOIN CODE_HOSPITAL ON EPI.VACCINEPLACE = CODE_HOSPITAL.HOSPITALCODE 
                LEFT JOIN EPI_ADDITIONAL ON EPI.VACCINETYPE = EPI_ADDITIONAL.VACCINETYPE  
                    AND EPI.DATE_SERV = EPI_ADDITIONAL.DATE_SERV 
                LEFT JOIN PERSON ON PERSON.PID = EPI.PID  
                WHERE EPI.PID = ?
                ORDER BY 
                CASE WHEN CODE_EPI_VACCINETYPE.AGE REGEXP '^[0-9]+$' THEN CAST(CODE_EPI_VACCINETYPE.AGE AS UNSIGNED) ELSE NULL END ASC, EPI.PID ASC;
    `;
        const [result] = await request.server.mysql.query(query, [childpid]);

        return reply.status(200).send({ success: true, content: result });
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
