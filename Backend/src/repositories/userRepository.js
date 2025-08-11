import pkg from 'pg';
const { Client } = pkg;
import DBConfig from '../configs/DBConfig.js';

export default class eventRepository {
    findByUsername = async (username) => {
        const client = new Client(DBConfig);
        try {
            const result = await
            await client.connect(); client.query('SELECT * FROM users WHERE username = $1', [username]);
            await client.end();
            return result.rows[0] || null;
        } catch (err) {
            console.error("error:" + err)
        }
    }

    createUser = async ({ first_name, last_name, username, password }) => {
        const client = new Client(DBConfig);
        try {
            await client.connect();
            await client.query(
                'INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)',
                [first_name, last_name, username, password]
            );
            await client.end();
        } catch (err) {
            console.error("error:" + err)
        }
    }
}
