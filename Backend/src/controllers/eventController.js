import { Router } from 'express';
import eventService from './../services/eventService.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();
const svc = new eventService();

router.get('', async (req, res) => {
    try {
        const { name, startdate } = req.query;
        const events = await svc.searchEvents({ name, startdate });
        res.status(200).json(events);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error interno.');
    }
});

router.get('/:id', async (req, res) => {
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

router.post('', authMiddleware, async (req, res) => {
    try {
        const inserted = await svc.createEvent(req.body.insertContents);
        res.status(200).json({ success: true, inserted });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.post('/:id/enrollment/', authMiddleware, async (req, res) => {
    if (!req.params.id)
    {
        res.status(404).send("Id no encontrada.")
    }

    try {
        const inserted = await svc.enrollUser(parseInt(req.params.id));
        //ver de agregar las diferentes posibilidades de error.
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
})

export default router;
