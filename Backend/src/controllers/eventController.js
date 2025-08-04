import {Router} from 'express';
import eventService from './../services/eventService.js'
const router = Router();
const svc = new eventService();

router.get('', async (req, res) => {
    let response;
    const returnArray = await svc.getAllAsync();
    if (returnArray != null) {
        response = res.status(200).json(returnArray);
    } else {
        response = res.status(500).send('Error interno.');
    }
    return response;
});

router.post('', async (req, res) => {
    try {
        const inserted = await svc.createEvent(req.body.insertContents);
        res.status(200).json({ success: true, inserted });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
})

export default router;