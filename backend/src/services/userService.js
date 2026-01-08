import * as userRepository from '../repositories/userRepository.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('Usuário não encontrado.');
    return user;
};

export const updateProfile = async (userId, data) => {
    const updateData = { ...data };

    if (data.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.passwordHash = await bcrypt.hash(data.password, salt);
    }

    return await userRepository.update(userId, updateData);
};