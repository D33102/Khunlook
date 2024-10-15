import { developmentController } from "../controllers/development";

export function developmentRoute(fastify, options, done) {
  fastify.post(
    "/information",
    {
      preValidation: [fastify.authenticate],
      schema: developmentController.getInformationDevelopment.schema
    },
    developmentController.getInformationDevelopment.handler
  );

  fastify.post(
    "/queryChild",
    {
      preValidation: [fastify.authenticate],
      schema: developmentController.queryChildDevelopment.schema,
    },
    developmentController.queryChildDevelopment.handler
  );
  fastify.post(
    "/queryConfig",
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
    "/typeResult",
    {
      preValidation: [fastify.authenticate],
      schema: developmentController.typeResultDevelopment.schema,
    },
    developmentController.typeResultDevelopment.handler
  );

  fastify.delete(
    "/",
    {
      preValidation: [fastify.authenticate],
      schema: developmentController.deleteDevelopment.schema,
    },
    developmentController.deleteDevelopment.handler
  );


  done();
}
