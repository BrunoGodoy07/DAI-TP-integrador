import DBConfig from '../configs/DBConfig.js';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool(DBConfig);

export default class eventLocationRepository {
  constructor() {
    this._hasCreatorColumn = null;
  }

  async _detectCreatorColumn() {
    if (this._hasCreatorColumn !== null) return this._hasCreatorColumn;

    const sql = `
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'event_locations'
        AND column_name = 'id_creator_user'
      LIMIT 1
    `;
    const { rowCount } = await pool.query(sql);
    this._hasCreatorColumn = rowCount > 0;
    return this._hasCreatorColumn;
  }

  async listByUser(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const hasCreator = await this._detectCreatorColumn();

    if (hasCreator) {
      const sql = `
        SELECT id, id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user
        FROM public.event_locations
        WHERE id_creator_user = $1
        ORDER BY id
        LIMIT $2 OFFSET $3
      `;
      const { rows } = await pool.query(sql, [userId, limit, offset]);
      return rows;
    } else {
      // No owner column: return all event_locations (no per-user filtering possible)
      const sql = `
        SELECT id, id_location, name, full_address, max_capacity, latitude, longitude
        FROM public.event_locations
        ORDER BY id
        LIMIT $1 OFFSET $2
      `;
      const { rows } = await pool.query(sql, [limit, offset]);
      return rows;
    }
  }

  async getByIdAndUser(id, userId) {
    const hasCreator = await this._detectCreatorColumn();
    if (hasCreator) {
      const sql = `
        SELECT id, id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user
        FROM public.event_locations
        WHERE id = $1 AND id_creator_user = $2
      `;
      const { rows } = await pool.query(sql, [id, userId]);
      return rows[0] ?? null;
    } else {
      const sql = `
        SELECT id, id_location, name, full_address, max_capacity, latitude, longitude
        FROM public.event_locations
        WHERE id = $1
      `;
      const { rows } = await pool.query(sql, [id]);
      return rows[0] ?? null;
    }
  }

  async create(payload, userId) {
    const { id_location, name, full_address, max_capacity, latitude = 0, longitude = 0 } = payload;

    // Validate referenced location exists
    const locRes = await pool.query('SELECT id FROM public.locations WHERE id = $1', [id_location]);
    if (locRes.rowCount === 0) {
      const err = new Error('id_location no existe');
      err.code = 'INVALID_LOCATION';
      throw err;
    }

    const hasCreator = await this._detectCreatorColumn();

    if (hasCreator) {
      const sql = `
        INSERT INTO public.event_locations (id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user
      `;
      const params = [id_location, name.trim(), full_address.trim(), max_capacity, latitude, longitude, userId];
      const { rows } = await pool.query(sql, params);
      return rows[0];
    } else {
      // Table doesn't store creator — insert without owner
      const sql = `
        INSERT INTO public.event_locations (id_location, name, full_address, max_capacity, latitude, longitude)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, id_location, name, full_address, max_capacity, latitude, longitude
      `;
      const params = [id_location, name.trim(), full_address.trim(), max_capacity, latitude, longitude];
      const { rows } = await pool.query(sql, params);
      return rows[0];
    }
  }

  async update(id, userId, fields) {
    // Check existence and ownership if possible
    const existing = await this.getByIdAndUser(id, userId);
    if (!existing) return null;

    const allowed = ['id_location', 'name', 'full_address', 'max_capacity', 'latitude', 'longitude'];
    const sets = [];
    const params = [];
    let idx = 1;

    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(fields, key)) {
        sets.push(`${key} = $${idx}`);
        params.push(fields[key]);
        idx++;
      }
    }

    if (sets.length === 0) {
      const err = new Error('Nothing to update');
      err.code = 'NO_UPDATES';
      throw err;
    }

    // If id_location is being changed, validate it exists
    if (Object.prototype.hasOwnProperty.call(fields, 'id_location')) {
      const locRes = await pool.query('SELECT id FROM public.locations WHERE id = $1', [fields.id_location]);
      if (locRes.rowCount === 0) {
        const err = new Error('id_location no existe');
        err.code = 'INVALID_LOCATION';
        throw err;
      }
    }

    const hasCreator = await this._detectCreatorColumn();

    if (hasCreator) {
      const sql = `
        UPDATE public.event_locations
        SET ${sets.join(', ')}
        WHERE id = $${idx} AND id_creator_user = $${idx + 1}
        RETURNING id, id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user
      `;
      params.push(id, userId);
      const { rows } = await pool.query(sql, params);
      return rows[0];
    } else {
      const sql = `
        UPDATE public.event_locations
        SET ${sets.join(', ')}
        WHERE id = $${idx}
        RETURNING id, id_location, name, full_address, max_capacity, latitude, longitude
      `;
      params.push(id);
      const { rows } = await pool.query(sql, params);
      return rows[0];
    }
  }

  async delete(id, userId) {
    // Check existence and ownership if possible
    const existing = await this.getByIdAndUser(id, userId);
    if (!existing) return null;

    const hasCreator = await this._detectCreatorColumn();

    if (hasCreator) {
      const sql = `
        DELETE FROM public.event_locations
        WHERE id = $1 AND id_creator_user = $2
        RETURNING id, id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user
      `;
      const { rows } = await pool.query(sql, [id, userId]);
      return rows[0];
    } else {
      const sql = `
        DELETE FROM public.event_locations
        WHERE id = $1
        RETURNING id, id_location, name, full_address, max_capacity, latitude, longitude
      `;
      const { rows } = await pool.query(sql, [id]);
      return rows[0];
    }
  }
}