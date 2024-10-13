import React, { useEffect, useState } from "react";

const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all services when the component loads
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5555/servicesRoute");
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

  // Handle delete service
  const handleDelete = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await fetch(
          `http://localhost:5555/servicesRoute/${serviceId}`,
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

  // Handle edit service (mockup - you can add modal or separate page for editing)
  const handleEdit = (serviceId) => {
    alert(`Edit service with ID: ${serviceId}`); // Here you can implement the actual edit logic or modal
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-teal-600">
          Manage Services
        </h1>

        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p className="text-center">Loading services...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
              >
                <div>
                  <img
                    src={service.image || "https://via.placeholder.com/150"}
                    alt={service.name}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                  <h2 className="text-xl font-semibold text-teal-600 mb-2">
                    {service.title}
                  </h2>
                  <p className="text-gray-700 text-sm mb-2">
                    {service.description}
                  </p>
                  <p className="text-teal-700 font-bold text-lg mb-2">
                    ${service.price}
                  </p>
                </div>
                <div className="mt-auto flex justify-between">
                  <button
                    onClick={() => handleEdit(service._id)}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesManager;
