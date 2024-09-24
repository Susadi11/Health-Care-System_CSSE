import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/landingPage";


export default function App() {
    const [loading, setLoading] = useState(true);

    // Simulate loading delay with useEffect
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 100); // Simulate 100ms loading time
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="App">
            <Routes>
                {/* Default route that renders the LandingPage */}
                <Route path="/" element={<LandingPage />} />

                {/* Dashboard route */}
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </div>
    );
}
