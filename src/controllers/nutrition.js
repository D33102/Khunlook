import { nutritionSchema } from "../models/nutrition.js";
import { ageDayBetween,calculateCorrectedAge } from "../utils/date.js";
export const nutritionController = {
  queryNutritionPlot: {
    schema: nutritionSchema.queryNutritionPlot,
    handler: async (request, reply) => {
        try{
            const {childpid} = request.body
            const [rows] = await request.server.mysql.execute(
                `
                SELECT NUTRITION.ID,NUTRITION.DATE_SERV,NUTRITION.WEIGHT,NUTRITION.HEIGHT,NUTRITION.HEADCIRCUM,PERSON.SEX,PERSON.BIRTH ,(timestampdiff(month,PERSON.BIRTH,NUTRITION.DATE_SERV)) AGEMONTH,NEWBORN.GA 
                FROM  
                NUTRITION 
                LEFT JOIN PERSON ON  PERSON.PID = NUTRITION.PID 
                LEFT JOIN NEWBORN ON NEWBORN.PID = NUTRITION.PID AND PERSON.HOSPCODE = NUTRITION.HOSPCODE 
                WHERE NUTRITION.PID = ? ORDER BY NUTRITION.DATE_SERV
                `
                [childpid]
              );
              if (rows.length == 0){
                return reply.status(404).send({
                    success:false,
                    message:"query not found",
                    error:  "query not found"
                })
              }
              console.log(rows)
              const nutritionData = rows.map(row => ({
                ID: row.ID,
                DATE_SERV: row.DATE_SERV,
                DOB: row.BIRTH,
                GENDER: row.SEX,
                AGEMONTH: row.AGEMONTH,
                AGEDAY: calculateCorrectedAge(row.BIRTH, row.GA, row.DATE_SERV),
                AGEDAYBET: ageDayBetween(row.BIRTH, row.DATE_SERV),
                WEIGHT: row.WEIGHT,
                HEIGHT: row.HEIGHT,
                HEADCIRCUM: row.HEADCIRCUM,
                GA: row.GA || 37
              }));
            //   console.log(rows[0])
              return reply.status(200).send({
                success:true,
                message:"query nutrition success",
                data: nutritionData
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
