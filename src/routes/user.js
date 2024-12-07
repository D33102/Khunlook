import { userController } from "../controllers/user.js";

export function userRoute(fastify, options, done) {
  fastify.post("/", userController.userRegister);
  fastify.get("/:id", userController.getUserChildren)
  done();
}
