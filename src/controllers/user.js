import { userSchema } from "../models/user.js";
export const userController = {
  userRegister: {
    schema: userSchema.userRegisterSchema,
    handler: async (request, reply) => {
      try {
        const { NAME, USERNAME, PASSWORD, EMAIL } = request.body;

        const [existingUser] = await request.server.mysql.execute(
            "SELECT * FROM USER WHERE `USERNAME`= ? OR `EMAIL`= ?",
            [USERNAME, EMAIL]
        )
        if (existingUser.length > 0){
            return reply.status(400).send({message: "Username or email already exists"});
        }
        
        await request.server.mysql.execute(
        "INSERT INTO USER (`NAME`, `USERNAME`, `PASSWORD`, `EMAIL`) VALUES (?, ?, ?, ?)",
        [NAME, USERNAME, PASSWORD, EMAIL]
        );

        return reply.status(200).send({message: "successfully registered"});
      } catch (err) {
        request.server.log.error(err);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    },
  },


};
