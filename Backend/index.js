import express from 'express';
import cors from "cors";
import eventRouter from "./src/controllers/eventController.js"

const { Pool } = pkg;

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/api/event', eventRouter)

app.listen(port, () => {
    console.log('Servidor escuchando en puerto 3000');
});