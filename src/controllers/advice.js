import { adviceSchema } from "../models/advice.js";

export const adviceController = {
  getProperAdvice: {
    schema: adviceSchema.getProperAdvice,
    handler: async (request, reply) => {
        try{
            const {currentAge} = request.body
            const [rows] = await request.server.mysql.execute(
                `
                SELECT CODE, AGE_MONTH_DESCRIPTION, INFORMATION 
                FROM GL_NUTRITION 
                WHERE ? >= MIN_AGE_MONTH && ? <= MAX_AGE_MONTH`,
                [parseInt(currentAge), parseInt(currentAge)]
              );
              if (rows.length == 0){
                return reply.status(404).send({
                    success:false,
                    message:"query not found",
                    error: "query not found"
                })
              }
              console.log(rows[0])
              return reply.status(200).send({
                success:true,
                message:"query proper advice success",
                data: rows[0]
              })

        }
        catch(err){
            request.server.log.error(err);
            return reply.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: err.message ||"An unexpected error occurred. Please try again later.",
            });
        }
    },
  },
}
