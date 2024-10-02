import Fastify from "fastify";
import pool from "./database/dbConnection.js";
import dotenv from "dotenv";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { testRoute } from "./routes/test.js";
import { swaggerOptions, swaggerUiOptions } from "./utils/swagger.js";

dotenv.config();

const fastify = Fastify({
  logger: true,
});

// Swagger
fastify.register(fastifySwagger, swaggerOptions);
fastify.register(fastifySwaggerUi, swaggerUiOptions);

// Db connection
fastify.decorate("mysql", pool);

// Routes
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
