import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import {
    IoCalendarOutline,
    IoCalendarNumberOutline,
    IoDocumentTextOutline
} from "react-icons/io5";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { HomeIcon, BanknotesIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { PiPlant } from "react-icons/pi";
import axios from 'axios';

const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const Menus = [
        { name: "Home", path: "/dashboard", icon: HomeIcon },
        { name: "Schedules", path: "/finances/home", icon: IoCalendarOutline },
        { name: "Services", path: "/crop/home", icon: PiPlant },
        { name: "Finances", path: "/employees/home", icon: BanknotesIcon },
        { name: "My Profile", path: "/inventory/home", icon: CgProfile },
        { name: "Appointments", path: "/insights/marketprice", icon: IoCalendarNumberOutline },
        { name: "Records", path: "/diseases/home", icon: IoDocumentTextOutline },
    ];

    const isActive = (path) => {
        const currentPath = location.pathname.split('/')[1];
        return currentPath === path.split('/')[1];
    };

    return (
        <div className="flex">
            <div
                className={`${
                    open ? "w-72" : "w-24"
                } bg-gray-100 h-screen p-5 pt-8 relative duration-300 flex flex-col justify-between`}
            >
                <div>
                    <div
                        className={`absolute cursor-pointer -right-3 top-9 w-7 border-2 rounded-full bg-white ${
                            !open ? "rotate-180" : ""
                        }`}
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <IoIosArrowDropleft size={24} /> : <IoIosArrowDropright size={24} />}
                    </div>
                    <div className="flex gap-x-4 items-center">
                        <img
                            src="/path-to-your-logo.png"
                            className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`}
                            alt="Logo"
                        />
                        <h1
                            className={`text-black origin-left font-medium text-xl duration-200 ${
                                !open && "scale-0"
                            }`}
                        >
                            Your App Name
                        </h1>
                    </div>
                    <ul className="pt-6">
                        {Menus.map((menu, index) => (
                            <Link to={menu.path} key={index}>
                                <li
                                    className={`flex rounded-md p-4 cursor-pointer text-gray-800 font-semibold text-md items-center gap-x-4 focus:outline-none focus:ring focus:ring-lime-500 transition-all duration-200 px-1 hover:bg-gray-200 hover:rounded-xl hover:shadow-xl
                        ${menu.gap ? "mt-9" : "mt-2"} ${
                                        isActive(menu.path) && "bg-gray-200 text-lime-700 rounded-xl px-3 shadow-xl hover:bg-gray-200 hover:rounded-xl hover:shadow-xl"
                                    }`}
                                >
                                    {React.createElement(menu.icon, { className: 'w-5 h-5 ml-2' })}
                                    <span className={`${!open && "hidden"} origin-left duration-200 `}>
                                        {menu.name}
                                    </span>
                                    {menu.count !== undefined && open && isActive(menu.path) && (
                                        <span className="bg-gray-600 rounded-full w-5 h-5 flex items-center justify-center text-xs text-gray-100">
                                            {loading ? '...' : menu.count}
                                        </span>
                                    )}
                                </li>
                            </Link>
                        ))}
                    </ul>
                </div>

                {/* Logout Button */}
                <div className="pb-4">
                    <li
                        className={`flex rounded-md p-4 cursor-pointer text-gray-800 font-semibold text-md items-center gap-x-4 focus:outline-none focus:ring focus:ring-lime-500 transition-all duration-200 px-1 hover:bg-red-100 hover:text-red-700 hover:rounded-xl hover:shadow-xl ${
                            open ? "justify-start" : "justify-center"
                        }`}
                        onClick={() => {
                            // Add your logout logic here
                            console.log("Logout clicked");
                        }}
                    >
                        {React.createElement(ArrowLeftStartOnRectangleIcon, { className: 'w-5 h-5 ml-2' })}
                        <span className={`${!open && "hidden"} origin-left duration-200 `}>Logout</span>
                    </li>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
