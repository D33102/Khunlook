import { authController, refreshController } from "../controllers/auth.js";
export function authRoute(fastify, options, done) {
  fastify.post("/", authController.userLogin);
  fastify.get("/refresh", authController.refreshController);

  done();
}
