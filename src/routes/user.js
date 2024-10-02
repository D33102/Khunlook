import { testController } from "../controllers/test.js";

export function userRoute(fastify, options, done) {
  fastify.get("/", testController.testGreet);

  fastify.get("/test", testController.testHand);

  done();
}
