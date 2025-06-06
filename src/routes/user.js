import { userController } from "../controllers/user.js";

export function userRoute(fastify, options, done) {
  fastify.post(
    "/",
    { schema: userController.userRegister.schema },
    userController.userRegister.handler
  );

  done();
}
