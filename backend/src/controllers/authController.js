import * as authService from '../services/authService.js';

export const register = async (req, res) => {
    try {
        const { name, email, password, cpf, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
        }

        const newUser = await authService.registerUser({ name, email, password, cpf, phone });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await authService.loginUser(email, password);
        res.status(200).json(data);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};