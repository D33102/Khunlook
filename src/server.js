import Fastify from "fastify";
import { registerDb } from "./plugins/dbConnection.js";
import dotenv from "dotenv";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import cors from "@fastify/cors";
import { testRoute } from "./routes/test.js";
import { swaggerOptions, swaggerUiOptions } from "./utils/swagger.js";
import { userRoute } from "./routes/user.js";

dotenv.config();

const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, {
  origin: "http://localhost:3000", // Allow requests from Next.js app
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
});

// Swagger
fastify.register(fastifySwagger, swaggerOptions);
fastify.register(fastifySwaggerUi, swaggerUiOptions);

// Db connection
registerDb(fastify);

// Routes
fastify.register(testRoute, { prefix: "/" });
fastify.register(userRoute, { prefix: "/user" });

const start = async () => {
  try {
    await fastify.listen({ port: parseInt(process.env.PORT), host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
