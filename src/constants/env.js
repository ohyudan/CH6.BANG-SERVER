import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3333;
export const HOST = process.env.HOST || '127.0.0.1';
export const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';

export const DB_NAME = process.env.DB_NAME || 'bang_db';
export const DB_USER = process.env.DB_HOST || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'aaaa4321';
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT || '3306';
