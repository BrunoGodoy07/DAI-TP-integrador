import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import EventLocationService from '../services/eventLocationService.js';

const router = Router();
const svc = new EventLocationService();

router.use(authMiddleware);

// GET /api/event-location?page=1&limit=10
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.max(1, parseInt(req.query.limit || '10', 10));
    const userId = req.user?.id;
    const data = await svc.list(userId, page, limit);
    return res.status(200).json({ data, page, limit });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno.' });
  }
});

// GET /api/event-location/:id
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Id inválida.' });

    const userId = req.user?.id;
    const item = await svc.getById(userId, id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno.' });
  }
});

// POST /api/event-location
router.post('/', async (req, res) => {
  try {
    const userId = req.user?.id;
    const created = await svc.create(userId, req.body);
    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    if (err.code && err.code.startsWith('INVALID')) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Error interno.' });
  }
});

// PUT /api/event-location/:id
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Id inválida.' });

    const userId = req.user?.id;
    const updated = await svc.update(userId, id, req.body);
    if (updated === null) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    if (err.code && err.code.startsWith('INVALID')) {
      return res.status(400).json({ error: err.message });
    }
    if (err.code === 'NO_UPDATES') {
      return res.status(400).json({ error: 'Nothing to update' });
    }
    return res.status(500).json({ error: 'Error interno.' });
  }
});

// DELETE /api/event-location/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Id inválida.' });

    const userId = req.user?.id;
    const deleted = await svc.delete(userId, id);
    if (deleted === null) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(deleted);
  } catch (err) {
    console.error(err);
    if (err.code && err.code.startsWith('INVALID')) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Error interno.' });
  }
});

export default router;