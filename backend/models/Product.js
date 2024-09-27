import mongoose from 'mongoose';

// Define Product Schema
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps
    }
);

// Export Product model
export const Product = mongoose.model('Product', productSchema);
