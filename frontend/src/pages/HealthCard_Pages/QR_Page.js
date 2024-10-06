import React, { useState } from "react";
import Navbar from "../../components/utility/Navbar";
import BackButton from "../../components/utility/BackButton";
import Breadcrumb from "../../components/utility/Breadcrumbs";
import { MdQrCodeScanner } from 'react-icons/md';
import SideBar from "../../components/SideBar";

const breadcrumbItems = [
    { name: 'QR Scanner', href: '/QR_Scanner/home' }
];

export default function QR_Page() {
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const handleScanClick = () => {
        setIsScannerOpen(!isScannerOpen);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="sticky top-0 z-10">
                <Navbar />
            </div>
            <div className="flex flex-1">
                <div className="hidden sm:block w-1/6">
                    <SideBar />
                </div>
                <div className="flex-1 w-full sm:w-5/6 p-4 flex flex-col">
                    <div className="mb-4">
                        <div className="flex flex-row items-center space-x-2 mb-4">
                            <BackButton />
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                        <div className="flex justify-start">
                            <button
                                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none"
                                onClick={handleScanClick}
                            >
                                <MdQrCodeScanner className="mr-2" size={20} />
                                <span className="text-sm sm:text-base">Scan QR</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}