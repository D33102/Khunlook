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

  fastify.post(
    "/development/info",
    {
      preValidation: [fastify.authenticate],
      schema: summaryController.developmentInfo.schema,
    },
    summaryController.developmentInfo.handler
  );

  fastify.post(
    "/vaccine/info",
    {
      preValidation: [fastify.authenticate],
      schema: summaryController.vaccineInfo.schema,
    },
    summaryController.vaccineInfo.handler
  );
  done();
}
