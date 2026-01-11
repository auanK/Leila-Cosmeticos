import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/userRepository.js';

export const registerUser = async (data) => {
    const { name, email, password, cpf, phone } = data;

    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
        throw new Error('O email já está em uso.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    return await userRepository.createUser({
        name,
        email,
        passwordHash,
        cpf,
        phone
    });
};

export const loginUser = async (email, password) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        throw new Error('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        throw new Error('Credenciais inválidas');
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, isAdmin: user.is_admin },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            cpf: user.cpf,
            
            isAdmin: user.is_admin
        }
    };
};