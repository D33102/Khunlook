import Fastify from "fastify";
import pool from "./database/dbConnection.js";

const fastify = Fastify({
  logger: true,
});

fastify.decorate("mysql", pool);

fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

const start = async () => {
  try {
    await fastify.listen({ port: 3002 });
    console.log(`Server is running at http://localhost:3002`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
