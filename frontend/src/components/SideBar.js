import { Link, useLocation } from "react-router-dom";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { IoCalendarOutline, IoCalendarNumberOutline, IoDocumentTextOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { ArrowLeftStartOnRectangleIcon, HomeIcon, BanknotesIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline';
import { PiPlant, PiTree, PiVirus, PiUsers } from "react-icons/pi";

import { useEffect, useState } from "react";
import axios from "axios";

const getWeekStartEnd = (date, startOfWeek) => {
    let weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + startOfWeek);
    weekStart.setHours(0, 0, 0, 0);

    let weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return { start: weekStart, end: weekEnd };
};

export default function SideBar() {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false); // Sidebar toggle state
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Detect screen size

    const isActive = (path) => {
        const currentPath = location.pathname.split('/')[1];
        return currentPath === path.split('/')[1];
    };

    const [currentWeekData, setCurrentWeekData] = useState({
        transactions: 0,
        income: 0,
        expense: 0,
        profitLoss: 0,
    });

    // Update screen size on resize
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const today = new Date();
        const currentWeek = getWeekStartEnd(today, 1); // Assuming week starts on Monday

        setLoading(true);
        axios.get('https://elemahana-backend.vercel.app/transactions')
            .then((response) => {
                const records = response.data.data;

                const filterAndSummarize = (start, end) => {
                    const filtered = records.filter(record => {
                        const recordDate = new Date(record.date);
                        return recordDate >= start && recordDate <= end;
                    });
                    const income = filtered.filter(record => record.type === 'income').reduce((acc, record) => acc + record.amount, 0);
                    const expense = filtered.filter(record => record.type === 'expense').reduce((acc, record) => acc + record.amount, 0);
                    return {
                        transactions: filtered.length,
                        income,
                        expense,
                        profitLoss: income - expense,
                    };
                };

                setCurrentWeekData(filterAndSummarize(currentWeek.start, currentWeek.end));

                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    const menuItems = [
        { name: "Home", path: "/dashboard", icon: HomeIcon },
        { name: "Schedules", path: "/finances/home", icon: IoCalendarOutline, count: currentWeekData.transactions },
        { name: "Services", path: "/crop/home", icon: PiPlant },
        { name: "Finances", path: "/employees/home", icon: BanknotesIcon },
        { name: "My Profile", path: "/inventory/home", icon: CgProfile },
        { name: "Appointments", path: "/insights/marketprice", icon: IoCalendarNumberOutline },
        { name: "Records", path: "/diseases/home", icon: IoDocumentTextOutline },

    ];

    const systemItems = [
        { name: "Logout", path: "/", icon: ArrowLeftStartOnRectangleIcon },
    ];

    return (
        <div className="relative">
            <div
                className={`${open ? "w-64" : isMobile ? "w-0" : "w-16"} bg-gray-100 h-screen fixed top-0 bottom-0 border-r flex flex-col justify-between divide-y divide-gray-300 transition-width duration-300`}>
                {/* Toggle button */}
                <div
                    className={`absolute cursor-pointer -right-3 top-9 w-7 border-2 rounded-full transition-transform duration-300 ${!open ? "rotate-180" : ""}`}
                    onClick={() => setOpen(!open)}
                >
                    {open ? <IoIosArrowDropleft size={24} /> : <IoIosArrowDropright size={24} />}
                </div>

                {/* Menu items */}
                <ul className="flex flex-col text-gray-800 font-medium text-base py-4 px-3">
                    {menuItems.map((item) => (
                        <Link key={item.name} to={item.path} className="w-full flex flex-row">
                            <li
                                className={`flex items-center w-full h-12 my-1 transition-all duration-200 px-1 ${
                                    isActive(item.path)
                                        ? "bg-gray-200 text-lime-700 rounded-xl px-3 shadow-xl"
                                        : "hover:bg-gray-200 hover:rounded-xl hover:shadow-xl"
                                }`}>
                                <div className="flex items-center justify-between w-full">
                                    <div className="pl-3 flex items-center">
                                        {item.icon && <item.icon className="mr-4 h-5 w-5" />}
                                        {open && item.name}
                                    </div>
                                    {isActive(item.path) && item.count && open && (
                                        <span
                                            className="bg-gray-600 rounded-full w-5 h-5 mr-2 flex items-center justify-center text-xs text-gray-100">
                                            {item.count}
                                        </span>
                                    )}
                                </div>
                            </li>
                        </Link>
                    ))}
                </ul>

                {/* System items (Logout & Settings) */}
                <ul className="flex flex-row items-center gap-2 font-medium text-base py-4 px-4">
                    {systemItems.map((item) => (
                        <Link key={item.name} to={item.path} className="w-full">
                            <li
                                className={`flex items-center w-full h-12 my-1 transition-all duration-200 px-1 ${
                                    isActive(item.path)
                                        ? "bg-gray-200 text-black rounded-xl px-3"
                                        : "hover:bg-red-100 hover:text-red-700 hover:shadow-xl hover:rounded-xl"
                                }`}>
                                <div className="flex items-center justify-between w-full">
                                    <div className="pl-3 flex items-center">
                                        {item.icon && <item.icon className="mr-4 h-5 w-5" />}
                                        {open && item.name}
                                    </div>
                                </div>
                            </li>
                        </Link>
                    ))}
                    {/* Settings Icon */}
                    <li
                        className={`flex items-center justify-center w-16 h-12 transition-all bg-gray-200 ${
                            isActive("/settings")
                                ? "text-gray-700 bg-gradient-to-br from-lime-300 to-emerald-300 duration-200"
                                : "text-gray-600 hover:bg-gray-300"
                        } rounded-full`}>
                        <Link to="/settings" className="w-full h-full flex items-center justify-center">
                            <Cog6ToothIcon className="w-6 h-6" />
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
