import { summaryController } from "../controllers/summary.js";

export function summaryRoute(fastify, options, done) {
  fastify.post(
    "/info/save",
    {
      preValidation: [fastify.authenticate],
      schema: summaryController.saveInfo.schema,
    },
    summaryController.saveInfo.handler
  );

  fastify.post(
    "/info/get-information",
    {
      preValidation: [fastify.authenticate],
      schema: summaryController.infoGetInformation.schema,
    },
    summaryController.infoGetInformation.handler
  );

  done();
}
