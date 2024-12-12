import { userSchema } from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateUniquePID } from "../utils/generator.js";

export const userController = {
  userRegister: {
    schema: userSchema.userRegisterSchema,
    handler: async (request, reply) => {
      try {
        const { NAME, USERNAME, PASSWORD, EMAIL, PHONE_NUMBER } = request.body;

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
        const PID = await generateUniquePID(request);

        const [result] = await request.server.mysql.execute(
          "INSERT INTO PERSON (`NAME`, `PID`) VALUES (?, ?)",
          [NAME, PID]
        );

        const ID = result.insertId;

        await request.server.mysql.execute(
          "INSERT INTO USER (`ID`, `NAME`, `USERNAME`, `PASSWORD`, `EMAIL`, `PHONE_NUMBER`) VALUES (?, ?, ?, ?, ?, ?)",
          [ID, NAME, USERNAME, hashedPassword, EMAIL, PHONE_NUMBER]
        );

        return reply.status(200).send({ message: "successfully registered" });
      } catch (err) {
        request.server.log.error(err);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    },
  },
};
