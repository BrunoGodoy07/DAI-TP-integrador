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
        let insertContents = req.body;
        insertContents.creator_user = req.user.id;
        const max_capacity = await svc.getCapacity(insertContents.id_event_location);
        if(insertContents.name < 3 || insertContents.description < 3) throw new Error("El nombre y la descripción tienen que tener más de 3 letras.");
        else if(insertContents.max_assistance > max_capacity) throw new Error("La asistencia máxima no puede ser mayor a la capacidad de la ubicación.");
        else if(insertContents.price < 0 || insertContents.duration_in_minutes < 0) throw new Error("El precio o la duración no pueden ser negativos.");
        const inserted = await svc.createEvent(insertContents);
        res.status(201).json({ success: true, inserted });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        let insertContents = req.body;
        const id = parseInt(req.params.id);
        const creatorUser = svc.getCreator(id); //Acá ya tira error si el evento no existe
        if(creatorUser != req.user.id) throw new Error("Acceso no autorizado.");
        const max_capacity = await svc.getCapacity(insertContents.id_event_location);
        if(insertContents.name < 3 || insertContents.description < 3) throw new Error("El nombre y la descripción tienen que tener más de 3 letras.");
        else if(insertContents.max_assistance > max_capacity) throw new Error("La asistencia máxima no puede ser mayor a la capacidad de la ubicación.");
        else if(insertContents.price < 0 || insertContents.duration_in_minutes < 0) throw new Error("El precio o la duración no pueden ser negativos.");
        const inserted = await svc.updateEvent(insertContents, id);
        res.status(201).json({ success: true, inserted });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const creatorUser = svc.getCreator(id); //Acá ya tira error si el evento no existe
        if(creatorUser != req.user.id) throw new Error("Acceso no autorizado.");
        const inserted = await svc.deleteEvent(id); //Si existe una foreign key (o sea, un usuario registrado al evento) tira error acá
        res.status(201).json({ success: true, inserted });
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
