import { Router } from 'express';
import eventService from './../services/eventService.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // Importar el middleware

const router = Router();
const svc = new eventService();

// 🔓 Ruta pública - búsqueda de eventos
router.get('', async (req, res) => {
    try {
        const { name, startdate, tag } = req.query;
        const events = await svc.searchEvents({ name, startdate, tag });
        res.status(200).json(events);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error interno.');
    }
});

// 🔒 Ruta protegida - ver detalle de evento
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const event = await svc.getById(parseInt(req.params.id));
        if (!event) {
            return res.status(404).send('Evento no encontrado.');
        }
        res.status(200).json(event);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error interno.');
    }
});

// 🔒 Ruta protegida - crear evento
router.post('', authMiddleware, async (req, res) => {
    try {
        const inserted = await svc.createEvent(req.body.insertContents);
        res.status(200).json({ success: true, inserted });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

export default router;
