import { growthController } from "../controllers/growth.js";
export function growthRoute(fastify, options, done) {
  fastify.post(
    "/information",
    {
      preValidation: [fastify.authenticate],
      schema: growthController.getInformation.schema,
    },
    growthController.getInformation.handler
  );
  fastify.post(
    "/validate",
    {
      preValidation: [fastify.authenticate],
      schema: growthController.growthValidate.schema,
    },
    growthController.growthValidate.handler
  );
  fastify.post(
    "/query-result",
    {
      preValidation: [fastify.authenticate],
      schema: growthController.growthQueryResult.schema,
    },
    growthController.growthQueryResult.handler
  );
  done();
}
