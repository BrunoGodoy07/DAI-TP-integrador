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
                SELECT json_build_object(
                    'id', e.id, 
                    'name', e.name, 
                    'description', e.description, 
                    'start_date', e.start_date, 
                    'duration_in_minutes', e.duration_in_minutes, 
                    'price', e.price, 
                    'enabled_for_enrollment', e.enabled_for_enrollment, 
                    'max_assistance', e.max_assistance,
                    'event_location', json_build_object(
                        'id', el.id, 
                        'name', el.name, 
                        'full_address', el.full_address, 
                        'latitude', el.latitude, 
                        'longitude', el.longitude, 
                        'max_capacity', el.max_capacity,
                        'location', json_build_object(
                            'id', l.id, 
                            'name', l.name, 
                            'latitude', l.latitude, 
                            'longitude', l.longitude,
                            'province', json_build_object(
                                'id', p.id, 
                                'name', p.name, 
                                'full_name', p.full_name, 
                                'latitude', p.latitude, 
                                'longitude', p.longitude, 
                                'display_order', p.display_order
                            )
                        )
                    ),
                    'creator_user', json_build_object(
                        'id', u.id, 
                        'username', u.username, 
                        'first_name', u.first_name, 
                        'last_name', u.last_name
                    )
                ) AS event
                FROM events e
                INNER JOIN users u ON e.id_creator_user = u.id
                INNER JOIN event_locations el ON e.id_event_location = el.id
                INNER JOIN locations l ON el.id_location = l.id
                INNER JOIN provinces p ON l.id_province = p.id
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
            await client.end();

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
    }

    searchEvents = async ({ name, startdate }) => {
        const client = new Client(DBConfig);
        let filters = [];
        let values = [];
        let idx = 1;
    
        if (name) {
            filters.push(`LOWER(e.name) LIKE LOWER($${idx++})`);
            values.push(`%${name}%`);
        }
        if (startdate) {
            filters.push(`e.start_date = $${idx++}`);
            values.push(startdate);
        }
    
        let whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
    
        const sql = `
            SELECT json_build_object(
                'id', e.id, 
                'name', e.name, 
                'description', e.description, 
                'start_date', e.start_date, 
                'duration_in_minutes', e.duration_in_minutes, 
                'price', e.price, 
                'enabled_for_enrollment', e.enabled_for_enrollment, 
                'max_assistance', e.max_assistance,
                'event_location', json_build_object(
                    'id', el.id, 
                    'name', el.name, 
                    'full_address', el.full_address, 
                    'latitude', el.latitude, 
                    'longitude', el.longitude, 
                    'max_capacity', el.max_capacity,
                    'location', json_build_object(
                        'id', l.id, 
                        'name', l.name, 
                        'latitude', l.latitude, 
                        'longitude', l.longitude,
                        'province', json_build_object(
                            'id', p.id, 
                            'name', p.name, 
                            'full_name', p.full_name, 
                            'latitude', p.latitude, 
                            'longitude', p.longitude, 
                            'display_order', p.display_order
                        )
                    )
                ),
                'creator_user', json_build_object(
                    'id', u.id, 
                    'username', u.username, 
                    'first_name', u.first_name, 
                    'last_name', u.last_name
                )
            ) AS event
            FROM events e
            INNER JOIN users u ON e.id_creator_user = u.id
            INNER JOIN event_locations el ON e.id_event_location = el.id
            INNER JOIN locations l ON el.id_location = l.id
            INNER JOIN provinces p ON l.id_province = p.id
            ${whereClause}
        `;
    
        try {
            await client.connect();
            const result = await client.query(sql, values);
            await client.end();
            return result.rows;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    getById = async (id) => {
        const client = new Client(DBConfig);
        try {
            await client.connect();
    
            const sql = `
                SELECT json_build_object(
                    'id', e.id, 
                    'name', e.name, 
                    'description', e.description, 
                    'id_event_location', e.id_event_location,
                    'start_date', e.start_date, 
                    'duration_in_minutes', e.duration_in_minutes, 
                    'price', e.price, 
                    'enabled_for_enrollment', e.enabled_for_enrollment, 
                    'max_assistance', e.max_assistance,
                    'id_creator_user', e.id_creator_user,
                    'event_location', json_build_object(
                        'id', el.id,
                        'id_location', el.id_location,
                        'name', el.name,
                        'full_address', el.full_address,
                        'max_capacity', el.max_capacity,
                        'latitude', el.latitude,
                        'longitude', el.longitude,
                        'location', json_build_object(
                            'id', l.id,
                            'name', l.name,
                            'id_province', l.id_province,
                            'latitude', l.latitude,
                            'longitude', l.longitude,
                            'province', json_build_object(
                                'id', p.id,
                                'name', p.name,
                                'full_name', p.full_name,
                                'latitude', p.latitude,
                                'longitude', p.longitude,
                                'display_order', p.display_order
                            )
                        ),
                        'creator_user', json_build_object(
                            'id', u.id,
                            'first_name', u.first_name,
                            'last_name', u.last_name,
                            'username', u.username,
                            'password', u.password
                        )
                    ),
                    'creator_user', json_build_object(
                        'id', u.id,
                        'first_name', u.first_name,
                        'last_name', u.last_name,
                        'username', u.username,
                        'password', u.password
                    )
                ) AS event
                FROM events e
                INNER JOIN users u ON e.id_creator_user = u.id
                INNER JOIN event_locations el ON e.id_event_location = el.id
                INNER JOIN locations l ON el.id_location = l.id
                INNER JOIN provinces p ON l.id_province = p.id
                WHERE e.id = $1
            `;
    
            const result = await client.query(sql, [id]);
    
            await client.end();
    
            if (result.rows.length === 0) {
                return null;
            }
    
            return result.rows[0].event;
    
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    enrollUser = async (id) =>
    {
        try {
            await client.connect();
            const sql = `
                SELECT *
                FROM events
                WHERE id = ${id}
            `
            const event = await client.query(sql, [id]);
            
            //if (event.max_assistance) hacer innerjoin o ver que clase de brujería hacer para encontrar la cantidad de registrados al evento.
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }
}