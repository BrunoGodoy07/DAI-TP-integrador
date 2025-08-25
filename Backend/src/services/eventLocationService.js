import EventLocationRepository from '../repositories/eventLocationRepository.js';

const repo = new EventLocationRepository();

export default class eventLocationService {
  async list(userId, page = 1, limit = 10) {
    return await repo.listByUser(userId, page, limit);
  }

  async getById(userId, id) {
    return await repo.getByIdAndUser(id, userId);
  }

  async create(userId, payload) {
    // Business validations
    if (!payload.name || typeof payload.name !== 'string' || payload.name.trim().length < 3) {
      const err = new Error('El campo "name" es obligatorio y debe tener al menos 3 caracteres');
      err.code = 'INVALID_NAME';
      throw err;
    }
    if (!payload.full_address || typeof payload.full_address !== 'string' || payload.full_address.trim().length < 3) {
      const err = new Error('El campo "full_address" es obligatorio y debe tener al menos 3 caracteres');
      err.code = 'INVALID_ADDRESS';
      throw err;
    }
    if (!Number.isInteger(payload.id_location)) {
      const err = new Error('El campo "id_location" es inválido');
      err.code = 'INVALID_LOCATION';
      throw err;
    }
    if (!Number.isInteger(payload.max_capacity) || payload.max_capacity <= 0) {
      const err = new Error('El campo "max_capacity" debe ser un entero mayor que 0');
      err.code = 'INVALID_CAPACITY';
      throw err;
    }

    // repository will also validate id_location existence
    const created = await repo.create(payload, userId);
    return created;
  }

  async update(userId, id, fields) {
    // Validate provided fields if present
    if (Object.prototype.hasOwnProperty.call(fields, 'name')) {
      if (!fields.name || typeof fields.name !== 'string' || fields.name.trim().length < 3) {
        const err = new Error('El campo "name" debe tener al menos 3 caracteres');
        err.code = 'INVALID_NAME';
        throw err;
      }
    }
    if (Object.prototype.hasOwnProperty.call(fields, 'full_address')) {
      if (!fields.full_address || typeof fields.full_address !== 'string' || fields.full_address.trim().length < 3) {
        const err = new Error('El campo "full_address" debe tener al menos 3 caracteres');
        err.code = 'INVALID_ADDRESS';
        throw err;
      }
    }
    if (Object.prototype.hasOwnProperty.call(fields, 'max_capacity')) {
      if (!Number.isInteger(fields.max_capacity) || fields.max_capacity <= 0) {
        const err = new Error('El campo "max_capacity" debe ser un entero mayor que 0');
        err.code = 'INVALID_CAPACITY';
        throw err;
      }
    }
    if (Object.prototype.hasOwnProperty.call(fields, 'id_location')) {
      if (!Number.isInteger(fields.id_location)) {
        const err = new Error('El campo "id_location" es inválido');
        err.code = 'INVALID_LOCATION';
        throw err;
      }
    }

    const updated = await repo.update(id, userId, fields);
    return updated;
  }

  async delete(userId, id) {
    const deleted = await repo.delete(id, userId);
    return deleted;
  }
}