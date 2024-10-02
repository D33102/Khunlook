import { testSchema } from "../models/test.js";
export const testController = {
  testHand: {
    schema: testSchema.testHandSchema,
    handler: async (request, reply) => {
      try {
        const [rows] = await request.server.mysql.execute(
          "SELECT * FROM CODE_EPI_VACCINETYPE"
        );

        if (rows.length === 0) {
          request.log.info("No data found in CODE_EPI_VACCINETYPE");
          return reply.status(404).send({ message: "Data not found" });
        }

        return reply.send(rows);
      } catch (err) {
        request.server.log.error(err);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    },
  },

  testGreet: {
    schema: testSchema.testGreetSchema,
    handler: (request, reply) => {
      request.server.log.info("Greeting endpoint hit");
      reply.send({ hello: "world" });
    },
  },
};
