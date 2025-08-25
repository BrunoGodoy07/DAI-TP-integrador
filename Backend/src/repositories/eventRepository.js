import DBConfig from './../configs/DBConfig.js';
import pkg from 'pg'
const { Client, Pool }  = pkg;
import jwt from 'jsonwebtoken';

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
            console.error(error);
        }
        return returnArray;
    }

    getCapacity = async (id) => {
        let returnArray = null;
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = `
                SELECT max_capacity FROM event_locations WHERE id = $1
            `;
            const result = await client.query(sql, [id]);
            await client.end();
            if (result.rows.length === 0) {
                return 0;
            }
            returnArray = result.rows[0].max_capacity;
        } catch (error) {
            console.error(error);
        }
        return returnArray;
    }

    getCreator = async (id) => {
        let returnArray = null;
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = `
                SELECT id_creator_user FROM events WHERE id = $1
            `;
            const result = await client.query(sql, [id]);
            await client.end();
            if (result.rows.length === 0) {
                return null;
            }
            returnArray = result.rows[0].id_creator_user;
        } catch (error) {
            console.error(error);
        }
        return returnArray;
    }

    createEvent = async (i) => {
        const client = new Client(DBConfig);
        try {
            const sql = `
                INSERT INTO events (name, description, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *
            `

            await client.connect();
            const result = await client.query(sql, [
                i.name, 
                i.description, 
                i.id_event_location, 
                i.start_date, 
                i.duration_in_minutes, 
                i.price, 
                i.enabled_for_enrollment, 
                i.max_assistance, 
                i.creator_user
            ]);
            await client.end();
            return result.rows[0];
        }

        catch (error) {
            console.error(error);
            throw error;
        }
    }

    updateEvent = async (i, id) => {
        const client = new Client(DBConfig);
        try {
            const sql = `
                UPDATE events
                SET name = $1, description = $2, id_event_location = $3, start_date = $4, duration_in_minutes = $5, price = $6, enabled_for_enrollment = $7, max_assistance = $8
                WHERE id = $9
                RETURNING *
            `

            await client.connect();
            const result = await client.query(sql, [
                i.name, 
                i.description, 
                i.id_event_location, 
                i.start_date, 
                i.duration_in_minutes, 
                i.price, 
                i.enabled_for_enrollment, 
                i.max_assistance, 
                id
            ]);
            await client.end();
            return result.rows[0];
        }

        catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    deleteEvent = async (id) => {
        const client = new Client(DBConfig);
        try {
            // Primero obtener el evento antes de eliminarlo
            const getSql = `
                SELECT * FROM events WHERE id = $1
            `;
            
            await client.connect();
            const getResult = await client.query(getSql, [id]);
            
            if (getResult.rows.length === 0) {
                await client.end();
                throw new Error("Evento no encontrado");
            }
            
            const eventData = getResult.rows[0];
            
            // Luego eliminar el evento
            const deleteSql = `
                DELETE FROM events
                WHERE id = $1
            `;
            
            await client.query(deleteSql, [id]);
            await client.end();
            
            return eventData;
        }

        catch (error) {
            console.error(error);
            throw error;
        }
    }

    checkEventEnrollments = async (id) => {
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = `
                SELECT COUNT(*) as count
                FROM event_enrollments
                WHERE id_event = $1
            `;
            const result = await client.query(sql, [id]);
            await client.end();
            return parseInt(result.rows[0].count) > 0;
        } catch (error) {
            console.error(error);
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
    enrollUser = async (id, authHeader) =>
    {
        const client = new Client(DBConfig);
        try {
            if (!authHeader) throw new Error("Authorization header missing");
            const token = authHeader.split(' ')[1];
            if (!token) throw new Error("Token missing");
            const decoded = jwt.verify(token, DBConfig.JWT_SECRET);
            const user_id = decoded.id; // Cambiado de user_id a id según el token generado
            
            await client.connect();
            const eventQuery = `
                SELECT *
                FROM events
                WHERE id = $1
            `
            const eventResult = await client.query(eventQuery, [id]);

            if (eventResult.rows.length === 0) {
                throw new Error(`Event with id: ${id} not found.`);
            }

            if (eventResult.rows[0].enabled_for_enrollment)
            {
                const dateTime = new Date();
                const enrollmentUserQuery = `
                    INSERT INTO event_enrollments (id_event, id_user, registration_date_time)
                    values ($1, $2, $3)
                `

                await client.query(enrollmentUserQuery, [id, user_id, dateTime])
                const enrollmentCountQuery = `
                    SELECT COUNT(*)
                    FROM event_enrollments
                    WHERE id_event = $1
                `

                const enrolledUsers = await client.query(enrollmentCountQuery, [id])

                const enrolledCount = parseInt(enrolledUsers.rows[0].count, 10);

                if (enrolledCount >= eventResult.rows[0].max_assistance)
                {
                                    const updateQuery = `
                UPDATE events
                SET enabled_for_enrollment = false
                WHERE id = $1
                `

                    await client.query(updateQuery, [id])
                }
            }
        }
        catch (err) {
            console.error(err);
            throw err;
        }

        finally {
            await client.end();
        }
    }
}