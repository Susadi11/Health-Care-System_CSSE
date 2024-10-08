import React, { useEffect, useState } from 'react';

const PatientForm = ({ patient, onUpdate, onCancel }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        email: '',
        phone: '',
        address: '',
        insuranceNumber: '',
        physician: '',
        medicalHistory: '',
        bloodType: '',
        emergencyContact: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (patient) {
            setFormData({
                firstName: patient.firstName,
                lastName: patient.lastName,
                dob: patient.dob.split('T')[0], // Convert to YYYY-MM-DD format for input
                gender: patient.gender,
                email: patient.email,
                phone: patient.phone,
                address: patient.address,
                insuranceNumber: patient.insuranceNumber,
                physician: patient.physician,
                medicalHistory: patient.medicalHistory,
                bloodType: patient.bloodType,
                emergencyContact: patient.emergencyContact,
            });
        }
    }, [patient]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: null,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        for (const [key, value] of Object.entries(formData)) {
            if (!value) {
                newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`;
            }
        }

        // Additional validations for email and phone number
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Email is not valid.';
        }

        const phoneRegex = /^\d{10}$/; // Assuming a 10-digit phone number
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10 digits.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Returns true if no errors
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onUpdate(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
                {patient ? 'Edit Patient' : 'Add Patient'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(formData).map((key) => {
                    // Separate address and medicalHistory for full width
                    if (key === 'address' || key === 'medicalHistory') {
                        return (
                            <div key={key} className="flex flex-col col-span-1 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700 mb-1">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                                <textarea
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    className={`mt-1 border ${
                                        errors[key] ? 'border-red-500' : 'border-green-500'
                                    } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {errors[key] && (
                                    <span className="text-red-500 text-sm">{errors[key]}</span>
                                )}
                            </div>
                        );
                    } else if (key === 'gender') {
                        return (
                            <div key={key} className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-1">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                                <select
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    required
                                    className={`mt-1 border ${
                                        errors[key] ? 'border-red-500' : 'border-green-500'
                                    } rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                {errors[key] && (
                                    <span className="text-red-500 text-sm">{errors[key]}</span>
                                )}
                            </div>
                        );
                    } else {
                        return (
                            <div key={key} className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-1">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                                <input
                                    type={key === 'dob' ? 'date' : 'text'}
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    required
                                    className={`mt-1 border ${
                                        errors[key] ? 'border-red-500' : 'border-green-500'
                                    } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {errors[key] && (
                                    <span className="text-red-500 text-sm">{errors[key]}</span>
                                )}
                            </div>
                        );
                    }
                })}
            </div>
            <div className="flex flex-col md:flex-row justify-between mt-4">
                <button type="submit" className="bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition duration-200">
                    {patient ? 'Update' : 'Add'}
                </button>
                <button type="button" onClick={onCancel} className="bg-gray-300 text-gray-700 rounded-lg py-2 px-4 hover:bg-gray-400 transition duration-200 mt-2 md:mt-0">
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default PatientForm;
