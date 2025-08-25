import pkg from 'pg';
const { Client } = pkg;
import DBConfig from '../configs/DBConfig.js';

export default class userRepository {
    findByUsername = async (username) => {
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
            await client.end();
            return result.rows[0] || null;
        } catch (err) {
            console.error("error:" + err);
            await client.end();
            throw err;
        }
    }

    createUser = async ({ first_name, last_name, username, password }) => {
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const result = await client.query(
                'INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4) RETURNING *',
                [first_name, last_name, username, password]
            );
            await client.end();
            return result.rows[0];
        } catch (err) {
            console.error("error:" + err);
            await client.end();
            throw err;
        }
    }

    deleteUser = async (username) => {
        const client = new Client(DBConfig);
        try {
            await client.connect();
            
            // Primero verificar que el usuario existe
            const checkUser = await client.query('SELECT * FROM users WHERE username = $1', [username]);
            if (checkUser.rows.length === 0) {
                await client.end();
                throw new Error("Usuario no encontrado");
            }
            
            // Luego eliminar el usuario
            const result = await client.query(
                'DELETE FROM users WHERE username = $1 RETURNING *',
                [username]
            );
            await client.end();
            return result.rows[0];
        } catch (err) {
            console.error("error:" + err);
            await client.end();
            throw err;
        }
    }
}
