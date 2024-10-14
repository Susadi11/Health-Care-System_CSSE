import React, { useEffect, useState } from "react";
import { SnackbarProvider } from "notistack";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import SideBar from "../components/SideBar";
import Navbar from "../components/utility/Navbar";
import BackButton from "../components/utility/BackButton";
import Breadcrumb from "../components/utility/Breadcrumbs";
import Appointment from "../components/Vinuk/Appoinment";
import UserFlowChart from "../components/Vinuk/UserFlowChart";

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [currentTile, setCurrentTile] = useState(1);
    const navigate = useNavigate(); // Initialize useNavigate hook

    const breadcrumbItems = [{ name: "Home", href: "/dashboard" }];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTile((prevTile) => (prevTile === 1 ? 2 : 1));
        }, 5000); // Switch every 20 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <SnackbarProvider>
            <div className="min-h-screen">
                <div className="sticky top-0 z-10">
                    <Navbar />
                </div>

                <div className="grid sm:grid-cols-6">
                    {/* Sidebar */}
                    <div className="col-span-1 sticky top-0">
                        <SideBar />
                    </div>

                    {/* Main Content */}
                    <div className="w-full col-span-5 flex flex-col px-10 relative">
                        <div className="flex flex-row items-center mb-6">
                            <BackButton />
                            <Breadcrumb items={breadcrumbItems} />
                        </div>

                        {/* Doctors Button */}
                        <div className="absolute top-0 right-10 mt-4">
                            <button
                                className="text-white font-semibold py-2 px-4 rounded-lg hover:brightness-110 transition"
                                style={{ backgroundColor: "#268bf0" }}
                                onClick={() => navigate("/DoctorsNames")} // Navigate to DoctorsNames route
                            >
                                Doctors
                            </button>
                        </div>

                        {/* Title Section */}
                        <div className="text-center mb-12">
                            <h1 className="text-5xl font-bold text-gray-800">
                                CARENET ANALYTICS
                            </h1>
                        </div>

                        {/* Charts Section */}
                        <div className="flex flex-col gap-10 items-center justify-center">
                            {/* Appointment Chart */}
                            <div className="w-full max-w-4xl">
                                <Appointment />
                            </div>

                            {/* User Flow Chart with Reduced Height */}
                            <div className="w-full max-w-4xl h-[1000px]">
                                <UserFlowChart />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SnackbarProvider>
    );
}
