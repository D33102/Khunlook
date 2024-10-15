import { loginSchema } from "../models/auth.js";
export const authController = {
  userLogin: {
    schema: loginSchema.loginSchema,
    handler: async (request, reply) => {
      try {
        const { USERNAME, PASSWORD } = request.body;
        const [rows] = await request.server.mysql.execute(
          "SELECT * FROM USER WHERE `USERNAME` = ? AND `PASSWORD` = ?",
          [USERNAME, PASSWORD]
        );
        if (rows.length === 0) {
          return reply
            .status(401)
            .send({ error: "Invalid username or password" });
        }
        const accessToken = request.server.jwt.sign(
          { username: USERNAME },
          { expiresIn: "1h" }
        );
        const refreshToken = uuidv4();
        return reply.status(200).send({ accessToken, refreshToken });
      } catch (err) {
        request.server.log.error(err);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    },
  },
};
export const refreshController = {
  refreshToken: {
    schema: {
      body: {
        type: "object",
        properties: {
          refreshToken: { type: "string" },
        },
        required: ["refreshToken"],
      },
    },
    handler: async (request, reply) => {
      const { refreshToken } = request.body;

      // Validate the refresh token (check it against your database)
      // If valid, generate a new access token
      const newAccessToken = request.server.jwt.sign(
        { username: USERNAME },
        { expiresIn: "1h" }
      );

      return reply.status(200).send({ accessToken: newAccessToken });
    },
  },
};
