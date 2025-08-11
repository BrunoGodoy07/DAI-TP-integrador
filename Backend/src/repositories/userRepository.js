import pkg from 'pg';
const { Client } = pkg;
import DBConfig from '../configs/DBConfig.js';

export default class eventRepository {
    findByUsername = async (username) => {
        const client = new Client(DBConfig);
        await client.connect();
        try {
            const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
            return result.rows[0] || null;
        } finally {
            await client.end();
        }
    }

    createUser = async ({ first_name, last_name, username, password }) => {
        const client = new Client(DBConfig);
        await client.connect();
        try {
            await client.query(
                'INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)',
                [first_name, last_name, username, password]
            );
        } catch (err) {

        } finally {
            await client.end();
        }
    }
}
