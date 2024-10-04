import { authController } from "../controllers/auth.js";
export function authRoute(fastify, options, done) {
  fastify.post("/", authController.userLogin);

  done();
}
