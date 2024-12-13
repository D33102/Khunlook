import { childSchema } from "../models/child.js";
import { convertThaiDatetoStd } from "../utils/date.js";
import { generateUniquePID } from "../utils/generator.js";

export const childController = {
  getChild: {
    schema: childSchema.getChildSchema,
    handler: async (request, reply) => {
      const { user_id } = request.params;
      try {
        const query = `SELECT PERSON.HOSPCODE,PERSON.CID,PERSON.PID,PERSON.NAME,PERSON.LNAME,PERSON.SEX,PERSON.BIRTH,PERSON.ABOGROUP,PERSON.RHGROUP,NEWBORN.GA,NEWBORN.BTIME,PERSON_MEMO.MEMO,NEWBORN.BWEIGHT ,NEWBORN.ASPHYXIA 
        FROM PERSON LEFT JOIN NEWBORN ON PERSON.PID = NEWBORN.PID LEFT JOIN PERSON_MEMO ON PERSON.PID = PERSON_MEMO.PID WHERE PERSON.MOTHER = ? OR PERSON.FATHER = ? ORDER BY PERSON.PID;`;
        const [rows] = await request.server.mysql.execute(query, [
          user_id,
          user_id,
        ]);
        if (rows.length === 0) {
          return reply
            .status(404)
            .send({ error: "User not found or no PERSON records associated." });
        }
        console.log(rows);
        return reply.code(200).send({
          message: `get child of user ${user_id} success`,
          data: rows,
          success: 1,
        });
      } catch (error) {
        console.log(error);
        return reply.status(500).send({
          message: "something is wrong",
          error: "Internal Server Error.",
        });
      }
    },
  },
  addChild: {
    schema: childSchema.addChildSchema,
    handler: async (request, reply) => {
      let {
        momcid,
        childcid,
        childpid,
        childhospcode,
        childname,
        datepickerchild,
        sexchild,
        gaweek,
        childfullname,
        childbtime,
        childabo,
        childrh,
        childmemo,
        lowbtweigth,
        birthAsphyxia,
      } = request.body;
      childpid = generateUniquePID(request);
      childcid = 99999;
      let childga = isNaN(gaweek) ? null : gaweek;
      let childlowbtweight = isNaN(lowbtweigth) ? null : lowbtweigth;
      let childbirthAsphyxia = isNaN(birthAsphyxia) ? null : birthAsphyxia;
      let formattedDatepickerChild = null;
      if (datepickerchild) {
        formattedDatepickerChild = convertThaiDatetoStd(datepickerchild);
      }

      if (!childname) {
        return reply.code(400).send({ error: "กรุณากรอกชื่อบุตร" });
      }
      if (!formattedDatepickerChild) {
        return reply.code(400).send({ error: "กรุณากรอกวันเกิดบุตร" });
      }
      if (!sexchild) {
        return reply.code(400).send({ error: "กรุณาเลือกเพศบุตร" });
      }

      try {
        const currentdate = new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");

        await request.server.mysql.execute(
          `INSERT INTO PERSON (HOSPCODE, CID, PID, NAME, LNAME, SEX, BIRTH, MOTHER, ABOGROUP, RHGROUP, D_UPDATE)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            childhospcode,
            childcid,
            childpid,
            childname,
            childfullname,
            sexchild,
            formattedDatepickerChild,
            momcid,
            childabo,
            childrh,
            currentdate,
          ]
        );

        await request.server.mysql.execute(
          `INSERT INTO NEWBORN (HOSPCODE, PID, MPID, BTIME, GA, D_UPDATE, BWEIGHT, ASPHYXIA)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            childhospcode,
            childpid,
            momcid,
            childbtime,
            childga,
            currentdate,
            childlowbtweight,
            childbirthAsphyxia,
          ]
        );

        await request.server.mysql.execute(
          `INSERT INTO PERSON_MEMO (HOSPCODE, PID, MEMO) VALUES (?, ?, ?)`,
          [childhospcode, childpid, childmemo]
        );
        return reply
          .code(201)
          .send({ message: "add child success", success: 1 });
      } catch (error) {
        console.log(request);
        reply.code(500).send({
          message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
          error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        });
        console.error(error);
      }
    },
  },
};
