import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faSearch, faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { jsPDF } from 'jspdf';
import PatientForm from '../../components/vindi/PatientForm';
import 'jspdf-autotable';
import { SnackbarProvider } from 'notistack';
import SideBar from '../../components/SideBar';
import Navbar from '../../components/utility/Navbar';
import Breadcrumb from '../../components/utility/Breadcrumbs';
import BackButton from '../../components/utility/BackButton';


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
        const doc = new jsPDF('p', 'mm', [297, 420]);
    
        // Set the title for the report
        doc.setFontSize(18);
        doc.text('Patients Report', doc.internal.pageSize.getWidth() / 2, 13, { align: 'center' });
    
        // Table headers
        const headers = [
            ['Id', 'First Name','Last Name','Phone', 'Address', 'Insurance Number', 'Physician', 'Medical History', 'Blood Type', 'Emergency Contact']
        ];
    
        // Table data
        const data = patients.map(patient => [
            patient.U_id || '',
            patient.firstName || '',
            patient.lastName || '',
            patient.phone || '',
            patient.address || '',
            patient.insuranceNumber || '',
            patient.physician || '',
            doc.splitTextToSize(patient.medicalHistory || '', 50),
            patient.bloodType || '',
            doc.splitTextToSize(patient.emergencyContact || '', 50)
        ]);
    
        // AutoTable configuration
        const tableWidth = 250; // Approximate table width (adjust as necessary)
        const pageWidth = doc.internal.pageSize.getWidth(); // Get page width
        const marginLeft = (pageWidth - tableWidth) / 2; // Calculate left margin to center the table
    
        // Generate the table
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
                0: { cellWidth: 35 },
                1: { cellWidth: 18 },
                2: { cellWidth: 18 },
                3: { cellWidth: 26 },
                4: { cellWidth: 30 },
                5: { cellWidth: 26 },
                6: { cellWidth: 25 },
                7: { cellWidth: 30 },
                8: { cellWidth: 15 },
                9: { cellWidth: 25 },
            },
            headStyles: {
                fillColor: [52, 152, 219], // Blue header color
                textColor: [255, 255, 255], // White text color
            },
            margin: { top: 20, left: marginLeft }, // Set calculated left margin to center the table
        });
    
        // Save the PDF
        doc.save('patients_report.pdf');
    };
    

    const filteredPatients = patients.filter(patient =>
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const breadcrumbItems = [
        { name: 'Patient Details', href: '/patients/home' }
    ];

    return (
        <SnackbarProvider>
            <div className="flex flex-col min-h-screen font-sans"> {/* Add modern font family */}
                <div className="sticky top-0 z-10">
                    <Navbar />
                </div>
                <div className="flex flex-1">
                    <div className="hidden sm:block w-1/6 md:w-1/5 lg:w-1/4">
                        <SideBar />
                    </div>
                    <div className="w-full sm:w-5/6 flex flex-col p-4 mt-1 sm:mt-0">
                        <div className="flex flex-row items-center mb-4">
                            <BackButton />
                            <Breadcrumb items={breadcrumbItems} />
                        </div>

                        <h1 className="text-3xl font-bold mb-6 text-center text-teal-600">Patient Details</h1>
                        {error && <p className="text-red-500">{error}</p>}
                        {loading ? (
                            <p className="text-center">Loading patients...</p>
                        ) : (
                            <>
                                {!editMode && (
                                    <div className="flex flex-col md:flex-row justify-between mb-4">
                                        <div className="relative w-full md:w-1/3 mb-3 ml-5 md:mb-0">
                                            <input
                                                type="text"
                                                placeholder="Search by name..."
                                                className="border rounded-lg shadow-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm" // Use smaller font
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                            <span className="absolute top-2 right-3 text-gray-500">
                                                <FontAwesomeIcon icon={faSearch} />
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleReport}
                                            className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center shadow-lg transition duration-200 text-sm" // Use smaller font
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
                                        <table className="min-w-full bg-white border border-green-200 text-[13.3px]  "> {/* Set table font to smaller */}
                                            <thead className="bg-gray-300 ">
                                            <tr>
                                            <th className="py-3 px-4 border-b">Id</th>
                                                <th className="py-3 px-4 border-b">First Name</th>
                                                <th className="py-3 px-4 border-b">Last Name</th>
                                                <th className="py-3 px-4 border-b">DOB</th>
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
                                            <tbody>
                                            {filteredPatients.length === 0 ? (
                                                <tr>
                                                    <td colSpan="13" className="text-center py-4">No patients found.</td>
                                                </tr>
                                            ) : (
                                                filteredPatients.map((patient) => (
                                                    <tr key={patient._id}>
                                                        <td className="py-2 px-4 border-b">{patient.U_id}</td>
                                                        <td className="py-2 px-4 border-b">{patient.firstName}</td>
                                                        <td className="py-2 px-4 border-b">{patient.lastName}</td>
                                                        <td className="py-2 px-4 border-b">{patient.dob}</td>
                                                        <td className="py-2 px-4 border-b">{patient.gender}</td>
                                                        <td className="py-2 px-4 border-b">{patient.email}</td>
                                                        <td className="py-2 px-4 border-b">{patient.phone}</td>
                                                        <td className="py-2 px-4 border-b">{patient.address}</td>
                                                        <td className="py-2 px-4 border-b">{patient.insuranceNumber}</td>
                                                        <td className="py-2 px-4 border-b">{patient.physician}</td>
                                                        <td className="py-2 px-4 border-b">{patient.medicalHistory}</td>
                                                        <td className="py-2 px-4 border-b">{patient.bloodType}</td>
                                                        <td className="py-2 px-4 border-b">{patient.emergencyContact}</td>
                                                        <td className="py-2 px-4 border-b">
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => handleEdit(patient)}
                                                                    className="text-teal-600 hover:text-teal-500"
                                                                >
                                                                    <FontAwesomeIcon icon={faEdit} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(patient._id)}
                                                                    className="text-red-600 hover:text-red-500"
                                                                >
                                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </SnackbarProvider>
    );
};

export default Patients;
