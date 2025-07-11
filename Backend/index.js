import express from 'express';
import 'dotenv/config'
import pkg from 'pg';

const { Pool } = pkg;

const app = express();

const DBConfig = {
    host        : process.env.DB_HOST     ?? '',
    database    : process.env.DB_DATABASE ?? '',
    user        : process.env.DB_USER     ?? '',
    password    : process.env.DB_PASSWORD ?? '',
    port        : process.env.DB_PORT     ?? 5432
}

export default DBConfig;
/* Checkear bien esto, no tengo el mental para pensar bien como debería de conectarse.
app.get('/api/event/?name=' + texto, (req, res) => {
    res.send('Hola mundo');
});

app.get('/api/event/?startdate=' + fecha, (req, res) => {
    res.send('Hola mundo');
});

app.get('/api/event/?tag=' + texto, (req, res) => {
    res.send('Hola mundo');
});
*/
app.listen(3000, () => {
    console.log('Servidor escuchando en puerto 3000');
});