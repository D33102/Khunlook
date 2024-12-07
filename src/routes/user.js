import { userController } from "../controllers/user.js";

export function userRoute(fastify, options, done) {
  fastify.post("/", userController.userRegister);
  fastify.get(
    "/:id",
    {
      preValidation: [fastify.authenticate],
      schema: userController.getUserChildren.schema,
    },
    userController.getUserChildren.handler
  );
  done();
}
