import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import dotenv from "dotenv";
import Fastify from "fastify";
import { registerDb } from "./plugins/dbConnection.js";
import { authRoute } from "./routes/auth.js";
import { testRoute } from "./routes/test.js";
import { userRoute } from "./routes/user.js";
import { swaggerOptions, swaggerUiOptions } from "./utils/swagger.js";
import { vaccineRoute } from "./routes/vaccine.js";
import { developmentRoute } from "./routes/development.js";

dotenv.config();

const SECRET = "SECRET";

const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, {
  origin: "http://localhost:3001", // Allow requests from Next.js app
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
});

// Swagger
fastify.register(fastifySwagger, swaggerOptions);
fastify.register(fastifySwaggerUi, swaggerUiOptions);

// JWT
fastify.register(fastifyJwt, {
  secret: SECRET,
});

fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// Db connection
registerDb(fastify);

// Routes
fastify.register(testRoute, { prefix: "/" });
fastify.register(userRoute, { prefix: "/user" });
fastify.register(authRoute, { prefix: "/auth" });
fastify.register(vaccineRoute, { prefix: "/vaccine" });
fastify.register(developmentRoute, {prefix: "/development"})

const start = async () => {
  try {
    await fastify.listen({ port: parseInt(process.env.PORT), host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
