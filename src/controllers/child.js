import { childSchema } from "../models/child";

export const childController = {
    addChild:{
        schema: childSchema.addChildSchema,
        handler: async(request, reply) =>{
            const { momcid,
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
              } = request.body
            
              let childga = isNaN(gaweek) ? null : gaweek;
              let childlowbtweight = isNaN(lowbtweigth) ? null : lowbtweigth;
              let childbirthAsphyxia = isNaN(birthAsphyxia) ? null : birthAsphyxia;
            
              let formattedDatepickerChild = null;
              if (datepickerchild) {
                formattedDatepickerChild = convertThaiDateToStd(datepickerchild);
              }
            
              if (!childname) {
                return reply.code(400).send({ error: 'กรุณากรอกชื่อบุตร' });
              }
              if (!formattedDatepickerChild) {
                return reply.code(400).send({ error: 'กรุณากรอกวันเกิดบุตร' });
              }
              if (!sexchild) {
                return reply.code(400).send({ error: 'กรุณาเลือกเพศบุตร' });
              }
            
              try {
                const currentdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            
                await request.server.mysql.execute(
                  `INSERT INTO PERSON (HOSPCODE, CID, PID, NAME, LNAME, SEX, BIRTH, MOTHER, ABOGROUP, RHGROUP, D_UPDATE)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [childhospcode, childcid, childpid, childname, childfullname, sexchild, formattedDatepickerChild, momcid, childabo, childrh, currentdate]
                );
            
                await request.server.mysql.execute(
                  `INSERT INTO NEWBORN (HOSPCODE, PID, MPID, BTIME, GA, D_UPDATE, BWEIGHT, ASPHYXIA)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                  [childhospcode, childpid, momcid, childbtime, childga, currentdate, childlowbtweight, childbirthAsphyxia]
                );
            
                await request.server.mysql.execute(
                  `INSERT INTO PERSON_MEMO (HOSPCODE, PID, MEMO) VALUES (?, ?, ?)`,
                  [childhospcode, childpid, childmemo]
                );

              } catch (error) {
                reply.code(500).send({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
                console.error(error);
              }
        }
    }
}
