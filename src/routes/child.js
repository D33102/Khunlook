import { childController } from "../controllers/auth.js";
import { childSchema } from "../models/child.js";
export function childRoute(fastify, options, done) {
  fastify.get(
    "/:user_id",
    {
      preValidation: [fastify.authenticate],
      schema: userController.getChildren.schema,
    },
    childController.getChild.handler
  );
  fastify.post("/", {
    preValidation: [fastify.authenticate],
    schema: childSchema.addChildSchema,
  },
  childController.addChild.handler);
  done();
}
