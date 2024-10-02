import fastifyMysql from "@fastify/mysql";
import dotenv from "dotenv";

dotenv.config();

export const registerDb = (fastify) => {
  fastify.register(fastifyMysql, {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    port: process.env.MYSQL_PORT,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    promise: true,
    waitforconnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
};
