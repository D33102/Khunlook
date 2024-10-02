import { testController } from "../controllers/test.js";

export function testRoute(fastify, options, done) {
  fastify.get("/", testController.testGreet);

  fastify.get("/test", testController.testHand);

  done();
}
