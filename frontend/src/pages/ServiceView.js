import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import Navbar from "../components/utility/Navbar";
import Breadcrumb from "../components/utility/Breadcrumbs";
import BackButton from "../components/utility/BackButton";

const ServiceView = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

          <h1 className="text-3xl font-semibold mb-6 text-center text-teal-600">
          Offering The Most Advanced Clinical Programs 
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
                    <h1 className="text-xl font-bold text-teal-600 mb-2 ">
                      {service.title}
                    </h1>
                   
                    <p className="text-gray-700 text-sm mb-4">
                      {service.description}
                    </p>
                    <h2 className="text-l font-semibold text-gray-700 mb-2">
                      {service.name}
                    </h2>
                  </div>
                  <div className="mt-auto">
                     
                    <button
                      onClick={() => handleBook(service)} // Navigate to AddAppointment
                      className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg shadow-lg transition duration-200"
                    >
                      Book an Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceView;
