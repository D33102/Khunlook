import { testController } from "../controllers/test.js";

export function testRoute(fastify, options, done) {
  fastify.get("/", testController.testGreet);

  fastify.get(
    "/test",
    {
      preValidation: [fastify.authenticate],
      schema: testController.testHand.schema,
    },
    testController.testHand.handler
  );

  done();
}
