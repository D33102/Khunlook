import { developmentSchema } from "../models/development.js";
import { convertThaiDatetoStd } from "../utils/date.js";

export const developmentController = {
    deleteDevelopment: {
        schema: developmentSchema.deleteDevelopmentSchema,
        handler: async( request, reply ) =>{
            try{
                const {childpid, devcode} = request.body;
                await request.server.mysql.execute(
                    "DELETE FROM DEVELOPMENT WHERE PID = ? AND DEVELOPMENT = ?",
                    [childpid, devcode]
                )
                return reply.status(200).send({message: "successfully deleted development with pid=${childpid} and devcode=${devcode}", success:1})
            }catch(err){
                request.server.log.error(err);
                return reply.status(500).send({message: "Internal Server Error", success:0})
            }
        },
    },
    getInformationDevelopment: {
        schema: developmentSchema.saveDevelopmentSchema,
        handler: async (request, reply) =>{
            const {
                ageMin,
                ageMax,
                childpid = null,
                childbirth = null,
                childcorrectedbirth = null,
                loggedin,
                previous_chosen = null,
                tableName = null,
                childlowbtweigth = null,
            } = request.body;
            
            if (isNaN(ageMin) || isNaN(ageMax)) return reply.status(400).send({ message: "Invalid input: ageMin or ageMax is not a number" , success:0});
              
        
            let rows1 = [];
            let rows2 = [];
            let rows3 = [];
            let maxMonth = 0;
            let minMonth = 0;
            let beweight = 2500;
            let asphyxia = "2"; // Default DSPM
    
            try {
            let query = "";
            let params = [ageMin, ageMax];
    
            if (ageMax != -1) {
                if (
                tableName === "GL_DEVELOPMENT_DSPM" ||
                (tableName === "GL_DEVELOPMENT_DAIM" && ageMax > 24)
                ) {
                query = `
                    SELECT GL_DEVELOPMENT_DSPM.MIN_AGE_MONTH, GL_DEVELOPMENT_DSPM.MAX_AGE_MONTH, GL_DEVELOPMENT_DSPM.CODE, GL_DEVELOPMENT_DSPM.TYPE,
                            GL_DEVELOPMENT_DSPM.AGE_MONTH_DESCRIPTION, GL_DEVELOPMENT_DSPM.DESCRIPTION, GL_DEVELOPMENT_DSPM.INFORMATION,
                            GL_DEVELOPMENT_TYPE_DSPM_DAIM.DESCRIPTION AS TYPE_DESRIPTION, 'GL_DEVELOPMENT_DSPM' AS TBName, SCREENING
                    FROM GL_DEVELOPMENT_DSPM
                    LEFT JOIN GL_DEVELOPMENT_TYPE_DSPM_DAIM ON GL_DEVELOPMENT_DSPM.TYPE = GL_DEVELOPMENT_TYPE_DSPM_DAIM.CODE
                    WHERE GL_DEVELOPMENT_DSPM.MIN_AGE_MONTH = ? AND GL_DEVELOPMENT_DSPM.MAX_AGE_MONTH = ?
                    ORDER BY GL_DEVELOPMENT_DSPM.TYPE ASC, GL_DEVELOPMENT_DSPM.CODE ASC;
                `;
                } else if (tableName === "GL_DEVELOPMENT_DAIM") {
                query = `
                    SELECT GL_DEVELOPMENT_DAIM.MIN_AGE_MONTH, GL_DEVELOPMENT_DAIM.MAX_AGE_MONTH, GL_DEVELOPMENT_DAIM.CODE, GL_DEVELOPMENT_DAIM.TYPE,
                            GL_DEVELOPMENT_DAIM.AGE_MONTH_DESCRIPTION, GL_DEVELOPMENT_DAIM.DESCRIPTION, GL_DEVELOPMENT_DAIM.INFORMATION,
                            GL_DEVELOPMENT_TYPE_DSPM_DAIM.DESCRIPTION AS TYPE_DESRIPTION, 'GL_DEVELOPMENT_DAIM' AS TBName, SCREENING
                    FROM GL_DEVELOPMENT_DAIM
                    LEFT JOIN GL_DEVELOPMENT_TYPE_DSPM_DAIM ON GL_DEVELOPMENT_DAIM.TYPE = GL_DEVELOPMENT_TYPE_DSPM_DAIM.CODE
                    WHERE GL_DEVELOPMENT_DAIM.MIN_AGE_MONTH = ? AND GL_DEVELOPMENT_DAIM.MAX_AGE_MONTH = ?
                    ORDER BY GL_DEVELOPMENT_DAIM.TYPE ASC, GL_DEVELOPMENT_DAIM.CODE ASC;
                `;
                } else if (tableName === "GL_DEVELOPMENT") {
                query = `
                    SELECT GL_DEVELOPMENT.MIN_AGE_MONTH, GL_DEVELOPMENT.MAX_AGE_MONTH, GL_DEVELOPMENT.CODE, GL_DEVELOPMENT.TYPE,
                            GL_DEVELOPMENT.AGE_MONTH_DESCRIPTION, GL_DEVELOPMENT.DESCRIPTION, GL_DEVELOPMENT.INFORMATION,
                            GL_DEVELOPMENT_TYPE.DESCRIPTION AS TYPE_DESRIPTION, 'GL_DEVELOPMENT' AS TBName, 0 AS SCREENING
                    FROM GL_DEVELOPMENT
                    LEFT JOIN GL_DEVELOPMENT_TYPE ON GL_DEVELOPMENT.TYPE = GL_DEVELOPMENT_TYPE.CODE
                    WHERE GL_DEVELOPMENT.MIN_AGE_MONTH = ? AND GL_DEVELOPMENT.MAX_AGE_MONTH = ?
                    ORDER BY GL_DEVELOPMENT.TYPE ASC, GL_DEVELOPMENT.CODE ASC;
                `;
                }
    
                const [rows] = await request.server.mysql.execute(query, params);
                rows1 = rows;
            } else {
                // Fetch data when ageMax is -1
                query = `
                SELECT ASPHYXIA, BWEIGHT, PARAMETER_NAME, PARAMETER_VALUE
                FROM PARAMETER_CONFIGURATION pc
                INNER JOIN NEWBORN n ON n.PID = pc.PID
                WHERE pc.PID = ?;
                `;
                const [newbornInfo] = await request.server.mysql.execute(query, [
                childpid,
                ]);
    
                newbornInfo.forEach((r) => {
                asphyxia = r.ASPHYXIA || "2";
                beweight = r.BWEIGHT || 2500;
                if (r.PARAMETER_NAME === "MAX_ANAMAI55_DEVELOPMENT") {
                    maxMonth = r.PARAMETER_VALUE;
                }
                if (r.PARAMETER_NAME === "MIN_ANAMAI55_DEVELOPMENT") {
                    minMonth = r.PARAMETER_VALUE;
                }
                });
    

                if (asphyxia === "1" || beweight < 2500) {
                query = `
                    SELECT AGE_MONTH_DESCRIPTION, MIN_AGE_MONTH, MAX_AGE_MONTH, TYPE, 'GL_DEVELOPMENT_DAIM' AS TBName, 0 AS SCREENING, 2 AS FLAGS
                    FROM GL_DEVELOPMENT_DAIM
                    WHERE MIN_AGE_MONTH >= ? AND MAX_AGE_MONTH >= ?;
                `;
                const [rows] = await request.server.mysql.execute(query, [
                    minMonth,
                    maxMonth,
                ]);
                rows1 = rows;
                query = `SELECT 
                    AGE_MONTH_DESCRIPTION,	MIN_AGE_MONTH,MAX_AGE_MONTH,TYPE,'GL_DEVELOPMENT_DSPM' AS TBName,SCREENING,3 FLAGS
                    FROM GL_DEVELOPMENT_DSPM
                    WHERE MIN_AGE_MONTH > 24 AND MIN_AGE_MONTH >= '$minMonth' AND MAX_AGE_MONTH >= '$maxMonth'
                    ORDER BY FLAGS, MIN_AGE_MONTH,MAX_AGE_MONTH,TYPE `	
                }else{
                query = `SELECT 
                    AGE_MONTH_DESCRIPTION, MIN_AGE_MONTH, MAX_AGE_MONTH,TYPE, 'GL_DEVELOPMENT_DSPM' AS TBName,SCREENING,2 FLAGS
                    FROM GL_DEVELOPMENT_DSPM
                    WHERE  MIN_AGE_MONTH >=  '$minMonth' AND MAX_AGE_MONTH >=  '$maxMonth'
                    ORDER BY FLAGS, MIN_AGE_MONTH,MAX_AGE_MONTH,TYPE`
                }
            }
            [rows1] = await request.server.mysql.execute(query)

            if (loggedin === 1) {
                if (ageMax != -1) {
                    if (childbirth === childcorrectedbirth && ageMax > 24) {
                    childcorrectedbirth = null;
                    }
        
                    if (tableName === "GL_DEVELOPMENT") {
                    query = `
                        SELECT GL_DEVELOPMENT.MAX_AGE_MONTH, GL_DEVELOPMENT.CODE, GL_DEVELOPMENT.TYPE, DEVELOPMENT.DEVELOPMENT, DEVELOPMENT.DATE_OCCURRED,
                                (timestampdiff(month, ?, DEVELOPMENT.DATE_OCCURRED)) AS MONTH_AT_OCCURRED,
                                (timestampdiff(month, ?, DEVELOPMENT.DATE_OCCURRED)) AS MONTH_AT_OCCURRED_CORRECTED,
                                (timestampdiff(day, ?, DEVELOPMENT.DATE_OCCURRED) / 7) AS GA_MINUS_WEEK
                        FROM DEVELOPMENT
                        LEFT JOIN GL_DEVELOPMENT ON DEVELOPMENT.DEVELOPMENT = GL_DEVELOPMENT.CODE
                        WHERE DEVELOPMENT.PID = ? AND GL_DEVELOPMENT.MIN_AGE_MONTH = ? AND GL_DEVELOPMENT.MAX_AGE_MONTH = ?
                        ORDER BY GL_DEVELOPMENT.TYPE ASC, GL_DEVELOPMENT.CODE ASC;
                    `;
                    params = [childbirth, childcorrectedbirth, childcorrectedbirth, childpid, ageMin, ageMax];
                    } else if (tableName === "GL_DEVELOPMENT_DSPM") {
                    query = `
                        SELECT GL_DEVELOPMENT_DSPM.MAX_AGE_MONTH, GL_DEVELOPMENT_DSPM.CODE, GL_DEVELOPMENT_DSPM.TYPE, DEVELOPMENT.DEVELOPMENT, DEVELOPMENT.DATE_OCCURRED,
                                (timestampdiff(month, ?, DEVELOPMENT.DATE_OCCURRED)) AS MONTH_AT_OCCURRED,
                                (timestampdiff(month, ?, DEVELOPMENT.DATE_OCCURRED)) AS MONTH_AT_OCCURRED_CORRECTED,
                                (timestampdiff(day, ?, DEVELOPMENT.DATE_OCCURRED) / 7) AS GA_MINUS_WEEK
                        FROM DEVELOPMENT
                        LEFT JOIN GL_DEVELOPMENT_DSPM ON DEVELOPMENT.DEVELOPMENT = GL_DEVELOPMENT_DSPM.CODE
                        WHERE DEVELOPMENT.PID = ? AND GL_DEVELOPMENT_DSPM.MIN_AGE_MONTH = ? AND GL_DEVELOPMENT_DSPM.MAX_AGE_MONTH = ?
                        ORDER BY GL_DEVELOPMENT_DSPM.TYPE ASC, GL_DEVELOPMENT_DSPM.CODE ASC;
                    `;
                    params = [childbirth, childcorrectedbirth, childbirth, childpid, ageMin, ageMax];
                    } else if (tableName === "GL_DEVELOPMENT_DAIM") {
                    query = `
                        SELECT GL_DEVELOPMENT_DAIM.MAX_AGE_MONTH, GL_DEVELOPMENT_DAIM.CODE, GL_DEVELOPMENT_DAIM.TYPE, DEVELOPMENT.DEVELOPMENT, DEVELOPMENT.DATE_OCCURRED,
                                (timestampdiff(month, ?, DEVELOPMENT.DATE_OCCURRED)) AS MONTH_AT_OCCURRED,
                                (timestampdiff(month, ?, DEVELOPMENT.DATE_OCCURRED)) AS MONTH_AT_OCCURRED_CORRECTED,
                                (timestampdiff(day, ?, DEVELOPMENT.DATE_OCCURRED) / 7) AS GA_MINUS_WEEK
                        FROM DEVELOPMENT
                        LEFT JOIN GL_DEVELOPMENT_DAIM ON DEVELOPMENT.DEVELOPMENT = GL_DEVELOPMENT_DAIM.CODE
                        WHERE DEVELOPMENT.PID = ? AND GL_DEVELOPMENT_DAIM.MIN_AGE_MONTH = ? AND GL_DEVELOPMENT_DAIM.MAX_AGE_MONTH = ?
                        ORDER BY GL_DEVELOPMENT_DAIM.TYPE ASC, GL_DEVELOPMENT_DAIM.CODE ASC;
                    `;
                    params = [childbirth, childbirth, childbirth, childpid, ageMin, ageMax];
                    }
                } else {
                    // Information summary query
                    query = `
                    SELECT CODE, TYPE, MIN_AGE_MONTH, MAX_AGE_MONTH, AGE_MONTH_DESCRIPTION,
                            (timestampdiff(month, ?, DATE_OCCURRED)) AS MONTH_AT_OCCURRED, DATE_OCCURRED, 'GL_DEVELOPMENT' AS TBName
                    FROM DEVELOPMENT
                    LEFT JOIN GL_DEVELOPMENT ON DEVELOPMENT = GL_DEVELOPMENT.CODE
                    WHERE PID = ?
                    HAVING CODE IS NOT NULL
                    UNION
                    SELECT CODE, TYPE, MIN_AGE_MONTH, MAX_AGE_MONTH, AGE_MONTH_DESCRIPTION,
                            (timestampdiff(month, ?, DATE_OCCURRED)) AS MONTH_AT_OCCURRED, DATE_OCCURRED, 'GL_DEVELOPMENT_DSPM' AS TBName
                    FROM DEVELOPMENT
                    LEFT JOIN GL_DEVELOPMENT_DSPM ON DEVELOPMENT = GL_DEVELOPMENT_DSPM.CODE
                    WHERE PID = ?
                    HAVING CODE IS NOT NULL
                    UNION
                    SELECT CODE, TYPE, MIN_AGE_MONTH, MAX_AGE_MONTH, AGE_MONTH_DESCRIPTION,
                            (timestampdiff(month, ?, DATE_OCCURRED)) AS MONTH_AT_OCCURRED, DATE_OCCURRED, 'GL_DEVELOPMENT_DAIM' AS TBName
                    FROM DEVELOPMENT
                    LEFT JOIN GL_DEVELOPMENT_DAIM ON DEVELOPMENT = GL_DEVELOPMENT_DAIM.CODE
                    WHERE PID = ?
                    HAVING TYPE IS NOT NULL
                    ORDER BY CODE, MIN_AGE_MONTH, MAX_AGE_MONTH, TYPE ASC;
                    `;
                    params = [childbirth, childpid, childbirth, childpid, childbirth, childpid];
                }
        
                const [rows] = await request.server.mysql.execute(query, params);
                rows2 = rows;
        
                // Fetch GA from NEWBORN table
                const [gaResult] = await request.server.mysql.execute(
                    "SELECT GA FROM NEWBORN WHERE PID = ?",
                    [childpid]
                );
                const GA = gaResult[0]?.GA || null;
        
                // Fetch BIRTH, PID, NAME from PERSON table
                const [personResult] = await request.server.mysql.execute(
                    "SELECT BIRTH, PID, NAME FROM PERSON WHERE PID = ?",
                    [childpid]
                );
                rows3 = personResult;
                if (rows1.length > 0 || rows2.length >0 ){
                    return reply.status(200).send({success: 1, content: rows1,history: rows2, GA: GA,person: rows3})
                    }
                else{
                    return reply.status(404).send({message: "development not found", success:0})
                }
            }else{
                if (rows1.length > 0){
                    return reply.status(200).send({success: 1, content: rows1})
                }
                else{
                    return reply.status(404).send({message: "development not found", success:0})
                }
            }
                
            } catch (err) {
                request.server.log.error(err);
                return reply.status(500).send({ message: "Internal Server Error" ,success:0});
            }
            
        }
    },
    queryChildDevelopment: {
        schema: developmentSchema.queryChildDevelopmentSchema,
        handler: async (request, reply) =>{
            const { childpid } = request.body;
            if (!childpid) {
                return reply.status(400).send({ success: 0, message: 'Missing childpid' });
            }
            try{
                const parameterNameMax = "MAX_ANAMAI55_DEVELOPMENT";
                const parameterNameMin = "MIN_ANAMAI55_DEVELOPMENT";
                let maxMonth = 0;
                let minMonth = 0;
                let beweight = 2500;
                let asphyxia = '2'; 


                await request.server.mysql.execute(
                "DELETE FROM `SUMMARY_INFO` WHERE PID = ? AND EVALUATION_TYPE LIKE 'DEVELOPMENT%'",
                [childpid]
                );

                let query = `
                SELECT ASPHYXIA, BWEIGHT, PARAMETER_NAME, PARAMETER_VALUE 
                FROM PARAMETER_CONFIGURATION pc 
                INNER JOIN NEWBORN n ON n.PID = pc.PID 
                WHERE pc.PID = ?
                `;

                const [result] = await request.server.mysql.execute(query, [childpid]);

                if (result.length > 0) {
                result.forEach((r) => {
                    asphyxia = r.ASPHYXIA || '2';
                    beweight = r.BWEIGHT || 2500;

                    if (r.PARAMETER_NAME === parameterNameMax) {
                    maxMonth = r.PARAMETER_VALUE;
                    }

                    if (r.PARAMETER_NAME === parameterNameMin) {
                    minMonth = r.PARAMETER_VALUE;
                    }
                });
                }

                if (result.length === 0) {
                const [developmentResult] = await request.server.mysql.execute(`
                    SELECT MAX(DEVELOPMENT) as DEVELOPMENT, MAX(MIN_AGE_MONTH), MAX(MAX_AGE_MONTH) 
                    FROM DEVELOPMENT d 
                    INNER JOIN GL_DEVELOPMENT gl ON gl.CODE = d.DEVELOPMENT 
                    WHERE d.PID = ?
                `, [childpid]);

                const { MAX_DEVELOPMENT, MIN_AGE_MONTH, MAX_AGE_MONTH } = developmentResult[0];
                minMonth = MIN_AGE_MONTH || 0;
                maxMonth = MAX_AGE_MONTH || 0;

                await request.server.mysql.execute(`
                    INSERT INTO PARAMETER_CONFIGURATION (PID, PARAMETER_NAME, PARAMETER_VALUE) VALUES (?, ?, ?)
                `, [childpid, parameterNameMin, minMonth]);

                await request.server.mysql.execute(`
                    INSERT INTO PARAMETER_CONFIGURATION (PID, PARAMETER_NAME, PARAMETER_VALUE) VALUES (?, ?, ?)
                `, [childpid, parameterNameMax, maxMonth]);

                const [newResult] = await request.server.mysql.execute(query, [childpid]);

                newResult.forEach((r) => {
                    asphyxia = r.ASPHYXIA || '2';
                    beweight = r.BWEIGHT || 2500;

                    if (r.PARAMETER_NAME === parameterNameMax) {
                    maxMonth = r.PARAMETER_VALUE;
                    }

                    if (r.PARAMETER_NAME === parameterNameMin) {
                    minMonth = r.PARAMETER_VALUE;
                    }
                });
                }


                let finalQuery = "";
                if (asphyxia === '1' || beweight < 2500) {

                finalQuery = `
                    SELECT DISTINCT AGE_MONTH_DESCRIPTION, MIN_AGE_MONTH, MAX_AGE_MONTH, 'GL_DEVELOPMENT' AS TBName, 0 AS SCREENING, 1 AS FLAGS 
                    FROM GL_DEVELOPMENT 
                    WHERE MIN_AGE_MONTH <= ? AND MAX_AGE_MONTH <= ?
                    UNION 
                    SELECT DISTINCT AGE_MONTH_DESCRIPTION, MIN_AGE_MONTH, MAX_AGE_MONTH, 'GL_DEVELOPMENT_DAIM' AS TBName, 0 AS SCREENING, 2 AS FLAGS 
                    FROM GL_DEVELOPMENT_DAIM 
                    WHERE MIN_AGE_MONTH >= ? AND MAX_AGE_MONTH >= ?
                    UNION 
                    SELECT DISTINCT AGE_MONTH_DESCRIPTION, MIN_AGE_MONTH, MAX_AGE_MONTH, 'GL_DEVELOPMENT_DSPM' AS TBName, SCREENING, 3 AS FLAGS 
                    FROM GL_DEVELOPMENT_DSPM 
                    WHERE MIN_AGE_MONTH > 24 AND MIN_AGE_MONTH >= ? AND MAX_AGE_MONTH >= ?
                    ORDER BY FLAGS, MIN_AGE_MONTH, MAX_AGE_MONTH;
                `;
                } else {
                // DSPM case
                finalQuery = `
                    SELECT DISTINCT AGE_MONTH_DESCRIPTION, MIN_AGE_MONTH, MAX_AGE_MONTH, 'GL_DEVELOPMENT' AS TBName, 0 AS SCREENING, 1 AS FLAGS 
                    FROM GL_DEVELOPMENT 
                    WHERE MIN_AGE_MONTH <= ? AND MAX_AGE_MONTH <= ?
                    UNION 
                    SELECT DISTINCT AGE_MONTH_DESCRIPTION, MIN_AGE_MONTH, MAX_AGE_MONTH, 'GL_DEVELOPMENT_DSPM' AS TBName, SCREENING, 2 AS FLAGS 
                    FROM GL_DEVELOPMENT_DSPM 
                    WHERE MIN_AGE_MONTH >= ? AND MAX_AGE_MONTH >= ?
                    ORDER BY FLAGS, MIN_AGE_MONTH, MAX_AGE_MONTH;
                `;
                }

                const [rows1] = await request.server.mysql.execute(finalQuery, [minMonth, maxMonth, minMonth, maxMonth, minMonth, maxMonth]);

                if (rows1.length > 0) {
                    return reply.status(200).send({ success: 1, content: rows1});
                } else {
                    return reply.status(404).send({ success: 0, message:"query not found"});
                }
            } catch (err) {
                request.server.log.error(err);
                return reply.status(500).send({ success: 0, message: 'Internal Server Error' });
            }
            

        }
    },
    queryConfigDevelopment:{
        schema: developmentSchema.queryConfigDevelopmentSchema,
        handler: async (request, reply) =>{
            const [childpid, checkAge=0] = request.body;
            try{
                if(checkAge===1){
                    const [rows1] = await request.server.mysql.execute(
                        `"SELECT * FROM PARAMETER_CONFIGURATION WHERE PID=?`,
                        [childpid]
                    )
                    if (rows1.length > 0){
                        return reply.status(200).send({success:1, content: rows1, message:"query config completed"})
                    }
                }
                return reply.status(404).send({success:0, message:"query not found"})
            }catch(err){
                request.server.log.error(err);
                return reply.status(500).send({ message: "Internal Server Error" ,success:0});
            }
        }
    },
    saveDevelopment:{
        schema: developmentSchema.saveDevelopmentSchema,
        handler: async (request, reply) =>{
            const {
                dateocc, // yyyy:mm:dd
                childpid, 
                childbirth, // yyyy:mm:dd
                childcorrectedbirth, // yyyy:mm:dd
                devcode, 
                isUpdate, // 0 or 1
              } = request.body;
            
            const hospcode = 99999;
            const daterec = convertThaiDatetoStd(dateocc);
            const currentdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
            try {
        
            // Insert or update based on isUpdate flag
            if (isUpdate == 0) {
                await request.server.mysql.execute(
                "INSERT INTO DEVELOPMENT (HOSPCODE, PID, DATE_RECORDED, DATE_OCCURRED, DEVELOPMENT) VALUES (?, ?, ?, ?, ?)",
                [hospcode, childpid, currentdate, daterec, devcode]
                );
            } else if (isUpdate == 1) {
                await request.server.mysql.execute(
                "UPDATE DEVELOPMENT SET DATE_RECORDED = ?, DATE_OCCURRED = ? WHERE PID = ? AND DEVELOPMENT = ?",
                [currentdate, daterec, childpid, devcode]
                );
            }
        
            // Compare dates for preterm birth
            let correctedMonthDiff = null;
            let gaMinusWeek = null;
        
            if (childbirth !== childcorrectedbirth) {
                const date1 = new Date(childcorrectedbirth);
                const date2 = new Date(daterec);
                const correcteddiff = Math.ceil((date2 - date1) / (1000 * 60 * 60 * 24 * 7)); // Difference in weeks
        
                gaMinusWeek = correcteddiff;
                correctedMonthDiff = Math.ceil(
                (date1.getFullYear() - date2.getFullYear()) * 12 + (date1.getMonth() - date2.getMonth()) + correcteddiff / 4
                );
            }
        
            // Calculate age difference
            const date1 = new Date(childbirth);
            const date2 = new Date(daterec);
            const diffInMonths = Math.ceil((date2 - date1) / (1000 * 60 * 60 * 24 * 30)); // Difference in months
        
            // Calculate age for checking if it's >= 2 years
            const birthdate = new Date(childbirth);
            const today = new Date();
            const ageInYears = today.getFullYear() - birthdate.getFullYear();
        
            // Return result
            return reply.send({
                success: 1,
                monthdiff: diffInMonths,
                ga_minus_week: gaMinusWeek,
                correctedmonthdiff: correctedMonthDiff,
            });
        
            } catch (err) {
            request.server.log.error(err);
            return reply.status(500).send({ success: 0, message: 'Internal Server Error' });
            }
        }
    },
    typeResultDevelopment:{
        schema: developmentSchema.typeResultDevelopmentSchema,
        handler: async(request, reply) =>{
            try{
                const [rows1] = await request.server.mysql.execute("SELECT * FROM GL_DEVELOPMENT_TYPE")
                const [rows2] = await request.server.mysql.execute("SELECT * FROM GL_DEVELOPMENT_TYPE_DSPM_DAIM")
                if (rows1.length >0 || rows2.length >0){
                    return reply.status(200).send({success:1, type: rows1, type_DPM_DAIM: rows2})
                }
                return reply.status(404).send({success:0, message:"query not found"})
            }catch(err){
                request.server.log.error(err);
                return reply.status(500).send({ success: 0, message: 'Internal Server Error' });
            }
        }
    }


};
