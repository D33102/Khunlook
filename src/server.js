import Fastify from "fastify";
import pool from "./database/dbConnection.js";

const fastify = Fastify({
  logger: true,
});

fastify.decorate("mysql", pool);

fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

fastify.get("/tt", function (request, reply) {
  reply.send({ hello: "test" });
});

const start = async () => {
  try {
    await fastify.listen({ port: 3002, host: "0.0.0.0" });
    console.log("Server listening on http://0.0.0.0:3002");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
