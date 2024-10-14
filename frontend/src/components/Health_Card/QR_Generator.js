import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FiDownload } from 'react-icons/fi';

const QR_Generator = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: 'Male',
        email: '',
        phone: '',
        address: '',
        insuranceNumber: '',
        physician: '',
        medicalHistory: '',
        bloodType: '',
        emergencyContact: '',
    });

    const [generatedId, setGeneratedId] = useState('');
    const qrRef = useRef();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://health-care-system-csse.vercel.app/patientRoute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Patient registered:', data.patient);
                alert(`Patient registered successfully! Unique ID: ${data.patient.U_id}`);
                navigate(`/generate-qr/${data.patient.U_id}`);
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while registering the patient.');
        }
    };

    return (
        <div className="pt-2">
            <div className="flex flex-col ml-64 mt-6">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Patient Registration
                </h1>
            </div>
            <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit}>
                <div className="space-y-12 px-0 py-16 w-6/12 ml-1">
                    <div className="border-b border-gray-900/10 pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="col-span-full">
                                <label htmlFor="firstName"
                                       className="block text-sm font-medium leading-6 text-gray-900">
                                    First Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="firstName"
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="lastName"
                                       className="block text-sm font-medium leading-6 text-gray-900">
                                    Last Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="lastName"
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="dob"
                                       className="block text-sm font-medium leading-6 text-gray-900">
                                    Date of Birth
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="date"
                                        name="dob"
                                        id="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    id="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>


                            <div className="sm:col-span-3">
                                <label htmlFor="email"
                                       className="block text-sm font-medium leading-6 text-gray-900">
                                    Email
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="phone"
                                       className="block text-sm font-medium leading-6 text-gray-900">
                                    Phone Number
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-span-full">
                                <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                                    Address
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-span-full">
                                <label htmlFor="insuranceNumber"
                                       className="block text-sm font-medium leading-6 text-gray-900">
                                    Health Insurance Number
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="insuranceNumber"
                                        id="insuranceNumber"
                                        value={formData.insuranceNumber}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-span-full">
                                <label htmlFor="physician"
                                       className="block text-sm font-medium leading-6 text-gray-900">
                                    Primary Care Physician
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="physician"
                                        id="physician"
                                        value={formData.physician}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                        required
                                    />
                                </div>
                            </div>


                            <div className="col-span-full">
                                <label htmlFor="medicalHistory"
                                       className="block text-sm font-medium leading-6 text-gray-900">
                                    Medical History
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        name="medicalHistory"
                                        id="medicalHistory"
                                        value={formData.medicalHistory}
                                        onChange={handleChange}
                                        rows="3"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-full">
                        <label htmlFor="bloodType" className="block text-sm font-medium leading-6 text-gray-900">
                            Blood Type
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="bloodType"
                                id="bloodType"
                                value={formData.bloodType}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                required
                            />
                        </div>
                    </div>
                    <div className="col-span-full">
                        <label htmlFor="emergencyContact" className="block text-sm font-medium leading-6 text-gray-900">
                            Emergency Contact
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="emergencyContact"
                                id="emergencyContact"
                                value={formData.emergencyContact}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                required
                            />
                        </div>
                    </div>


                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                            type="button"
                            className="rounded-full bg-gray-300 px-4 py-1 hover:bg-gray-400 text-sm font-semibold  text-gray-900"

                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-full bg-blue-200 px-4 py-1 text-sm font-semibold text-gray-900 shadow-sm hover:bg-blue-300"
                        >
                            Register
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default QR_Generator;