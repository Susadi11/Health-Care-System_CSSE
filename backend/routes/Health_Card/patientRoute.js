import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Patient } from "../../models/Health_Card/patientModel.js";

const router = express.Router();

// Enable CORS for all routes
router.use(cors());

// Create a new patient and return QR code data
router.post('/', async (req, res) => {
    try {
        const {
            firstName, lastName, dob, gender, email, phone,
            address, insuranceNumber, physician, medicalHistory,
            bloodType, emergencyContact
        } = req.body;

        // Check if all required fields are present
        if (!firstName || !lastName || !dob || !gender || !email || !phone ||
            !address || !insuranceNumber || !physician || !medicalHistory ||
            !bloodType || !emergencyContact) {
            return res.status(400).json({
                message: 'All required fields must be provided',
            });
        }

        // Create a new patient
        const newPatient = await Patient.create({
            firstName, lastName, dob, gender, email, phone,
            address, insuranceNumber, physician, medicalHistory,
            bloodType, emergencyContact
        });

        // Return newly created patient and a QR data string
        const qrData = JSON.stringify(newPatient); // QR data as a string
        return res.status(201).json({
            patient: newPatient,
            qrData
        });
    } catch (error) {
        console.error('Error:', error);
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;