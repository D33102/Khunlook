import { childController } from "../controllers/auth.js";
export function authRoute(fastify, options, done) {
  fastify.post("/", {
    preValidation: [fastify.authenticate],
    schema: developmentController.getInformationDevelopment.schema,
  },
  developmentController.getInformationDevelopment.handler);
  done();
}
