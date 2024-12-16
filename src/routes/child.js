import { childController } from "../controllers/child.js";
import { childSchema } from "../models/child.js";
export function childRoute(fastify, options, done) {
  fastify.get(
    "/:user_id",
    {
      preValidation: [fastify.authenticate],
      schema: childController.getChild.schema,
    },
    childController.getChild.handler
  );
  fastify.post(
    "/",
    {
      preValidation: [fastify.authenticate],
      schema: childSchema.addChildSchema,
    },
    childController.addChild.handler
  );
  fastify.post(
    "/edit",
    {
      preValidation: [fastify.authenticate],
      schema: childSchema.editChildSchema,
    },
    childController.editChild.handler
  )
  done();
}
