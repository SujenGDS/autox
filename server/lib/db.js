import mysql from "mysql2/promise";

let connection;

export const connectToDataBase = async () => {
  if (!connection) {
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw error;
    }
  }

  return connection;
};
