import 'dotenv/config';
import express from 'express';
import cors from "cors";
import eventRouter from "./src/controllers/eventController.js";
import userRouter from "./src/controllers/userController.js";
import eventLocationRouter from "./src/controllers/eventLocationController.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/event', eventRouter);
app.use('/api/user', userRouter);
app.use('/api/event-location', eventLocationRouter);

app.listen(port, () => {
    console.log('Servidor escuchando en puerto https://localhost:3000');
});