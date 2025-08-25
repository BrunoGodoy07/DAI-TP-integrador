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
            // Construir dinámicamente la consulta SQL basada en los campos proporcionados
            const updates = [];
            const values = [];
            let paramIndex = 1;
            
            if (i.name !== undefined) {
                updates.push(`name = $${paramIndex++}`);
                values.push(i.name);
            }
            if (i.description !== undefined) {
                updates.push(`description = $${paramIndex++}`);
                values.push(i.description);
            }
            if (i.id_event_location !== undefined) {
                updates.push(`id_event_location = $${paramIndex++}`);
                values.push(i.id_event_location);
            }
            if (i.start_date !== undefined) {
                updates.push(`start_date = $${paramIndex++}`);
                values.push(i.start_date);
            }
            if (i.duration_in_minutes !== undefined) {
                updates.push(`duration_in_minutes = $${paramIndex++}`);
                values.push(i.duration_in_minutes);
            }
            if (i.price !== undefined) {
                updates.push(`price = $${paramIndex++}`);
                values.push(i.price);
            }
            if (i.enabled_for_enrollment !== undefined) {
                updates.push(`enabled_for_enrollment = $${paramIndex++}`);
                values.push(i.enabled_for_enrollment);
            }
            if (i.max_assistance !== undefined) {
                updates.push(`max_assistance = $${paramIndex++}`);
                values.push(i.max_assistance);
            }
            
            if (updates.length === 0) {
                throw new Error("No hay campos para actualizar");
            }
            
            const sql = `
                UPDATE events
                SET ${updates.join(', ')}
                WHERE id = $${paramIndex}
                RETURNING *
            `;
            
            values.push(id);

            await client.connect();
            const result = await client.query(sql, values);
            await client.end();
            
            if (result.rows.length === 0) {
                throw new Error("Evento no encontrado");
            }
            
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
    enrollUser = async (id, userId) => {
        const client = new Client(DBConfig);
        try {
            await client.connect();
            
            // Verificar que el evento existe
            const eventQuery = `
                SELECT *
                FROM events
                WHERE id = $1
            `;
            const eventResult = await client.query(eventQuery, [id]);

            if (eventResult.rows.length === 0) {
                throw new Error(`Evento con id: ${id} no encontrado.`);
            }

            const event = eventResult.rows[0];
            
            // Verificar que el evento esté habilitado para inscripción
            if (!event.enabled_for_enrollment) {
                throw new Error("El evento no está habilitado para inscripción.");
            }
            
            // Verificar que el evento no haya pasado
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const eventDate = new Date(event.start_date);
            eventDate.setHours(0, 0, 0, 0);
            
            if (eventDate <= today) {
                throw new Error("No se puede inscribir a un evento que ya pasó o es hoy.");
            }
            
            // Verificar que el usuario no esté ya inscrito
            const existingEnrollmentQuery = `
                SELECT COUNT(*)
                FROM event_enrollments
                WHERE id_event = $1 AND id_user = $2
            `;
            const existingEnrollment = await client.query(existingEnrollmentQuery, [id, userId]);
            
            if (parseInt(existingEnrollment.rows[0].count) > 0) {
                throw new Error("El usuario ya está inscrito en este evento.");
            }
            
            // Verificar capacidad máxima
            const enrollmentCountQuery = `
                SELECT COUNT(*)
                FROM event_enrollments
                WHERE id_event = $1
            `;
            const enrolledUsers = await client.query(enrollmentCountQuery, [id]);
            const enrolledCount = parseInt(enrolledUsers.rows[0].count, 10);
            
            if (enrolledCount >= event.max_assistance) {
                throw new Error("El evento ha alcanzado su capacidad máxima de inscripciones.");
            }
            
            // Inscribir al usuario
            const dateTime = new Date();
            const enrollmentUserQuery = `
                INSERT INTO event_enrollments (id_event, id_user, registration_date_time, description, attended, observations, rating)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `;
            
            const enrollmentResult = await client.query(enrollmentUserQuery, [
                id, 
                userId, 
                dateTime,
                'Inscripción al evento', // description
                0, // attended
                '', // observations
                0 // rating
            ]);
            
            // Si se alcanzó la capacidad máxima, deshabilitar inscripciones
            if (enrolledCount + 1 >= event.max_assistance) {
                const updateQuery = `
                    UPDATE events
                    SET enabled_for_enrollment = false
                    WHERE id = $1
                `;
                await client.query(updateQuery, [id]);
            }
            
            return enrollmentResult.rows[0];
        }
        catch (err) {
            console.error(err);
            throw err;
        }
        finally {
            await client.end();
        }
    }

    unenrollUser = async (id, userId) => {
        const client = new Client(DBConfig);
        try {
            await client.connect();
            
            // Verificar que el evento existe
            const eventQuery = `
                SELECT *
                FROM events
                WHERE id = $1
            `;
            const eventResult = await client.query(eventQuery, [id]);

            if (eventResult.rows.length === 0) {
                throw new Error(`Evento con id: ${id} no encontrado.`);
            }

            const event = eventResult.rows[0];
            
            // Verificar que el evento no haya pasado
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const eventDate = new Date(event.start_date);
            eventDate.setHours(0, 0, 0, 0);
            
            if (eventDate <= today) {
                throw new Error("No se puede desinscribir de un evento que ya pasó o es hoy.");
            }
            
            // Verificar que el usuario esté inscrito
            const existingEnrollmentQuery = `
                SELECT id
                FROM event_enrollments
                WHERE id_event = $1 AND id_user = $2
            `;
            const existingEnrollment = await client.query(existingEnrollmentQuery, [id, userId]);
            
            if (existingEnrollment.rows.length === 0) {
                throw new Error("El usuario no está inscrito en este evento.");
            }
            
            // Desinscribir al usuario
            const deleteEnrollmentQuery = `
                DELETE FROM event_enrollments
                WHERE id_event = $1 AND id_user = $2
                RETURNING *
            `;
            
            const deleteResult = await client.query(deleteEnrollmentQuery, [id, userId]);
            
            // Si el evento estaba deshabilitado por capacidad máxima, habilitarlo nuevamente
            if (!event.enabled_for_enrollment) {
                const enrollmentCountQuery = `
                    SELECT COUNT(*)
                    FROM event_enrollments
                    WHERE id_event = $1
                `;
                const enrolledUsers = await client.query(enrollmentCountQuery, [id]);
                const enrolledCount = parseInt(enrolledUsers.rows[0].count, 10);
                
                if (enrolledCount < event.max_assistance) {
                    const updateQuery = `
                        UPDATE events
                        SET enabled_for_enrollment = true
                        WHERE id = $1
                    `;
                    await client.query(updateQuery, [id]);
                }
            }
            
            return deleteResult.rows[0];
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