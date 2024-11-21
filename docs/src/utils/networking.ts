import amqp from "amqplib";
import dotenv from "dotenv";
import { Channel } from "amqplib";
import mariadb, { Pool, PoolConnection } from 'mariadb';
import { logError } from "./logger";
dotenv.config();

// Active Connection Variables
let channel: Channel | null = null;
let pool: Pool | null = null;

/**
 * Creates a new connection to the Uplink service.
 */
async function createUplinkConnection(): Promise<void> {
    try {
        const connection = await (await amqp.connect({
            "protocol": "amqp",
            "hostname": process.env.AMQP_HOST,
            "port": parseInt(process.env.AMQP_PORT as string),
            "username": process.env.AMQP_USERNAME,
            "password": process.env.AMQP_PASSWORD
        })).createChannel();
        channel = connection;
    } catch (error: any) {
        logError(error);
    }
}

/**
 * Gets the existing or creates a new channel for working with Uplink.
 * @returns The RabbitMQ Channel
 */
export async function getUplinkConnection(): Promise<amqp.Channel | null> {
    if (!channel) await createUplinkConnection();
    return channel;
}

/**
 * Initialize the database connection pool.
 */
function initializePool(): void {
    if (!process.env.DB_PORT) return;
    if (!pool) {
        pool = mariadb.createPool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            user: process.env.DB_USERNAME,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            connectionLimit: 10,
            multipleStatements: true
        });
    }
}

/**
 * Query the database with a prepared statement.
 * @param query The SQL query to execute.
 * @param values The prepared statement values.
 * @returns The result of the query or a status code on error.
 */
export async function queryDatabase(query: string, values: Array<string | number | boolean | null> = []): Promise<Array<any> | number> {
    initializePool();
    try {
        if (!pool) throw new Error("Database connection pool is not initialized.");
        const connection: PoolConnection = await pool.getConnection();
        const result = await connection.query(query, values);
        connection.release();
        return result;
    } catch (error: any) {
        logError(error);
        return 500;
    }
}

/**
 * Close the database connection pool.
 */
export async function closePool(): Promise<void> {
    if (pool) {
        await pool.end();
        pool = null;
    }
}
