import { summarySchema } from "../models/summary.js";
import { convertThaiDatetoStd } from "../utils/date.js";

export const summaryController = {
  saveInfo: {
    schema: summarySchema.saveSchema,
    handler: async (request, reply) => {
      try {
        let { hospcode, pid, date_serv, age, eval_type, eval_result } =
          request.body;

        if (
          !hospcode ||
          !pid ||
          !date_serv ||
          !age ||
          !eval_type ||
          !eval_result
        ) {
          return reply
            .status(400)
            .send({ success: false, message: "Missing required fields" });
        }

        const formattedDate = convertThaiDatetoStd(date_serv);

        const query = `
      INSERT INTO SUMMARY_INFO (HOSPCODE, PID, DATE_SERV, AGE, EVALUATION_TYPE, EVALUATION_RESULT)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        DATE_SERV = VALUES(DATE_SERV),
        AGE = VALUES(AGE),
        EVALUATION_RESULT = VALUES(EVALUATION_RESULT);
    `;

        await request.server.mysql.execute(query, [
          hospcode,
          pid,
          formattedDate,
          age,
          eval_type,
          eval_result,
        ]);

        return reply
          .status(200)
          .send({ success: true, message: "Data saved successfully" });
      } catch (err) {
        request.server.log.error(err);
        return reply.status(500).send({
          success: false,
          message: "Internal Server Error",
          error: err.message,
        });
      }
    },
  },
  infoGetInformation: {
    schema: summarySchema.getInfoSchema,
    handler: async (request, reply) => {
      try {
        let { query_childpid: childpid } = request.body;

        if (!childpid) {
          return reply
            .status(400)
            .send({ success: false, message: "Missing required fieldss" });
        }
        const query = `
      SELECT PERSON.NAME, PERSON.SEX, PERSON.BIRTH, PERSON.MOTHER, 
                       EPI.PID, CODE_EPI_VACCINETYPE.IN_PLAN, EPI.VACCINETYPE, 
                       EPI.DATE_SERV, CODE_EPI_VACCINETYPE.CODE, CODE_EPI_VACCINETYPE.WEB_GRP_NAME, 
                       CODE_EPI_VACCINETYPE.WEB_GRP_ORDER, CODE_EPI_VACCINETYPE.GRP_NAME, 
                       CODE_EPI_VACCINETYPE.DESCRIPTION_TH, CODE_EPI_VACCINETYPE.DESCRIPTION_TABLE, 
                       CODE_EPI_VACCINETYPE.AGE, CODE_EPI_VACCINETYPE.AGE_MAX, 
                       CODE_HOSPITAL.HOSPITAL, CODE_HOSPITAL.HOSPITALCODE, 
                       EPI_ADDITIONAL.AGE_MONTH 
                FROM EPI 
                LEFT JOIN CODE_EPI_VACCINETYPE ON EPI.VACCINETYPE = CODE_EPI_VACCINETYPE.CODE 
                LEFT JOIN CODE_HOSPITAL ON EPI.VACCINEPLACE = CODE_HOSPITAL.HOSPITALCODE 
                LEFT JOIN EPI_ADDITIONAL ON EPI.VACCINETYPE = EPI_ADDITIONAL.VACCINETYPE  
                    AND EPI.DATE_SERV = EPI_ADDITIONAL.DATE_SERV 
                LEFT JOIN PERSON ON PERSON.PID = EPI.PID  
                WHERE EPI.PID = ?
                ORDER BY 
                CASE WHEN CODE_EPI_VACCINETYPE.AGE REGEXP '^[0-9]+$' THEN CAST(CODE_EPI_VACCINETYPE.AGE AS UNSIGNED) ELSE NULL END ASC, EPI.PID ASC;
    `;
        const [result] = await request.server.mysql.query(query, [childpid]);

        return reply.status(200).send({ success: true, content: result });
      } catch (err) {
        request.server.log.error(err);
        return reply.status(500).send({
          success: false,
          message: "Internal Server Error",
          error: err.message,
        });
      }
    },
  },
  developmentAndVaccineInfo: {
    schema: summarySchema.developmentAndVaccineInfoSchema,
    handler: async (request, reply) => {
      try {
        const {
          ageMin,
          ageMax,
          childpid,
          childbirth,
          childcorrectedbirth,
          loggedin,
          previous_chosen,
          tableName,
          childlowbtweigth,
        } = request.body;
        // Vaccine parameters
        const { loggedin: vaccineLoggedIn } = request.body;
        let vaccineContent = [],
          vaccineHistory = [];

        // Validate numeric ageMin and ageMax
        if (isNaN(ageMin) || isNaN(ageMax)) {
          return reply
            .status(400)
            .send({ success: false, message: "Invalid ageMin or ageMax" });
        }

        const db = request.server.mysql;
        let rows1 = [];

        // Content rows
        if (ageMax !== -1) {
          let query;
          if (
            tableName === "GL_DEVELOPMENT_DSPM" ||
            (tableName === "GL_DEVELOPMENT_DAIM" && ageMax > 24)
          ) {
            query = `
              SELECT
                d.MIN_AGE_MONTH,
                d.MAX_AGE_MONTH,
                d.CODE,
                d.TYPE,
                d.AGE_MONTH_DESCRIPTION,
                d.DESCRIPTION,
                d.INFORMATION,
                t.DESCRIPTION AS TYPE_DESCRIPTION,
                'GL_DEVELOPMENT_DSPM' AS TBName,
                d.SCREENING
              FROM GL_DEVELOPMENT_DSPM d
              LEFT JOIN GL_DEVELOPMENT_TYPE_DSPM_DAIM t
                ON d.TYPE = t.CODE
              WHERE d.MIN_AGE_MONTH = ? AND d.MAX_AGE_MONTH = ?
              ORDER BY d.TYPE ASC, d.CODE ASC
            `;
          } else if (tableName === "GL_DEVELOPMENT_DAIM") {
            query = `
              SELECT
                d.MIN_AGE_MONTH,
                d.MAX_AGE_MONTH,
                d.CODE,
                d.TYPE,
                d.AGE_MONTH_DESCRIPTION,
                d.DESCRIPTION,
                d.INFORMATION,
                t.DESCRIPTION AS TYPE_DESCRIPTION,
                'GL_DEVELOPMENT_DAIM' AS TBName,
                d.SCREENING
              FROM GL_DEVELOPMENT_DAIM d
              LEFT JOIN GL_DEVELOPMENT_TYPE_DSPM_DAIM t
                ON d.TYPE = t.CODE
              WHERE d.MIN_AGE_MONTH = ? AND d.MAX_AGE_MONTH = ?
              ORDER BY d.TYPE ASC, d.CODE ASC
            `;
          } else if (tableName === "GL_DEVELOPMENT") {
            query = `
              SELECT
                d.MIN_AGE_MONTH,
                d.MAX_AGE_MONTH,
                d.CODE,
                d.TYPE,
                d.AGE_MONTH_DESCRIPTION,
                d.DESCRIPTION,
                d.INFORMATION,
                t.DESCRIPTION AS TYPE_DESCRIPTION,
                'GL_DEVELOPMENT' AS TBName,
                0 AS SCREENING
              FROM GL_DEVELOPMENT d
              LEFT JOIN GL_DEVELOPMENT_TYPE t
                ON d.TYPE = t.CODE
              WHERE d.MIN_AGE_MONTH = ? AND d.MAX_AGE_MONTH = ?
              ORDER BY d.TYPE ASC, d.CODE ASC
            `;
          }
          const [contentRows] = await db.query(query, [ageMin, ageMax]);
          rows1 = contentRows;
        } else {
          // Summary page content when ageMax == -1
          const parameterNameMax = "MAX_ANAMAI55_DEVELOPMENT";
          const parameterNameMin = "MIN_ANAMAI55_DEVELOPMENT";
          // Fetch parameters and newborn data
          const [paramRows] = await db.query(
            `SELECT pc.PARAMETER_NAME, pc.PARAMETER_VALUE, n.ASPHYXIA, n.BWEIGHT
             FROM PARAMETER_CONFIGURATION pc
             INNER JOIN NEWBORN n ON n.PID = pc.PID
             WHERE pc.PID = ?`,
            [childpid]
          );

          let maxMonth = 0;
          let minMonth = 0;
          let beweight = 2500;
          let asphyxia = "2";

          for (const r of paramRows) {
            if (r.ASPHYXIA != null) {
              asphyxia = r.ASPHYXIA;
            }
            if (r.BWEIGHT != null) {
              beweight = r.BWEIGHT;
            }
            if (r.PARAMETER_NAME === parameterNameMax) {
              maxMonth = r.PARAMETER_VALUE;
            }
            if (r.PARAMETER_NAME === parameterNameMin) {
              minMonth = r.PARAMETER_VALUE;
            }
          }

          // Query GL_DEVELOPMENT
          const [devRows] = await db.query(
            `SELECT
              d.AGE_MONTH_DESCRIPTION,
              d.MIN_AGE_MONTH,
              d.MAX_AGE_MONTH,
              d.TYPE,
              'GL_DEVELOPMENT' AS TBName,
              0 AS SCREENING,
              1 AS FLAGS
             FROM GL_DEVELOPMENT d
             WHERE d.MIN_AGE_MONTH <= ? AND d.MAX_AGE_MONTH <= ?
             ORDER BY d.TYPE ASC, d.CODE ASC`,
            [minMonth, maxMonth]
          );
          rows1 = devRows;

          // DAIM and DSPM based on asphyxia or low birth weight
          if (asphyxia === "1" || beweight < 2500) {
            const [daimRows] = await db.query(
              `SELECT
                  d.AGE_MONTH_DESCRIPTION,
                  d.MIN_AGE_MONTH,
                  d.MAX_AGE_MONTH,
                  d.TYPE,
                  'GL_DEVELOPMENT_DAIM' AS TBName,
                  0 AS SCREENING,
                  2 AS FLAGS
               FROM GL_DEVELOPMENT_DAIM d
               WHERE d.MIN_AGE_MONTH >= ? AND d.MAX_AGE_MONTH >= ?
               ORDER BY d.TYPE ASC, d.CODE ASC`,
              [minMonth, maxMonth]
            );
            rows1 = rows1.concat(daimRows);

            const [dspmRows] = await db.query(
              `SELECT
                  d.AGE_MONTH_DESCRIPTION,
                  d.MIN_AGE_MONTH,
                  d.MAX_AGE_MONTH,
                  d.TYPE,
                  'GL_DEVELOPMENT_DSPM' AS TBName,
                  d.SCREENING,
                  3 AS FLAGS
               FROM GL_DEVELOPMENT_DSPM d
               WHERE d.MIN_AGE_MONTH > 24
                 AND d.MIN_AGE_MONTH >= ?
                 AND d.MAX_AGE_MONTH >= ?
               ORDER BY FLAGS, d.MIN_AGE_MONTH, d.MAX_AGE_MONTH, d.TYPE`,
              [minMonth, maxMonth]
            );
            rows1 = rows1.concat(dspmRows);
          } else {
            const [dspmRows] = await db.query(
              `SELECT
                  d.AGE_MONTH_DESCRIPTION,
                  d.MIN_AGE_MONTH,
                  d.MAX_AGE_MONTH,
                  d.TYPE,
                  'GL_DEVELOPMENT_DSPM' AS TBName,
                  d.SCREENING,
                  2 AS FLAGS
               FROM GL_DEVELOPMENT_DSPM d
               WHERE d.MIN_AGE_MONTH >= ?
                 AND d.MAX_AGE_MONTH >= ?
               ORDER BY FLAGS, d.MIN_AGE_MONTH, d.MAX_AGE_MONTH, d.TYPE`,
              [minMonth, maxMonth]
            );
            rows1 = rows1.concat(dspmRows);
          }
        }

        // History and person info for logged in users
        let rows2 = [],
          rows3 = [],
          GA = null;
        if (loggedin == 1) {
          if (ageMax !== -1) {
            let histQuery;
            if (tableName === "GL_DEVELOPMENT") {
              histQuery = `
                SELECT
                  d.MIN_AGE_MONTH,
                  d.MAX_AGE_MONTH,
                  d.CODE,
                  d.TYPE,
                  r.DEVELOPMENT AS CODE,
                  r.DATE_OCCURRED,
                  TIMESTAMPDIFF(MONTH, ?, r.DATE_OCCURRED) AS MONTH_AT_OCCURRED,
                  TIMESTAMPDIFF(MONTH, ?, r.DATE_OCCURRED) AS MONTH_AT_OCCURRED_CORRECTED
                FROM DEVELOPMENT r
                LEFT JOIN GL_DEVELOPMENT d
                  ON r.DEVELOPMENT = d.CODE
                WHERE r.PID = ?
                ORDER BY d.TYPE ASC, d.CODE ASC
              `;
              const [historyRows] = await db.query(histQuery, [
                childbirth,
                childcorrectedbirth,
                childpid,
              ]);
              rows2 = historyRows;
            } else if (tableName === "GL_DEVELOPMENT_DSPM") {
              histQuery = `
                SELECT
                  d.MIN_AGE_MONTH,
                  d.MAX_AGE_MONTH,
                  d.CODE,
                  d.TYPE,
                  r.DEVELOPMENT AS CODE,
                  r.DATE_OCCURRED,
                  TIMESTAMPDIFF(MONTH, ?, r.DATE_OCCURRED) AS MONTH_AT_OCCURRED,
                  TIMESTAMPDIFF(MONTH, ?, r.DATE_OCCURRED) AS MONTH_AT_OCCURRED_CORRECTED
                FROM DEVELOPMENT r
                LEFT JOIN GL_DEVELOPMENT_DSPM d
                  ON r.DEVELOPMENT = d.CODE
                WHERE r.PID = ?
                ORDER BY d.TYPE ASC, d.CODE ASC
              `;
              const [historyRows] = await db.query(histQuery, [
                childbirth,
                childbirth,
                childpid,
              ]);
              rows2 = historyRows;
            } else if (tableName === "GL_DEVELOPMENT_DAIM") {
              histQuery = `
                SELECT
                  d.MIN_AGE_MONTH,
                  d.MAX_AGE_MONTH,
                  d.CODE,
                  d.TYPE,
                  r.DEVELOPMENT AS CODE,
                  r.DATE_OCCURRED,
                  TIMESTAMPDIFF(MONTH, ?, r.DATE_OCCURRED) AS MONTH_AT_OCCURRED,
                  TIMESTAMPDIFF(MONTH, ?, r.DATE_OCCURRED) AS MONTH_AT_OCCURRED_CORRECTED
                FROM DEVELOPMENT r
                LEFT JOIN GL_DEVELOPMENT_DAIM d
                  ON r.DEVELOPMENT = d.CODE
                WHERE r.PID = ?
                ORDER BY d.TYPE ASC, d.CODE ASC
              `;
              const [historyRows] = await db.query(histQuery, [
                childbirth,
                childbirth,
                childpid,
              ]);
              rows2 = historyRows;
            }
          }

          // GA from NEWBORN
          const [gaResult] = await db.query(
            "SELECT GA FROM NEWBORN WHERE PID = ?",
            [childpid]
          );
          GA = gaResult[0]?.GA ?? null;

          // Person info
          const [personResult] = await db.query(
            "SELECT BIRTH, PID, NAME FROM PERSON WHERE PID = ?",
            [childpid]
          );
          rows3 = personResult;
        }

        // Fetch vaccine content
        {
          let queryAppend = "";
          const vaccineQuery = `
            SELECT CODE, DESCRIPTION, DESCRIPTION_TH, DESCRIPTION_TABLE,
                   AGE, AGE_MAX, DISEASE, GRP_NAME, IN_PLAN,
                   INFORMATION, WEB_GRP_NAME, WEB_GRP_ORDER
            FROM CODE_EPI_VACCINETYPE
            WHERE CHILD_VACCINE = 1
            ORDER BY WEB_GRP_ORDER ASC
          `;
          const [vaccineRows] = await db.query(vaccineQuery);
          vaccineContent = vaccineRows;
        }
        // Fetch vaccine history if logged in
        if (vaccineLoggedIn == 1 && childpid) {
          const historyQuery = `
            SELECT c.DESCRIPTION, c.DESCRIPTION_TH, c.DESCRIPTION_TABLE, c.IN_PLAN,
                   e.VACCINETYPE, e.DATE_SERV, c.CODE, c.WEB_GRP_NAME, c.WEB_GRP_ORDER,
                   c.GRP_NAME, c.AGE, c.AGE_MAX, h.HOSPITAL, h.HOSPITALCODE, a.AGE_MONTH
            FROM EPI e
            LEFT JOIN CODE_EPI_VACCINETYPE c ON e.VACCINETYPE = c.CODE
            LEFT JOIN CODE_HOSPITAL h ON e.VACCINEPLACE = h.HOSPITALCODE
            LEFT JOIN EPI_ADDITIONAL a ON e.VACCINETYPE = a.VACCINETYPE AND e.DATE_SERV = a.DATE_SERV
            WHERE (e.PID = ? OR a.PID = ?)
            ORDER BY a.DATE_SERV
          `;
          const [vaccineHistoryRows] = await db.query(historyQuery, [
            childpid,
            childpid,
          ]);
          vaccineHistory = vaccineHistoryRows;
        }
        if (rows1.length > 0 || rows2.length > 0) {
          return reply.send({
            success: 1,
            development: { content: rows1, history: rows2, GA, person: rows3 },
            vaccine: {
              history: vaccineHistory,
            },
          });
        } else {
          return reply.send({ success: 0 });
        }
      } catch (err) {
        request.server.log.error(err);
        return reply.status(500).send({
          success: false,
          message: "Internal Server Error",
          error: err.message,
        });
      }
    },
  },
};
