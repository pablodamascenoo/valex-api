import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

const { Pool } = pg;
let configDatabase: pg.PoolConfig;

configDatabase = {
    connectionString: process.env.DATABASE_URL,
};

if (process.env.MODE === "PROD") {
    configDatabase = {
        ssl: { rejectUnauthorized: false },
    };
}

export const connection = new Pool(configDatabase);
