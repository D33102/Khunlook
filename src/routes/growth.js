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
  done();
}
