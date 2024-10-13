import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faEdit,
  faSearch,
  faFileDownload,
} from "@fortawesome/free-solid-svg-icons";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { SnackbarProvider } from "notistack";
import SideBar from "../components/SideBar";
import Navbar from "../components/utility/Navbar";
import Breadcrumb from "../components/utility/Breadcrumbs";
import BackButton from "../components/utility/BackButton";
import AppointmentForm from "../components/Tharushi/AppointmentForm";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:5555/appointmentRoute/appointments"
        );
        if (!response.ok) throw new Error("Failed to fetch appointments");
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to fetch appointments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        const response = await fetch(
          `http://localhost:5555/appointmentRoute/appointments/${id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) throw new Error("Failed to delete the appointment");
        setAppointments((prevAppointments) =>
          prevAppointments.filter((appointment) => appointment._id !== id)
        );
      } catch (error) {
        console.error("Error deleting appointment:", error);
        setError(
          "An error occurred while deleting the appointment. Please try again."
        );
      }
    }
  };

  const handleEdit = (appointment) => {
    setEditMode(true);
    setCurrentAppointment(appointment);
  };

  const handleUpdate = async (updatedData) => {
    try {
      const response = await fetch(
        `http://localhost:5555/appointmentRoute/appointments/${currentAppointment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) throw new Error("Failed to update the appointment");

      const updatedAppointment = await response.json();
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === updatedAppointment._id
            ? updatedAppointment
            : appointment
        )
      );
      setEditMode(false);
      setCurrentAppointment(null);
    } catch (error) {
      console.error("Error updating appointment:", error);
      setError(
        "An error occurred while updating the appointment. Please try again."
      );
    }
  };

  const handleReport = () => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFontSize(18);
    doc.text("Appointments Report", doc.internal.pageSize.getWidth() / 2, 13, {
      align: "center",
    });

    const headers = [
      [
        "Appointment Date",
        "Status",
        "Reason",
        "Location",
        "Patient",
        "Doctor",
        "Payment Status",
        "Notes",
      ],
    ];

    const data = appointments.map((appointment) => [
      appointment.appointmentDate || "",
      appointment.appointmentStatus || "",
      appointment.appointmentReason || "",
      appointment.location || "",
      appointment.patientId?.firstName +
        " " +
        appointment.patientId?.lastName || "",
      appointment.doctorId?.firstName + " " + appointment.doctorId?.lastName ||
        "",
      appointment.paymentStatus || "",
      doc.splitTextToSize(appointment.notes || "", 50),
    ]);

    doc.autoTable({
      head: headers,
      body: data,
      startY: 25,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 20 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 20 },
        7: { cellWidth: 40 },
      },
      headStyles: {
        fillColor: [52, 152, 219], // Updated header color to a blue shade
        textColor: [255, 255, 255],
      },
      margin: { top: 20 },
    });

    doc.save("appointments_report.pdf");
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const patientName = appointment.patientId?.firstName?.toLowerCase() || "";
    const doctorName = appointment.doctorId?.firstName?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return patientName.includes(search) || doctorName.includes(search);
  });

  const breadcrumbItems = [
    { name: "Appointments", href: "/appointments/home" },
  ];

  return (
    <SnackbarProvider>
      <div className="flex flex-col min-h-screen font-sans">
        {" "}
        {/* Add modern font family */}
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

            <h1 className="text-3xl font-bold mb-6 text-center text-teal-600">
              Appointment Details
            </h1>
            {error && <p className="text-red-500">{error}</p>}
            {loading ? (
              <p className="text-center">Loading appointments...</p>
            ) : (
              <>
                {!editMode && (
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div className="relative w-full md:w-1/3 mb-3 ml-5 md:mb-0">
                      <input
                        type="text"
                        placeholder="Search by patient or doctor..."
                        className="border rounded-lg shadow-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <span className="absolute top-2 right-3 text-gray-500">
                        <FontAwesomeIcon icon={faSearch} />
                      </span>
                    </div>
                    <button
                      onClick={handleReport}
                      className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center shadow-lg transition duration-200 text-sm"
                    >
                      <FontAwesomeIcon icon={faFileDownload} className="mr-2" />
                      Generate PDF Report
                    </button>
                  </div>
                )}
                {editMode ? (
                  <AppointmentForm
                    appointment={currentAppointment}
                    onUpdate={handleUpdate}
                    onCancel={() => setEditMode(false)}
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-green-200 text-[13.3px]">
                      <thead className="bg-gray-300">
                        <tr>
                          <th className="py-3 px-4 border-b">
                            Appointment Date
                          </th>
                          <th className="py-3 px-4 border-b">Status</th>
                          <th className="py-3 px-4 border-b">Reason</th>
                          <th className="py-3 px-4 border-b">Location</th>
                          <th className="py-3 px-4 border-b">Patient</th>
                          <th className="py-3 px-4 border-b">Doctor</th>
                          <th className="py-3 px-4 border-b">Payment Status</th>
                          <th className="py-3 px-4 border-b">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAppointments.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center py-4">
                              No appointments found.
                            </td>
                          </tr>
                        ) : (
                          filteredAppointments.map((appointment) => (
                            <tr key={appointment._id}>
                              <td className="py-2 px-4 border-b">
                                {appointment.appointmentDate}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {appointment.appointmentStatus}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {appointment.appointmentReason}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {appointment.location}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {appointment.patientId?.firstName}{" "}
                                {appointment.patientId?.lastName}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {appointment.doctorId?.firstName}{" "}
                                {appointment.doctorId?.lastName}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {appointment.paymentStatus}
                              </td>
                              <td className="py-2 px-4 border-b">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEdit(appointment)}
                                    className="text-teal-600 hover:text-teal-500"
                                  >
                                    <FontAwesomeIcon icon={faEdit} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDelete(appointment._id)
                                    }
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

export default Appointments;
