import Fastify from "fastify";
import pool from "./database/dbConnection.js";

const fastify = Fastify({
  logger: true,
});

fastify.decorate("mysql", pool);

fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

fastify.get("/test", async (request, reply) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM CODE_EPI_VACCINETYPE");

    if (rows.length === 0) {
      return reply.status(404).send({ message: "User not found" });
    }

    return rows[0];
  } catch (err) {
    fastify.log.error(err);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
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
