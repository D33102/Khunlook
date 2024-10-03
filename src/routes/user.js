import { testController } from "../controllers/test.js";
import { userController } from "../controllers/user.js";

export function userRoute(fastify, options, done) {
  fastify.get("/", testController.testGreet);

  fastify.get("/test", testController.testHand);
  
  fastify.post("/", userController.userRegister)
  done();
}
