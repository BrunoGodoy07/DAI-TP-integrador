import DBConfig from './../configs/DBConfig.js';
import pkg from 'pg'
const { Client, Pool }  = pkg;

export default class eventRepository {
    getAllAsync = async () => {
        let returnArray = null;
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = `
                SELECT
                    e.id, e.name, e.description, e.start_date, e.duration_in_minutes, e.price, e.enabled_for_enrollment, e.max_assistance, u.username
                FROM events e
                INNER JOIN users u ON e.id_creator_user = u.id
            `;
            const result = await client.query(sql);
            await client.end();
            returnArray = result.rows;
        } catch (error) {
            console.log(error);
        }
        return returnArray;
    }

    createEvent = async (insertContents) => {
        const client = new Client(DBConfig);
        try {
            if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(insertContents)) {
                throw new Error(`Invalid table name: '${insertContents}'`);
            }
            
            const sql = `
                INSERT INTO events (name, description, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance)
                SELECT name, description, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance
                FROM ${insertContents}
                RETURNING *;
            `

            await client.connect();

            const result = await client.query(sql);
            returnArray = result.rows;

            if (result.rowCount === 0) {    
                throw new Error(`No data was inserted: '${insertContents}'`);
            }

            result.rows.forEach((event) => {
                if (event.name.length < 3) {
                    throw new Error(`The name of the event '${event.name}' must be longer than 3 characters.`);
                }

                if (event.description.length < 3) {
                    throw new Error(`The description of the event '${event.name}' must be longer than 3 characters.`);
                }
                
                if (event.max_assistance > event.max_capacity) {
                    throw new Error(`The maximum assistance of the event '${event.name}' CANNOT be greater than the maximum capacity of the event.`);
                }
                
                if (event.price < 0) {
                    throw new Error(`The price of the event '${event.name}' cannot be lower than 0.`);
                }
                
                if (event.duration_in_minutes < 0) {
                    throw new Error(`The duration of the event '${event.name}' cannot be lower than 0.`);
                }
            });
        }

        catch (error) {
            console.error('Error in createEvent:', error.message);
            throw error;
        }
        
        finally {
            await client.end();
        }
    }
}