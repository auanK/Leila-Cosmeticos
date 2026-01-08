import * as addressRepository from '../repositories/addressRepository.js';

export const getMyAddresses = async (userId) => {
    return await addressRepository.findAllByUserId(userId);
};

export const addAddress = async (userId, data) => {
    if (!data.street || !data.zipCode || !data.city || !data.state) {
        throw new Error('Preencha os campos obrigatórios: Rua, CEP, Cidade e Estado.');
    }
    return await addressRepository.create(userId, data);
};

export const removeAddress = async (userId, addressId) => {
    return await addressRepository.remove(addressId, userId);
};

export const updateAddress = async (userId, addressId, data) => {
    return await addressRepository.update(addressId, userId, data);
};