import express from 'express';
import {Product} from '../models/Product.js';
import mongoose from 'mongoose';

const router = express.Router();

// Add a new product
router.post('/', async (req, res) => {
    try {
        const { name, price, description } = req.body;

        // Check if all required fields are present
        if (!name || !price || !description) {
            return res.status(400).send({
                message: 'All required fields (name, price, description) must be provided',
            });
        }

        // Create a new product
        const newProduct = await Product.create({ name, price, description });
        return res.status(201).send(newProduct);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        return res.status(200).json({
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

// Get a product by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate that ID is provided
        if (!id) {
            return res.status(400).json({ message: 'ID parameter is required' });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json(product);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

// Update a product by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;

        // Check if all required fields are present
        if (!name || !price || !description) {
            return res.status(400).send({
                message: 'All required fields (name, price, description) must be provided',
            });
        }

        // Find and update the product
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).send(updatedProduct);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

// Delete a product by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the product
        const result = await Product.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).send({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

export default router;
