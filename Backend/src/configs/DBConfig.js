import dotenv from 'dotenv';
dotenv.config();

const DBConfig = {
    host        : process.env.DB_HOST     ?? 'localhost',
    database    : process.env.DB_NAME     ?? 'postgres',
    user        : process.env.DB_USER     ?? 'postgres',
    password    : process.env.DB_PASSWORD ?? 'postgres',
    port        : process.env.DB_PORT     ?? 5432
}

export default DBConfig;