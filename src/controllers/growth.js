import { growthSchema } from "../models/growth.js";

export const growthController = {
  getInformation: {
    schema: growthSchema.getInformationSchema,
    handler: async (request, reply) => {
      try {
        const { childpid, previous_chosen } = request.body;
        const query = `SELECT NUTRITION.ID, NUTRITION.DATE_SERV, NUTRITION.WEIGHT, NUTRITION.HEIGHT, 
        NUTRITION.HEADCIRCUM, PERSON.SEX, PERSON.BIRTH, 
        (timestampdiff(DAY, PERSON.BIRTH, NUTRITION.DATE_SERV)) AS AGEDAY, 
        (timestampdiff(MONTH, PERSON.BIRTH, NUTRITION.DATE_SERV)) AS AGEMONTH, 
        NEWBORN.GA 
        FROM NUTRITION 
        LEFT JOIN PERSON ON PERSON.PID = NUTRITION.PID 
        LEFT JOIN NEWBORN ON NEWBORN.PID = NUTRITION.PID AND PERSON.HOSPCODE = NUTRITION.HOSPCODE 
        WHERE NUTRITION.PID = ? 
        ORDER BY NUTRITION.DATE_SERV`;

        const [rows] = await request.server.mysql.execute(query, [childpid]);
        if (rows.length > 0)
          return reply.status(200).send({
            success: true,
            message: "query successfully",
            data: rows,
          });
        return reply.status(404).send({
          success: 0,
          message: "query not found",
          error: "No data from input query",
        });
      } catch (err) {
        request.server.log.error(err);
        return reply.status(500).send({
          success: false,
          message: "Failed to get data",
          error: err.message || "Internal Server Error",
        });
      }
    },
  },
  growthValidate: {
    schema: growthSchema.growthValidateSchema,
    handler: async (request, reply) => {
      try {
        const {
          servicedatepicker,
          datepicker,
          weight,
          height,
          hcir,
          nuchildsex,
          nuchildhospcode,
          nuchildpid,
          nuchildname,
          changedropdown,
          previous_chosen,
        } = request.body;
        const requiredFields = [
          "servicedatepicker",
          "weight",
          "height",
          "hcir",
          "nuchildhospcode",
          "nuchildpid",
        ];
        const missingFields = requiredFields.filter(
          (field) => !request.body[field]
        );

        if (missingFields.length > 0) {
          return reply.status(400).send({
            success: false,
            message: "Invalid input data",
            error: "Missing required parameters: " + missingFields.join(", "),
          });
        }
        const currentdate = new Date();
        const query =
          "INSERT INTO NUTRITION (HOSPCODE,PID,DATE_SERV,WEIGHT,HEIGHT,HEADCIRCUM,D_UPDATE) VALUES (?,?,?,?,?,?,?)";
        await request.server.mysql.execute(query, [
          nuchildhospcode,
          nuchildpid,
          servicedatepicker,
          weight,
          height,
          hcir,
          currentdate,
        ]);
        return reply.status(201).send({
          success: true,
          message: "successfully insert data",
          data: {
            servicedatepicker,
            weight,
            height,
            hcir,
            nuchildhospcode,
            nuchildpid,
          },
        });
      } catch (err) {
        request.server.log.error(err);
        return reply.status(500).send({
          success: false,
          message: "Failed to insert data",
          error: err.message || "Internal Server Error",
        });
      }
    },
  },
  growthQueryResult: {
    schema: growthSchema.growthQueryResultSchema,
    handler: async (request, reply) => {
      const {
        sex,
        typeGraph,
        maxFirstGl,
        minFirstGl,
        maxSecondGl,
        minSecondGl,
        maxThirdGl,
        minThirdGl,
        HC_WHO = -1,
        HC = -1,
      } = request.body;
      let query = "";
      const rows1 = [];

      switch (typeGraph) {
        case 0:
          query = "SELECT * FROM `GL_GROWTH_CHILD_AGE_WHO`";
          break;

        case 1:
          if (HC_WHO !== -1 && HC !== -1) {
            query = `SELECT GL_GROWTH_CHILD_PERCENTILE_HEAD_CIRCUMFERENCE_WHO.*, 'GL_GROWTH_CHILD_PERCENTILE_HEAD_CIRCUMFERENCE_WHO' AS TBName FROM GL_GROWTH_CHILD_PERCENTILE_HEAD_CIRCUMFERENCE_WHO WHERE SEX = '${sex}' AND AGE_YEAR_AS_MONTH <= 60`;
            if ((result = await mysqli.query(query))) {
              rows1.push(...result);
            }
            query = `SELECT GL_GROWTH_CHILD_PERCENTILE_HEAD_CIRCUMFERENCE.*, 'GL_GROWTH_CHILD_PERCENTILE_HEAD_CIRCUMFERENCE' AS TBName FROM GL_GROWTH_CHILD_PERCENTILE_HEAD_CIRCUMFERENCE WHERE SEX = '${sex}' AND AGE_YEAR_AS_MONTH > 60`;
          } else if (HC_WHO !== -1 && HC === -1) {
            query = `SELECT GL_GROWTH_CHILD_PERCENTILE_HEAD_CIRCUMFERENCE_WHO.*, 'GL_GROWTH_CHILD_PERCENTILE_HEAD_CIRCUMFERENCE_WHO' AS TBName FROM GL_GROWTH_CHILD_PERCENTILE_HEAD_CIRCUMFERENCE_WHO WHERE SEX = '${sex}'`;
          } else if (HC_WHO === -1 && HC !== -1) {
            query = `SELECT GL_GROWTH_CHILD_PERCENTILE_HEAD_CIRCUMFERENCE.*, 'GL_GROWTH_CHILD_PERCENTILE_HEAD_CIRCUMFERENCE' AS TBName FROM GL_GROWTH_CHILD_PERCENTILE_HEAD_CIRCUMFERENCE WHERE SEX = '${sex}'`;
          } else {
            query = `SELECT GL_GROWTH_CHILD_PERCENTILE_HEAD_CIRCUMFERENCE_WHO.*, 'GL_GROWTH_CHILD_PERCENTILE_HEAD_CIRCUMFERENCE_WHO' AS TBName FROM GL_GROWTH_CHILD_PERCENTILE_HEAD_CIRCUMFERENCE_WHO WHERE SEX = '${sex}'`;
          }
          break;

        case 2:
          const columnsGl =
            sex === 1
              ? "`M_LESS5` AS LESS5, `M_LESS3` AS LESS3, `M_LESS1` AS LESS1, `M_MORE2` AS MORE2, `M_MORE4` AS MORE4"
              : "`F_LESS5` AS LESS5, `F_LESS3` AS LESS3, `F_LESS1` AS LESS1, `F_MORE2` AS MORE2, `F_MORE4` AS MORE4";
          if (sex === 1) {
            if (
              minThirdGL === 0 &&
              maxThirdGL === 999 &&
              minSecondGL === 0 &&
              maxSecondGL === 0 &&
              minFirstGL === 0 &&
              maxFirstGL === 0
            ) {
              query = `SELECT HEIGHT, ${columnsGl}, 'GL_GROWTH_CHILD_WEIGHT_HEIGHT' AS TBName FROM GL_GROWTH_CHILD_WEIGHT_HEIGHT`;
            } else if (
              minThirdGL === 0 &&
              maxThirdGL === 0 &&
              minSecondGL === 0 &&
              maxSecondGL === 999 &&
              minFirstGL === 0 &&
              maxFirstGL === 0
            ) {
              query = `SELECT HEIGHT, ${columnsGl}, 'GL_GROWTH_CHILD_WEIGHT_HEIGHT_WHO' AS TBName FROM GL_GROWTH_CHILD_WEIGHT_HEIGHT_WHO`;
            } else {
              query = `SELECT LENGTH AS HEIGHT, ${columnsGl}, 'GL_GROWTH_CHILD_WEIGHT_LENGTH_WHO' AS TBName FROM GL_GROWTH_CHILD_WEIGHT_LENGTH_WHO WHERE LENGTH BETWEEN '${minFirstGL}' AND '${maxFirstGL}' AND LENGTH NOT LIKE '%.5' UNION SELECT HEIGHT, ${columnsGl}, 'GL_GROWTH_CHILD_WEIGHT_HEIGHT_WHO' AS TBName FROM GL_GROWTH_CHILD_WEIGHT_HEIGHT_WHO WHERE HEIGHT BETWEEN '${minSecondGL}' AND '${maxSecondGL}' AND HEIGHT NOT LIKE '%.5' UNION SELECT HEIGHT, ${columnsGl}, 'GL_GROWTH_CHILD_WEIGHT_HEIGHT' AS TBName FROM GL_GROWTH_CHILD_WEIGHT_HEIGHT WHERE HEIGHT BETWEEN '${minThirdGL}' AND '${maxThirdGL}'`;
            }
          } else if (sex === 2) {
            if (
              minThirdGL === 0 &&
              maxThirdGL === 999 &&
              minSecondGL === 0 &&
              maxSecondGL === 0 &&
              minFirstGL === 0 &&
              maxFirstGL === 0
            ) {
              query = `SELECT HEIGHT, ${columnsGl}, 'GL_GROWTH_CHILD_WEIGHT_HEIGHT' AS TBName FROM GL_GROWTH_CHILD_WEIGHT_HEIGHT WHERE F_LESS5 <> 0`;
            } else if (
              minThirdGL === 0 &&
              maxThirdGL === 0 &&
              minSecondGL === 0 &&
              maxSecondGL === 999 &&
              minFirstGL === 0 &&
              maxFirstGL === 0
            ) {
              query = `SELECT HEIGHT, ${columnsGl}, 'GL_GROWTH_CHILD_WEIGHT_HEIGHT_WHO' AS TBName FROM GL_GROWTH_CHILD_WEIGHT_HEIGHT_WHO WHERE F_LESS5 <> 0`;
            } else {
              query = `SELECT LENGTH AS HEIGHT, ${columnsGl}, 'GL_GROWTH_CHILD_WEIGHT_LENGTH_WHO' AS TBName FROM GL_GROWTH_CHILD_WEIGHT_LENGTH_WHO WHERE LENGTH BETWEEN '${minFirstGL}' AND '${maxFirstGL}' AND LENGTH NOT LIKE '%.5' AND F_LESS5 <> 0 UNION SELECT HEIGHT, ${columnsGl}, 'GL_GROWTH_CHILD_WEIGHT_HEIGHT_WHO' AS TBName FROM GL_GROWTH_CHILD_WEIGHT_HEIGHT_WHO WHERE HEIGHT BETWEEN '${minSecondGL}' AND '${maxSecondGL}' AND HEIGHT NOT LIKE '%.5' AND F_LESS5 <> 0 UNION SELECT HEIGHT, ${columnsGl}, 'GL_GROWTH_CHILD_WEIGHT_HEIGHT' AS TBName FROM GL_GROWTH_CHILD_WEIGHT_HEIGHT WHERE HEIGHT BETWEEN '${minThirdGL}' AND '${maxThirdGL}'`;
            }
          }
          break;

        case 3:
          query = "SELECT * FROM `GL_GROWTH_CHILD_PERCENTILE_AGE_HEIGHT_WHO`";
          break;

        case 4:
          query = "SELECT * FROM `GL_GROWTH_CHILD_PERCENTILE_AGE_WEIGHT_WHO`";
          break;

        case 5:
          query = `SELECT GL_GROWTH_CHILD_PERCENTILE_WEIGHT_LENGTH_WHO.*, 'GL_GROWTH_CHILD_PERCENTILE_WEIGHT_LENGTH_WHO' AS TBName FROM GL_GROWTH_CHILD_PERCENTILE_WEIGHT_LENGTH_WHO WHERE SEX = '${sex}' AND LENGTH BETWEEN '${minFirstGL}' AND '${maxFirstGL}'`;
          break;

        case 6:
          query = "SELECT * FROM `GL_GROWTH_CHILD_AGE_HEIGHT_RESULT`";
          break;

        case 7:
          query = "SELECT * FROM `GL_GROWTH_CHILD_AGE_WEIGHT_RESULT`";
          break;

        case 8:
          query =
            "SELECT * FROM `GL_GROWTH_CHILD_PERCENTILE_HEAD_CIRCUMFERENCE_RESULT`";
          break;

        case 9:
          query = "SELECT * FROM `GL_GROWTH_CHILD_WEIGHT_HEIGHT_RESULT`";
          break;

        case 10:
          query =
            sex === 1
              ? `SELECT LENGTH AS HEIGHT FROM GL_GROWTH_CHILD_WEIGHT_LENGTH_WHO ORDER BY HEIGHT DESC LIMIT 1 UNION SELECT HEIGHT FROM GL_GROWTH_CHILD_WEIGHT_HEIGHT_WHO ORDER BY HEIGHT DESC LIMIT 1 UNION SELECT HEIGHT FROM GL_GROWTH_CHILD_WEIGHT_HEIGHT ORDER BY HEIGHT DESC LIMIT 1 UNION SELECT LENGTH AS HEIGHT FROM GL_GROWTH_CHILD_WEIGHT_LENGTH_WHO ORDER BY HEIGHT ASC LIMIT 1 UNION SELECT HEIGHT FROM GL_GROWTH_CHILD_WEIGHT_HEIGHT_WHO ORDER BY HEIGHT ASC LIMIT 1 UNION SELECT HEIGHT FROM GL_GROWTH_CHILD_WEIGHT_HEIGHT ORDER BY HEIGHT ASC LIMIT 1`
              : `SELECT LENGTH AS HEIGHT FROM GL_GROWTH_CHILD_WEIGHT_LENGTH_WHO WHERE F_LESS5 <> 0 ORDER BY HEIGHT DESC LIMIT 1 UNION SELECT HEIGHT FROM GL_GROWTH_CHILD_WEIGHT_HEIGHT_WHO WHERE F_LESS5 <> 0 ORDER BY HEIGHT DESC LIMIT 1 UNION SELECT HEIGHT FROM GL_GROWTH_CHILD_WEIGHT_HEIGHT WHERE F_LESS5 <> 0 ORDER BY HEIGHT DESC LIMIT 1 UNION SELECT LENGTH AS HEIGHT FROM GL_GROWTH_CHILD_WEIGHT_LENGTH_WHO ORDER BY HEIGHT ASC LIMIT 1 UNION SELECT HEIGHT FROM GL_GROWTH_CHILD_WEIGHT_HEIGHT_WHO ORDER BY HEIGHT ASC LIMIT 1 UNION SELECT HEIGHT FROM GL_GROWTH_CHILD_WEIGHT_HEIGHT ORDER BY HEIGHT ASC LIMIT 1`;
          break;

        default:
          throw new Error("Invalid typeGraph value");
      }

      if (query) {
        const result = await mysqli.query(query);
        rows1.push(...result);
      }
      reply
        .status(200)
        .send({ success: true, message: "Growth query success", data: rows1 });
    },
  },
};
