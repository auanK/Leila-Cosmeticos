import * as userRepository from '../repositories/userRepository.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('Usuário não encontrado.');

    const { password_hash, ...userSafe } = user;
    return userSafe;
};

export const updateProfile = async (userId, data) => {
    const updateData = { ...data };

    if (data.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.passwordHash = await bcrypt.hash(data.password, salt);
    }

    const updatedUser = await userRepository.update(userId, updateData);

    if (updatedUser) {
        const { password_hash, ...userSafe } = updatedUser;
        return userSafe;
    }

    return updatedUser;
};