import { Router } from 'express';
import userService from './../services/userService.js';
import jwt from 'jsonwebtoken';

const router = Router();
const svc = new userService();

// Registro
router.post('/register', async(req, res) => {
    const { first_name, last_name, username, password } = req.body;

    // Validaciones simples
    if (!first_name || first_name.length < 3 || !last_name || last_name.length < 3) {
        return res.status(400).json({ success: false, message: "Nombre y apellido deben tener al menos 3 letras." });
    }
    if (!username || username.length < 3) {
        return res.status(400).json({ success: false, message: "El usuario debe tener al menos 3 letras." });
    }
    if (!password || password.length < 8) {
        return res.status(400).json({ success: false, message: "La contraseña debe tener al menos 8 caracteres." });
    }

    await svc.createUser({first_name, last_name, username, password})
    return res.status(201).json({ success: true, message: "Usuario registrado correctamente." });
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await svc.findByUsername(username)
    if (!user.password === password) {
        return res.status(401).json({ success: false, message: "La clave es invalida.", token: "" });
    } 

    if (!user) {
        return res.status(401).json({ success: false, message: "Usuario o clave inválida.", token: "" });
    }

    const token = jwt.sign(
        { id: 1, first_name: user.first_name, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    return res.status(200).json({ success: true, message: "Inicio de sesión correcto.", token, id });
});

export default router;
