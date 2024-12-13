import { developmentController } from "../controllers/development.js";

export function developmentRoute(fastify, options, done) {
  fastify.post(
    "/information",
    {
      preValidation: [fastify.authenticate],
      schema: developmentController.getInformationDevelopment.schema,
    },
    developmentController.getInformationDevelopment.handler
  );

  fastify.post(
    "/query-child",
    {
      preValidation: [fastify.authenticate],
      schema: developmentController.queryChildDevelopment.schema,
    },
    developmentController.queryChildDevelopment.handler
  );
  fastify.post(
    "/query-config",
    {
      preValidation: [fastify.authenticate],
      schema: developmentController.queryConfigDevelopment.schema,
    },
    developmentController.queryConfigDevelopment.handler
  );
  fastify.post(
    "/save",
    {
      preValidation: [fastify.authenticate],
      schema: developmentController.saveDevelopment.schema,
    },
    developmentController.saveDevelopment.handler
  );
  fastify.post(
    "/type-result",
    {
      preValidation: [fastify.authenticate],
      schema: developmentController.typeResultDevelopment.schema,
    },
    developmentController.typeResultDevelopment.handler
  );

  fastify.delete(
    "/:childpid/:devcode",
    {
      preValidation: [fastify.authenticate],
      schema: developmentController.deleteDevelopment.schema,
    },
    developmentController.deleteDevelopment.handler
  );

  done();
}
