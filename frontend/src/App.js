import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/landingPage";
import LoginPage from "./pages/loginPage";
import SignUpPage from "./pages/signUpPage";


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
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/signUp" element={<SignUpPage/>} />
            </Routes>
        </div>
    );
}
