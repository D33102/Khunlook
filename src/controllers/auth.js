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
        const token = request.server.jwt.sign({ username: USERNAME });
        return reply.status(200).send({ token: token });
      } catch (err) {
        request.server.log.error(err);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    },
  },
};
