import { userSchema } from "../models/user.js";
import bcrypt from "bcrypt";

export const userController = {
  userRegister: {
    schema: userSchema.userRegisterSchema,
    handler: async (request, reply) => {
      try {
        const { NAME, USERNAME, PASSWORD, EMAIL } = request.body;

        const [existingUser] = await request.server.mysql.execute(
          "SELECT * FROM USER WHERE `USERNAME`= ? OR `EMAIL`= ?",
          [USERNAME, EMAIL]
        );
        if (existingUser.length > 0) {
          return reply
            .status(400)
            .send({ message: "Username or email already exists" });
        }

        const hashedPassword = await bcrypt.hash(PASSWORD, 10);

        await request.server.mysql.execute(
          "INSERT INTO USER (`NAME`, `USERNAME`, `PASSWORD`, `EMAIL`) VALUES (?, ?, ?, ?)",
          [NAME, USERNAME, hashedPassword, EMAIL]
        );

        return reply.status(200).send({ message: "successfully registered" });
      } catch (err) {
        request.server.log.error(err);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    },
  },
  getUserChildren: {
    schema: userSchema.getUserChildSchema,
    handler: async (request, reply) => {
      const { user_id } = request.params;

      // Validate user_id
      if (!/^\d+$/.test(user_id) || parseInt(user_id, 10) < 1) {
        return reply.status(400).send({ error: 'Invalid user_id. It must be a positive integer.' });
      }

      try {

        // SQL Query using JOIN to fetch PERSON records associated with user_id
        const query = `
          SELECT p.*
          FROM USER u
          JOIN USER_CID uc ON u.ID = uc.USER_ID
          JOIN PERSON p ON uc.CID = p.CID
          WHERE u.ID = ?
        `;

        const [rows] = await request.server.mysql.execute(query, [parseInt(user_id, 10)]);


        if (rows.length === 0) {
          return reply.status(404).send({ error: 'User not found or no PERSON records associated.' });
        }

        return reply.send({ persons: rows });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Internal Server Error.' });
      }
    },
  }
};
