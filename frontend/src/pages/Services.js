import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import Navbar from "../components/utility/Navbar";
import Breadcrumb from "../components/utility/Breadcrumbs";
import BackButton from "../components/utility/BackButton";
import ServiceUpdate from "../components/Tharushi/ServiceUpdate";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false); // State for edit mode
  const [selectedService, setSelectedService] = useState(null); // Hold the service being edited

  const navigate = useNavigate();

  // Fetch all services when the component loads
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5555/serviceRoute/");
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to fetch services. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Function to navigate to the AddAppointment component
  const handleBook = (service) => {
    navigate("/add-appointment", { state: { service } });
  };

  // Function to handle editing a service
  const handleEdit = (service) => {
    setSelectedService(service); // Set the service to be edited
    setEditMode(true); // Switch to edit mode
  };

  // Function to handle service update
  const handleServiceUpdate = async (updatedService) => {
    try {
      const response = await fetch(
        `http://localhost:5555/serviceRoute/${selectedService._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedService),
        }
      );
      if (!response.ok) throw new Error("Failed to update service");

      const updatedData = await response.json();

      setServices((prevServices) =>
        prevServices.map((service) =>
          service._id === updatedData._id ? updatedData : service
        )
      );
      setEditMode(false); // Exit edit mode
      setSelectedService(null); // Clear selected service
    } catch (error) {
      console.error("Error updating service:", error);
      setError("Failed to update service. Please try again.");
    }
  };

  // Function to handle deleting a service
  const handleDelete = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await fetch(
          `http://localhost:5555/serviceRoute/${serviceId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) throw new Error("Failed to delete the service");

        // Remove the deleted service from the list
        setServices((prevServices) =>
          prevServices.filter((service) => service._id !== serviceId)
        );
      } catch (error) {
        console.error("Error deleting service:", error);
        setError("Failed to delete service. Please try again.");
      }
    }
  };

  // Breadcrumb items
  const breadcrumbItems = [{ name: "Services", href: "/services" }];

  return (
    <div className="flex flex-col min-h-screen font-sans">
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
            Available Services
          </h1>

          {error && <p className="text-red-500">{error}</p>}
          {loading ? (
            <p className="text-center">Loading services...</p>
          ) : (
            <>
              {editMode ? (
                <ServiceUpdate
                  service={selectedService}
                  onUpdate={handleServiceUpdate}
                  onCancel={() => setEditMode(false)}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <div
                      key={service._id}
                      className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
                    >
                      <div>
                        <img
                          src={
                            service.image || "https://via.placeholder.com/150"
                          }
                          alt={service.name}
                          className="w-full h-40 object-cover rounded mb-4"
                        />
                        <h2 className="text-xl font-semibold text-teal-600 mb-2">
                          {service.title}
                        </h2>
                        <p className="text-gray-700 text-sm mb-4">
                          {service.description}
                        </p>
                      </div>
                      <div className="mt-auto">
                        <p className="text-teal-700 font-bold text-lg mb-2">
                          Rs.{service.price}
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleBook(service)} // Navigate to AddAppointment
                            className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg shadow-lg transition duration-200"
                          >
                            Book
                          </button>
                          <button
                            onClick={() => handleEdit(service)}
                            className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg shadow-md"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(service._id)}
                            className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg shadow-md"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;
