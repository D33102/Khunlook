export async function generateUniquePID(request) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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

const hashedPassword = await bcrypt.hash(PASSWORD, 10);

// Generate a unique PID
const PID = await generateUniquePID(request);

const [result] = await request.server.mysql.execute(
  "INSERT INTO PERSON (`NAME`, `PID`) VALUES (?, ?)",
  [NAME, PID]
);

const ID = result.insertId;

await request.server.mysql.execute(
  "INSERT INTO USER (`ID`, `NAME`, `USERNAME`, `PASSWORD`, `EMAIL`, `PHONE_NUMBER`) VALUES (?, ?, ?, ?, ?, ?)",
  [ID, NAME, USERNAME, hashedPassword, EMAIL, PHONE_NUMBER]
);

console.log("Generated unique PID:", PID);
console.log("Inserted ID:", ID);
