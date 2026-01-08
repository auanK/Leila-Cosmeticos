import * as userService from '../services/userService.js';

export const getMe = async (req, res) => {
    try {
        const user = await userService.getProfile(req.user.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const userId = req.user.id;

        const data = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password
        };

        const updatedUser = await userService.updateProfile(userId, data);

        res.json({
            message: 'Perfil atualizado com sucesso!',
            user: updatedUser
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};