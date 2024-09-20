import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

export default function App() {
    const [loading, setLoading] = useState(true);

    // Simulate loading delay with useEffect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 100); // Simulate 2 seconds loading time
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="App">
            <Routes>
                {/* Default route that redirects to /dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" />} />

                {/* Dashboard route */}
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </div>
    );
}
