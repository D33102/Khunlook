export function testRoute(fastify, options, done) {
  fastify.get("/", function (request, reply) {
    reply.send({ hello: "world" });
  });

  fastify.get("/test", async (request, reply) => {
    try {
      const [rows] = await pool.execute("SELECT * FROM CODE_EPI_VACCINETYPE");

      if (rows.length === 0) {
        return reply.status(404).send({ message: "User not found" });
      }

      return rows[0];
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });

  done();
}
