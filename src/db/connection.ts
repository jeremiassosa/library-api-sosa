import "dotenv/config";
import { Sequelize } from "sequelize";

// Conexión a PostgreSQL.
// Antes de usarla, creá en pgAdmin una base vacía llamada `library`.
// 👇 Cambiá estos datos por los de tu instalación de Postgres.
const DATABASE = process.env.DB_NAME || "library";
const USER = process.env.DB_USER || "jsosa";
const PASSWORD = process.env.DB_PASSWORD || "";
const HOST = process.env.DB_HOST || "localhost";
const PORT = Number(process.env.DB_PORT || 5432);

export const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
    dialect: "postgres",
    host: HOST,
    port: PORT,
    logging: false,
});
