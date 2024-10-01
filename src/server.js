import Fastify from "fastify";
import pool from "./database/dbConnection.js";
import dotenv from "dotenv";
import { testRoute } from "./routes/test.js";

dotenv.config();

const fastify = Fastify({
  logger: true,
});

fastify.decorate("mysql", pool);

fastify.register(testRoute, { prefix: "/" });

const start = async () => {
  try {
    await fastify.listen({ port: parseInt(process.env.PORT), host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
