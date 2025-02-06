import { adviceController } from "../controllers/advice.js";

export function adviceRoute(fastify, options, done) {
  fastify.post(
    "/proper-advice",
    {
      schema: adviceController.getProperAdvice.schema
    },
    adviceController.getProperAdvice.handler
  );
  done();
}
