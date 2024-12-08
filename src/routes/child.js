import { childController } from "../controllers/auth.js";
import { childSchema } from "../models/child.js";
export function childRoute(fastify, options, done) {
  fastify.post("/", {
    preValidation: [fastify.authenticate],
    schema: childSchema.addChildSchema,
  },
  childController.addChild.handler);
  done();
}
