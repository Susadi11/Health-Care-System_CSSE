import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faSearch, faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { jsPDF } from 'jspdf';
import PatientForm from '../../components/vindi/PatientForm';
import 'jspdf-autotable'; 

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [currentPatient, setCurrentPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5555/patientRoute/patients');
                if (!response.ok) throw new Error('Failed to fetch patients');
                const data = await response.json();
                setPatients(data);
            } catch (error) {
                console.error('Error fetching patients:', error);
                setError("Failed to fetch patients. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                const response = await fetch(`http://localhost:5555/patientRoute/patients/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete the patient');
                setPatients(prevPatients => prevPatients.filter(patient => patient._id !== id));
            } catch (error) {
                console.error('Error deleting patient:', error);
                setError("An error occurred while deleting the patient. Please try again.");
            }
        }
    };

    const handleEdit = (patient) => {
        setEditMode(true);
        setCurrentPatient(patient);
    };

    const handleUpdate = async (updatedData) => {
        try {
            const response = await fetch(`http://localhost:5555/patientRoute/patients/${currentPatient._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) throw new Error('Failed to update the patient');

            const updatedPatient = await response.json();
            setPatients(prevPatients => prevPatients.map(patient => 
                patient._id === updatedPatient._id ? updatedPatient : patient
            ));
            setEditMode(false);
            setCurrentPatient(null);
        } catch (error) {
            console.error('Error updating patient:', error);
            setError("An error occurred while updating the patient. Please try again.");
        }
    };

    const handleReport = () => {
        const doc = new jsPDF('p', 'mm', 'a4'); 
    
        doc.setFontSize(18);
        doc.text('Patients Report', doc.internal.pageSize.getWidth() / 2, 13, { align: 'center' });

        const headers = [
            ['First Name', 'Phone', 'Address', 'Insurance Number', 'Physician', 'Medical History', 'Blood Type', 'Emergency Contact']
        ];
    
        const data = patients.map(patient => [
            patient.firstName || '',
            patient.phone || '',
            patient.address || '',
            patient.insuranceNumber || '',
            patient.physician || '',
            doc.splitTextToSize(patient.medicalHistory || '', 50),
            patient.bloodType || '',
            doc.splitTextToSize(patient.emergencyContact || '', 50)
        ]);
    
        doc.autoTable({
            head: headers,
            body: data,
            startY: 25,
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 3,
            },
            columnStyles: {
                0: { cellWidth: 18 },
                1: { cellWidth: 26 },
                2: { cellWidth: 30 },
                3: { cellWidth: 25 },
                4: { cellWidth: 20 },
                5: { cellWidth: 29 },
                6: { cellWidth: 15 },
                7: { cellWidth: 25 },
            },
            headStyles: {
                fillColor: [52, 152, 219], // Updated header color to a blue shade
                textColor: [255, 255, 255],
            },
            margin: { top: 20 },
        });
    
        doc.save('patients_report.pdf');
    };

    const filteredPatients = patients.filter(patient =>
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-teal-600">Patient Details</h1>
            {error && <p className="text-red-500">{error}</p>}
            {loading ? (
                <p className="text-center">Loading patients...</p>
            ) : (
                <>
                    {!editMode && (
                        <div className="flex flex-col md:flex-row justify-between mb-4">
                            <div className="relative w-full md:w-1/3 mb-2 md:mb-0">
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    className="border rounded-lg shadow-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="absolute top-2 right-3 text-gray-500">
                                    <FontAwesomeIcon icon={faSearch} />
                                </span>
                            </div>
                            <button
                                onClick={handleReport}
                                className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center shadow-lg transition duration-200"
                            >
                                <FontAwesomeIcon icon={faFileDownload} className="mr-2" />
                                Generate PDF Report
                            </button>
                        </div>
                    )}
                    {editMode ? (
                        <PatientForm 
                            patient={currentPatient}
                            onUpdate={handleUpdate}
                            onCancel={() => setEditMode(false)}
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
                                <thead className="bg-teal-600 text-white">
                                    <tr>
                                        <th className="py-3 px-4 border-b">First Name</th>
                                        <th className="py-3 px-4 border-b">Last Name</th>
                                        <th className="py-3 px-4 border-b">Date of Birth</th>
                                        <th className="py-3 px-4 border-b">Gender</th>
                                        <th className="py-3 px-4 border-b">Email</th>
                                        <th className="py-3 px-4 border-b">Phone</th>
                                        <th className="py-3 px-4 border-b">Address</th>
                                        <th className="py-3 px-4 border-b">Insurance Number</th>
                                        <th className="py-3 px-4 border-b">Physician</th>
                                        <th className="py-3 px-4 border-b">Medical History</th>
                                        <th className="py-3 px-4 border-b">Blood Type</th>
                                        <th className="py-3 px-4 border-b">Emergency Contact</th>
                                        <th className="py-3 px-4 border-b">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-100">
                                    {filteredPatients.map(patient => (
                                        <tr key={patient._id} className="hover:bg-teal-50 transition duration-200">
                                            <td className="py-2 px-4 border-b">{patient.firstName}</td>
                                            <td className="py-2 px-4 border-b">{patient.lastName}</td>
                                            <td className="py-2 px-4 border-b">{patient.dateOfBirth}</td>
                                            <td className="py-2 px-4 border-b">{patient.gender}</td>
                                            <td className="py-2 px-4 border-b">{patient.email}</td>
                                            <td className="py-2 px-4 border-b">{patient.phone}</td>
                                            <td className="py-2 px-4 border-b">{patient.address}</td>
                                            <td className="py-2 px-4 border-b">{patient.insuranceNumber}</td>
                                            <td className="py-2 px-4 border-b">{patient.physician}</td>
                                            <td className="py-2 px-4 border-b">{patient.medicalHistory}</td>
                                            <td className="py-2 px-4 border-b">{patient.bloodType}</td>
                                            <td className="py-2 px-4 border-b">{patient.emergencyContact}</td>
                                            <td className="py-2 px-4 border-b flex space-x-2">
                                                <button 
                                                    className="text-teal-600 hover:text-teal-800"
                                                    onClick={() => handleEdit(patient)}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                <button 
                                                    className="text-red-600 hover:text-red-800"
                                                    onClick={() => handleDelete(patient._id)}
                                                >
                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Patients;
