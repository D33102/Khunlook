import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifySwagger from "@fastify/swagger";
import xss from "xss";
import fastifySwaggerUi from "@fastify/swagger-ui";
import dotenv from "dotenv";
import Fastify from "fastify";
import { registerDb } from "./plugins/dbConnection.js";
import { authRoute } from "./routes/auth.js";
import { userRoute } from "./routes/user.js";
import { swaggerOptions, swaggerUiOptions } from "./utils/swagger.js";
import { vaccineRoute } from "./routes/vaccine.js";
import { developmentRoute } from "./routes/development.js";
import { growthRoute } from "./routes/growth.js";
import { childRoute } from "./routes/child.js";
import { summaryRoute } from "./routes/summary.js";
import { adviceRoute } from "./routes/advice.js";

dotenv.config();

const SECRET = "SECRET";

const fastify = Fastify({
  logger: true,
});

await fastify.register(fastifyCookie);
await fastify.register(fastifyHelmet, {
  contentSecurityPolicy: false,
});
await fastify.register(fastifyRateLimit, {
  max: 100,
  timeWindow: "1 minute",
});

// Sanitizing function to prevent XSS
const sanitize = (data) => {
  if (typeof data === "string") {
    return xss(data); // Sanitize string inputs
  } else if (typeof data === "object") {
    for (const key in data) {
      data[key] = sanitize(data[key]); // Recursively sanitize object keys and values
    }
    return data;
  }
  return data;
};

// Pre-validation hook to sanitize the request body, query, and params
fastify.addHook("preValidation", async (request, reply) => {
  if (request.body) {
    request.body = sanitize(request.body);
  }
  if (request.query) {
    request.query = sanitize(request.query);
  }
  if (request.params) {
    request.params = sanitize(request.params);
  }
});

await fastify.register(cors, {
  origin: ["*"],
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
    return reply.status(401).send({
      success: false,
      message: "Unauthorized",
      error: "Login required",
    });
  }
});

// Db connection
registerDb(fastify);

// Routes
fastify.get("/", async (request, reply) => {
  reply.send({ message: "Hello, Fastify!" });
});

fastify.register(
  async function (apiV1Routes) {
    apiV1Routes.register(userRoute, { prefix: "/user" });
    apiV1Routes.register(authRoute, { prefix: "/auth" });
    apiV1Routes.register(vaccineRoute, { prefix: "/vaccine" });
    apiV1Routes.register(developmentRoute, { prefix: "/development" });
    apiV1Routes.register(growthRoute, { prefix: "/growth" });
    apiV1Routes.register(childRoute, { prefix: "/child" });
    apiV1Routes.register(summaryRoute, { prefix: "/summary" });
    apiV1Routes.register(adviceRoute, { prefix: "/advice" });
  },
  { prefix: "/api/v1" },
);

const PORT = parseInt(process.env.PORT) || 3003;

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

export default fastify;
