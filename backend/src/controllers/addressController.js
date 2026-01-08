import * as addressService from '../services/addressService.js';

export const list = async (req, res) => {
    try {
        const addresses = await addressService.getMyAddresses(req.user.id);
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const addressData = {
            street: req.body.street,
            number: req.body.number,
            complement: req.body.complement,
            neighborhood: req.body.neighborhood,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zip_code,
            isMain: req.body.is_main
        };

        const newAddress = await addressService.addAddress(req.user.id, addressData);
        res.status(201).json(newAddress);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        await addressService.removeAddress(req.user.id, id);
        res.json({ message: 'Endereço removido com sucesso.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const addressData = {
            street: req.body.street,
            number: req.body.number,
            complement: req.body.complement,
            neighborhood: req.body.neighborhood,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zip_code,
            isMain: req.body.is_main
        };

        const updatedAddress = await addressService.updateAddress(req.user.id, id, addressData);
        res.json(updatedAddress);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};