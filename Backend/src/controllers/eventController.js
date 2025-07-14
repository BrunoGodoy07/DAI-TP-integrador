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

export default router;
/*
export const getEvents = async (req, res) => {

}
app.get('', (req, res) => {
    const sql = `
    `
    res.send()
})*/