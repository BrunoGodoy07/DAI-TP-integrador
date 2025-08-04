import DBConfig from './../configs/DBConfig.js';
import pkg from 'pg'
const { Client, Pool }  = pkg;

export default class ProvinceRepository {
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
}