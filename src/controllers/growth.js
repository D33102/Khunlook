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
        WHERE NUTRITION.PID = '${childpid}' 
        ORDER BY NUTRITION.DATE_SERV`;

        const [rows] = await request.server.mysql.execute(query);
        if (rows.length > 0) {
          return reply.status(200).send({ success: 1, content: rows });
        }
        return reply
          .status(404)
          .send({ success: 0, message: "query not found" });
      } catch (err) {
        reply.status(400).send(err);
      }
    },
  },
};
