import bcrypt from "bcryptjs";
export async function generateUniquePID(request) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let isUnique = false;
  let pid;

  while (!isUnique) {
    let result = "";
    for (let i = 0; i < 13; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    pid = result;

    const [rows] = await request.server.mysql.execute(
      "SELECT COUNT(*) as count FROM PERSON WHERE PID = ?",
      [pid]
    );

    if (rows[0].count === 0) {
      isUnique = true;
    }
  }

  return pid;
}
export async function generateUniqueHOSP(request) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let isUnique = false;
  let hospcode;

  while (!isUnique) {
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    hospcode = result;

    const [rows] = await request.server.mysql.execute(
      "SELECT HOSPITALCODE FROM CODE_HOSPITAL WHERE HOSPITALCODE = ?",
      [hospcode]
    );

    if (rows.length === 0) {
      isUnique = true;
    }
  }

  return hospcode;
}
