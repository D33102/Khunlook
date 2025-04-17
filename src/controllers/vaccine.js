import { vaccineSchema } from "../models/vaccine.js";
import { convertThaiDatetoStd } from "../utils/date.js";
import { generateUniqueHOSP } from "../utils/generator.js";

export const vaccineController = {
  getVaccinesInfo: {
    schema: vaccineSchema.vaccineInformation,
    handler: async (request, reply) => {
      const { childpid, isinplan, loggedin, previous_chosen } = request.body;

      // Simulate session management (Fastify doesn't have built-in session management, this is just an example)
      // For real sessions, consider using a library like fastify-session
      const session = request.session || {};
      session.previous_chosen = previous_chosen;

      const inplan = parseInt(isinplan, 10);
      const queryAppend = inplan === 0 ? "OR IN_PLAN = 2" : "";

      // SQL query for fetching vaccine types
      const query1 = `
          SELECT CODE, DESCRIPTION, DESCRIPTION_TH, DESCRIPTION_TABLE, AGE, AGE_MAX, DISEASE, GRP_NAME, IN_PLAN, INFORMATION, WEB_GRP_NAME, WEB_GRP_ORDER 
          FROM CODE_EPI_VACCINETYPE 
          WHERE (IN_PLAN = ? ${queryAppend}) AND CHILD_VACCINE = 1 
          ORDER BY WEB_GRP_ORDER ASC`;

      // SQL query for fetching historical data
      const query2 = `
          SELECT CODE_EPI_VACCINETYPE.DESCRIPTION, CODE_EPI_VACCINETYPE.DESCRIPTION_TH, CODE_EPI_VACCINETYPE.DESCRIPTION_TABLE, CODE_EPI_VACCINETYPE.IN_PLAN, 
                 EPI.VACCINETYPE, EPI.DATE_SERV, CODE_EPI_VACCINETYPE.CODE, CODE_EPI_VACCINETYPE.WEB_GRP_NAME, CODE_EPI_VACCINETYPE.WEB_GRP_ORDER, 
                 CODE_EPI_VACCINETYPE.GRP_NAME, CODE_EPI_VACCINETYPE.AGE, CODE_EPI_VACCINETYPE.AGE_MAX, CODE_HOSPITAL.HOSPITAL, CODE_HOSPITAL.HOSPITALCODE, 
                 EPI_ADDITIONAL.AGE_MONTH 
          FROM EPI 
          LEFT JOIN CODE_EPI_VACCINETYPE ON EPI.VACCINETYPE = CODE_EPI_VACCINETYPE.CODE 
          LEFT JOIN CODE_HOSPITAL ON EPI.VACCINEPLACE = CODE_HOSPITAL.HOSPITALCODE 
          LEFT JOIN EPI_ADDITIONAL ON EPI.VACCINETYPE = EPI_ADDITIONAL.VACCINETYPE AND EPI.DATE_SERV = EPI_ADDITIONAL.DATE_SERV 
          WHERE (EPI.PID = ? OR EPI_ADDITIONAL.PID = ?) AND CODE_EPI_VACCINETYPE.IN_PLAN = ? 
          ORDER BY EPI_ADDITIONAL.DATE_SERV`;

      try {
        // Query for vaccine types
        const [rows1] = await request.server.mysql.execute(query1, [inplan]);

        let rows2 = [];
        if (loggedin == 1 && childpid) {
          // Query for historical data
          const [result2] = await request.server.mysql.execute(query2, [
            childpid,
            childpid,
            inplan,
          ]);
          rows2 = result2;
        }

        // Prepare and send response
        if (rows1.length > 0 || rows2.length > 0) {
          return reply.send({
            success: 1,
            content: rows1,
            history: rows2,
            inplan,
          });
        } else {
          return reply.code(400).send({ success: 0 });
        }
      } catch (err) {
        request.server.log.error(err);
        return reply.send({ success: 0, error: "Database query failed" });
      }
    },
  },
  createVaccine: {
    schema: vaccineSchema.vaccineCreateInformationSchema,
    handler: async (request, reply) => {
      const { vaccineplace, childpid, vaccinetype, vaccinated_date, months } =
        request.body;

      // SQL query to fetch hospital data based on search criteria
      const query1 = `
          INSERT INTO EPI (VACCINEPLACE,PID,DATE_SERV,VACCINETYPE,D_UPDATE) VALUES (?,?,?,?,?)
        `;
      const query2 = `INSERT INTO EPI_ADDITIONAL (HOSPCODE,PID,DATE_SERV,VACCINETYPE,AGE_MONTH) VALUES (?,?,?,?,?)`;
      const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };

      // Example usage:
      console.log(request.body);
      const currentDateTime = getCurrentDateTime();
      try {
        // Execute the query with parameters
        if (!months) {
          const [result1] = await request.server.mysql.execute(query1, [
            vaccineplace,
            childpid,
            vaccinated_date,
            vaccinetype,
            currentDateTime,
          ]);
        } else {
          const [result2] = await request.server.mysql.execute(query2, [
            99999,
            childpid,
            vaccinated_date,
            vaccinetype,
            months,
          ]);
        }
        // Send the response

        return reply
          .code(200)
          .send({ message: "add vaccine success", success: 1 });
      } catch (err) {
        request.server.log.error(err);
        return reply
          .code(500)
          .send({ success: 0, error: "Database query failed" });
      }
    },
  },
  vaccineHospital: {
    schema: vaccineSchema.vaccineGetHospitalSchema,
    handler: async (request, reply) => {
      const { search, momcid } = request.body;

      // SQL query to fetch hospital data based on search criteria
      const query = `
          SELECT CODE_HOSPITAL.HOSPITALCODE AS id, CODE_HOSPITAL.HOSPITAL AS text 
          FROM CODE_HOSPITAL 
          LEFT JOIN USER_HOSPITAL ON CODE_HOSPITAL.HOSPITALCODE = USER_HOSPITAL.HOSPITALCODE 
          WHERE (CODE_HOSPITAL.STANDARD = 1 AND CODE_HOSPITAL.HOSPITAL LIKE ?) 
          OR (CODE_HOSPITAL.STANDARD = 0 AND USER_HOSPITAL.CID = ? AND CODE_HOSPITAL.HOSPITAL LIKE ?) 
          LIMIT 150
        `;

      try {
        // Execute the query with parameters
        const [result] = await request.server.mysql.execute(query, [
          `%${search}%`,
          momcid,
          `%${search}%`,
        ]);

        // Send the response
        return reply.send({ content: result });
      } catch (err) {
        request.server.log.error(err);
        return reply
          .code(500)
          .send({ success: 0, error: "Database query failed" });
      }
    },
  },
  saveClinic: {
    schema: vaccineSchema.vaccineSaveClinicSchema,
    handler: async (request, reply) => {
      const { clinicname, momcid } = request.body;
      const checkQuery = `
        SELECT CODE_HOSPITAL.HOSPITAL 
        FROM CODE_HOSPITAL 
        LEFT JOIN USER_HOSPITAL ON CODE_HOSPITAL.HOSPITALCODE = USER_HOSPITAL.HOSPITALCODE 
        WHERE (CODE_HOSPITAL.STANDARD = 1 AND CODE_HOSPITAL.HOSPITAL = ?) 
        OR (CODE_HOSPITAL.STANDARD = 0 AND USER_HOSPITAL.CID = ? AND CODE_HOSPITAL.HOSPITAL = ?)
      `;

      try {
        const [checkResult] = await request.server.mysql.execute(checkQuery, [
          clinicname,
          momcid,
          clinicname,
        ]);

        if (checkResult.length > 0) {
          return reply.send({ success: 0 });
        }
        const randhospcode = await generateUniqueHOSP(request);
        const insertClinicQuery = `
          INSERT INTO CODE_HOSPITAL (HOSPITALCODE, HOSPITAL, STANDARD) 
          VALUES (?, ?, 0)
        `;
        await request.server.mysql.execute(insertClinicQuery, [
          randhospcode,
          clinicname,
        ]);

        const insertUserClinicQuery = `
          INSERT INTO USER_HOSPITAL (CID, HOSPITALCODE) 
          VALUES (?, ?)
        `;
        await request.server.mysql.execute(insertUserClinicQuery, [
          momcid,
          randhospcode,
        ]);

        return reply.send({
          success: 1,
          id: randhospcode,
          text: clinicname,
        });
      } catch (error) {
        request.server.log.error(error);
        return reply
          .code(500)
          .send({ success: 0, error: "Database operation failed" });
      }
    },
  },
  updateVaccine: {
    schema: vaccineSchema.vaccineUpdateSchema,
    handler: async (request, reply) => {
      const {
        vaccineplace,
        childpid,
        vaccinetype,
        vaccinated_date,
        months,
        prev_dateserv,
      } = request.body;

      // Convert dates
      const date = vaccinated_date;
      const prevDate = prev_dateserv;
      // const prevDate = prev_dateserv
      //   ? convertThaiDatetoStd(prev_dateserv)
      //   : "0000-00-00";
      const currentdate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      try {
        // Update record in EPI table
        const query1 = `
            UPDATE EPI 
            SET VACCINEPLACE = ?, DATE_SERV = ?, D_UPDATE = ? 
            WHERE PID = ? AND VACCINETYPE = ? AND DATE_SERV = ?
          `;
        await request.server.mysql.execute(query1, [
          vaccineplace,
          date,
          currentdate,
          childpid,
          vaccinetype,
          prevDate,
        ]);

        // If months is provided, update the EPI_ADDITIONAL table
        if (months) {
          const query2 = `
              UPDATE EPI_ADDITIONAL 
              SET DATE_SERV = ? 
              WHERE PID = ? AND VACCINETYPE = ? AND AGE_MONTH = ?
            `;
          await request.server.mysql.execute(query2, [
            date,
            childpid,
            vaccinetype,
            months,
          ]);
        }

        return reply.send({
          success: 1,
          message: "Vaccine record updated successfully",
        });
      } catch (error) {
        request.server.log.error(error);
        return reply.send({
          success: 0,
          error: "Failed to update vaccine record",
        });
      }
    },
  },
  deleteVaccine: {
    schema: vaccineSchema.vaccineDeleteSchema,
    handler: async (request, reply) => {
      const { childpid, vaccinetype, months, dateserv } = request.body;

      const dateservStd = convertThaiDatetoStd(dateserv);

      try {
        // Delete from EPI table
        const deleteEpiQuery = `
            DELETE FROM EPI WHERE PID = ? AND VACCINETYPE = ? AND DATE_SERV = ?
          `;
        await request.server.mysql.execute(deleteEpiQuery, [
          childpid,
          vaccinetype,
          dateservStd,
        ]);

        // If vaccinetype is "815", also delete from EPI_ADDITIONAL
        if (vaccinetype === "815") {
          const deleteEpiAdditionalQuery = `
              DELETE FROM EPI_ADDITIONAL WHERE PID = ? AND AGE_MONTH = ?
            `;
          await request.server.mysql.execute(deleteEpiAdditionalQuery, [
            childpid,
            months,
          ]);
        }

        return reply.send({
          success: 1,
          message: "Vaccine deleted successfully",
        });
      } catch (error) {
        request.server.log.error(error);
        return reply
          .code(500)
          .send({ success: 0, error: "Database query failed" });
      }
    },
  },
};
