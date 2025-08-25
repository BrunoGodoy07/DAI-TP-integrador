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

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        if (!eventId) {
            return res.status(400).json({ success: false, error: "ID del evento no válido." });
        }
        
        let updateContents = req.body;
        
        // Verificar que el evento existe y pertenece al usuario autenticado
        const creatorUser = await svc.getCreator(eventId);
        if (!creatorUser) {
            return res.status(404).json({ success: false, error: "Evento no encontrado." });
        }
        if (creatorUser != req.user.id) {
            return res.status(404).json({ success: false, error: "Acceso no autorizado." });
        }
        
        // Validaciones según especificaciones
        if (updateContents.name && updateContents.name.length < 3) {
            return res.status(400).json({ success: false, error: "El nombre debe tener al menos 3 letras." });
        }
        if (updateContents.description && updateContents.description.length < 3) {
            return res.status(400).json({ success: false, error: "La descripción debe tener al menos 3 letras." });
        }
        
        if (updateContents.id_event_location) {
            const max_capacity = await svc.getCapacity(updateContents.id_event_location);
            if (updateContents.max_assistance > max_capacity) {
                return res.status(400).json({ success: false, error: "La asistencia máxima no puede ser mayor a la capacidad de la ubicación." });
            }
        }
        if (updateContents.price < 0 || updateContents.duration_in_minutes < 0) {
            return res.status(400).json({ success: false, error: "El precio o la duración no pueden ser negativos." });
        }
        
        const updated = await svc.updateEvent(updateContents, eventId);
        res.status(200).json({ success: true, updated });
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
    try {
        const eventId = parseInt(req.params.id);
        if (!eventId) {
            return res.status(404).json({ success: false, error: "ID del evento no válido." });
        }

        const userId = req.user.id;
        const enrollment = await svc.enrollUser(eventId, userId);
        
        res.status(201).json({ 
            success: true, 
            message: "Usuario inscrito correctamente al evento.",
            enrollment 
        });
    } catch (err) {
        console.error('Error en inscripción:', err.message);
        
        if (err.message.includes("no encontrado")) {
            return res.status(404).json({ success: false, error: err.message });
        }
        
        // Manejar específicamente el error de usuario ya inscrito
        if (err.message.includes("ya está inscrito")) {
            return res.status(400).json({ 
                success: false, 
                error: err.message,
                code: "USER_ALREADY_ENROLLED"
            });
        }
        
        // Manejar error de evento no habilitado
        if (err.message.includes("no está habilitado")) {
            return res.status(400).json({ 
                success: false, 
                error: err.message,
                code: "EVENT_NOT_ENABLED"
            });
        }
        
        // Manejar error de capacidad máxima
        if (err.message.includes("capacidad máxima")) {
            return res.status(400).json({ 
                success: false, 
                error: err.message,
                code: "EVENT_FULL"
            });
        }
        
        // Manejar errores de fecha
        if (err.message.includes("ya pasó") || err.message.includes("es hoy")) {
            return res.status(400).json({ 
                success: false, 
                error: err.message,
                code: "EVENT_DATE_INVALID"
            });
        }
        
        res.status(400).json({ success: false, error: err.message });
    }
});

router.delete('/:id/enrollment/', authMiddleware, async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        if (!eventId) {
            return res.status(404).json({ success: false, error: "ID del evento no válido." });
        }

        const userId = req.user.id;
        const enrollment = await svc.unenrollUser(eventId, userId);
        
        res.status(200).json({ 
            success: true, 
            message: "Usuario desinscrito correctamente del evento.",
            enrollment 
        });
    } catch (err) {
        console.error('Error en desinscripción:', err.message);
        
        if (err.message.includes("no encontrado")) {
            return res.status(404).json({ success: false, error: err.message });
        }
        
        // Manejar específicamente el error de usuario no inscrito
        if (err.message.includes("no está inscrito")) {
            return res.status(400).json({ 
                success: false, 
                error: err.message,
                code: "USER_NOT_ENROLLED"
            });
        }
        
        // Manejar otros errores de validación
        if (err.message.includes("ya pasó") || err.message.includes("es hoy")) {
            return res.status(400).json({ 
                success: false, 
                error: err.message,
                code: "EVENT_DATE_INVALID"
            });
        }
        
        res.status(400).json({ success: false, error: err.message });
    }
});

export default router;
