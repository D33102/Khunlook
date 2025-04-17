import { userSchema } from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateUniquePID } from "../utils/generator.js";

export const userController = {
  userRegister: {
    schema: userSchema.userRegisterSchema,
    handler: async (request, reply) => {
      const connection = await request.server.mysql.getConnection();
      try {
        const { NAME, USERNAME, PASSWORD, EMAIL, PHONE_NUMBER, CID } = request.body;

        const [existingUser] = await connection.execute(
          "SELECT * FROM USER WHERE `USERNAME` = ? OR `EMAIL` = ? OR `CID` = ?",
          [USERNAME, EMAIL, CID]
        );

        if (existingUser.length > 0) {
          connection.release();
          return reply.status(400).send({ message: "Username, email or CID already exists" });
        }

        await connection.beginTransaction();

        const PID = await generateUniquePID(request);
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
        
        const [personResult] = await connection.execute(
          "INSERT INTO PERSON (`NAME`, `PID`, `CID`, `D_UPDATE`) VALUES (?, ?, ?, ?)",
          [NAME, PID, CID, formattedDate]
        );

        const hashedPassword = await bcrypt.hash(PASSWORD, 10);
        const ID = personResult.insertId;

        await connection.execute(
          "INSERT INTO USER (`ID`, `NAME`, `USERNAME`, `CID`, `PASSWORD`, `EMAIL`, `PHONE_NUMBER`) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [ID, NAME, USERNAME, CID, hashedPassword, EMAIL, PHONE_NUMBER]
        );
        
        await connection.execute(
          "INSERT INTO USER_CID (`ID`, `USERNAME`, `CID`, `D_UPDATE`) VALUES (?, ?, ?, ?)",
          [ID, USERNAME, CID, formattedDate]
        );

        await connection.commit();
        connection.release();

        return reply.status(200).send({ message: "Successfully registered" });
      } catch (err) {
        await connection.rollback();
        connection.release();
        request.server.log.error(err);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    },
  },
};
