import { authSchema } from "../models/auth.js";
import bcrypt from "bcrypt";

export const authController = {
  userLogin: {
    schema: authSchema.loginSchema,
    handler: async (request, reply) => {
      try {
        const { USERNAME, PASSWORD } = request.body;

        const [rows] = await request.server.mysql.execute(
          "SELECT * FROM USER WHERE `USERNAME` = ?",
          [USERNAME]
        );

        if (rows.length === 0) {
          return reply
            .status(401)
            .send({ error: "Invalid username or password" });
        }

        const user = rows[0];

        const isPasswordValid = await bcrypt.compare(PASSWORD, user.PASSWORD);
        if (!isPasswordValid) {
          return reply
            .status(401)
            .send({ error: "Invalid username or password" });
        }

        const accessToken = request.server.jwt.sign(
          { username: USERNAME },
          { expiresIn: "1hr" } // Access token expires in 1 hour
        );

        // Generate refresh token
        const refreshToken = request.server.jwt.sign(
          { username: USERNAME },
          { expiresIn: "12hr" } // Refresh token expires in 12 hours
        );

        return reply.status(200).send({ accessToken, refreshToken });
      } catch (err) {
        request.server.log.error(err);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    },
  },
  refreshToken: {
    schema: authSchema.refreshSchema,
    handler: async (request, reply) => {
      const { refreshToken } = request.body;
      if (!refreshToken) {
        return reply.status(403).send({ error: "Refresh Token is required" });
      }

      try {
        const decoded = request.server.jwt.verify(refreshToken);

        const newAccessToken = request.server.jwt.sign(
          { username: decoded.username },
          { expiresIn: "1hr" }
        );

        return reply.status(200).send({
          accessToken: newAccessToken,
          refreshToken,
        });
      } catch (err) {
        return reply
          .status(403)
          .send({ error: "Invalid or expired Refresh Token" });
      }
    },
  },
};
