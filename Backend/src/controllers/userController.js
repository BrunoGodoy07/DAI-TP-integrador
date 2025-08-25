import { Router } from 'express';
import userService from './../services/userService.js';
import jwt from 'jsonwebtoken';
import JWT_SECRET from '../configs/JWTConfig.js';

const router = Router();
const svc = new userService();

// Registro
router.post('/register', async(req, res) => {
    const { first_name, last_name, username, password } = req.body;

    if (!first_name || first_name.length < 3 || !last_name || last_name.length < 3) {
        return res.status(400).json({ success: false, message: "Nombre y apellido deben tener al menos 3 letras." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
        return res.status(400).json({ success: false, message: "El email es invalido." });
    }
    if (!password || password.length < 3) {
        return res.status(400).json({ success: false, message: "La contraseña debe tener al menos 3 caracteres." });
    }

    await svc.createUser({first_name, last_name, username, password})
    return res.status(201).json({ success: true, message: "Usuario registrado correctamente." });
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await svc.findByUsername(username)

    if (!user) {
        return res.status(401).json({ success: false, message: "El usuario ingresado no existe.", token: "" });
    }
    if (user.password !== password) {
        return res.status(401).json({ success: false, message: "La clave es invalida.", token: "" });
    } 
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
        return res.status(400).json({ success: false, message: "El email es invalido.", token: "" });
    }

    const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1h" }
    );
    return res.status(200).json({ success: true, message: "Inicio de sesión correcto.", token });
});

export default router;
