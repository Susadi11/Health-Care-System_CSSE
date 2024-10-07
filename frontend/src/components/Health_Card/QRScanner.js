import React, { useState } from "react";
import QrScanner from "react-qr-scanner";
import axios from "axios";

const QRScanner = ({ selectedCamera }) => {
    const [scanResult, setScanResult] = useState(null);
    const [patientData, setPatientData] = useState(null);
    const [error, setError] = useState("");

    const handleScan = async (data) => {
        if (data) {
            console.log("Scanned Data:", data);
            setScanResult(data);
            try {
                const response = await axios.get(`http://localhost:5000/api/patient/${data}`);
                setPatientData(response.data);
            } catch (err) {
                setError("Error fetching patient information");
                console.error("Axios Error:", err.response ? err.response.data : err.message);
            }
        }
    };

    const handleError = (err) => {
        console.error("QR Scanner Error:", err);
        setError("Error scanning the QR code");
    };

    const previewStyle = {
        height: 500,
        width: 500,
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h2>Scan Patient's QR Code</h2>
            {selectedCamera && (
                <QrScanner
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={previewStyle}
                    constraints={{
                        video: {
                            deviceId: selectedCamera,
                            facingMode: "environment"
                        }
                    }}
                />
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {patientData && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Patient Information</h3>
                    <p>Name: {patientData.name}</p>
                    <p>Age: {patientData.age}</p>
                    <p>Medical History: {patientData.medicalHistory}</p>
                </div>
            )}
        </div>
    );
};

export default QRScanner;
