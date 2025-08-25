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
        
        // Validaciones según especificaciones
        if (!insertContents.name || insertContents.name.length < 3) {
            return res.status(400).json({ success: false, error: "El nombre debe tener al menos 3 letras." });
        }
        if (!insertContents.description || insertContents.description.length < 3) {
            return res.status(400).json({ success: false, error: "La descripción debe tener al menos 3 letras." });
        }
        
        const max_capacity = await svc.getCapacity(insertContents.id_event_location);
        if (insertContents.max_assistance > max_capacity) {
            return res.status(400).json({ success: false, error: "La asistencia máxima no puede ser mayor a la capacidad de la ubicación." });
        }
        if (insertContents.price < 0 || insertContents.duration_in_minutes < 0) {
            return res.status(400).json({ success: false, error: "El precio o la duración no pueden ser negativos." });
        }
        
        const inserted = await svc.createEvent(insertContents);
        res.status(201).json({ success: true, inserted });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.put('', authMiddleware, async (req, res) => {
    try {
        let insertContents = req.body;
        
        if (!insertContents.id) {
            return res.status(400).json({ success: false, error: "El ID del evento es requerido." });
        }
        
        // Verificar que el evento existe y pertenece al usuario autenticado
        const creatorUser = await svc.getCreator(insertContents.id);
        if (!creatorUser) {
            return res.status(404).json({ success: false, error: "Evento no encontrado." });
        }
        if (creatorUser != req.user.id) {
            return res.status(404).json({ success: false, error: "Acceso no autorizado." });
        }
        
        // Validaciones según especificaciones
        if (insertContents.name && insertContents.name.length < 3) {
            return res.status(400).json({ success: false, error: "El nombre debe tener al menos 3 letras." });
        }
        if (insertContents.description && insertContents.description.length < 3) {
            return res.status(400).json({ success: false, error: "La descripción debe tener al menos 3 letras." });
        }
        
        if (insertContents.id_event_location) {
            const max_capacity = await svc.getCapacity(insertContents.id_event_location);
            if (insertContents.max_assistance > max_capacity) {
                return res.status(400).json({ success: false, error: "La asistencia máxima no puede ser mayor a la capacidad de la ubicación." });
            }
        }
        if (insertContents.price < 0 || insertContents.duration_in_minutes < 0) {
            return res.status(400).json({ success: false, error: "El precio o la duración no pueden ser negativos." });
        }
        
        const inserted = await svc.updateEvent(insertContents, insertContents.id);
        res.status(200).json({ success: true, inserted });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        // Verificar que el evento existe y pertenece al usuario autenticado
        const creatorUser = await svc.getCreator(id);
        if (!creatorUser) {
            return res.status(404).json({ success: false, error: "Evento no encontrado." });
        }
        if (creatorUser != req.user.id) {
            return res.status(404).json({ success: false, error: "Acceso no autorizado." });
        }
        
        // Verificar si hay usuarios registrados al evento
        const hasEnrollments = await svc.checkEventEnrollments(id);
        if (hasEnrollments) {
            return res.status(400).json({ success: false, error: "No se puede eliminar el evento porque tiene usuarios registrados." });
        }
        
        const deleted = await svc.deleteEvent(id);
        res.status(200).json({ success: true, deleted });
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
