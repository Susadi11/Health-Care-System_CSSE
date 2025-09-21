import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import SideBar from '../../components/SideBar';
import Navbar from '../../components/utility/Navbar';
import Breadcrumb from '../../components/utility/Breadcrumbs';
import BackButton from '../../components/utility/BackButton';

const PaymentPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const appointment = state?.appointment;
    const service = state?.service;
    
    const [paymentMethod, setPaymentMethod] = useState('credit'); // default to credit card
    const [name, setName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('01');
    const [expiryYear, setExpiryYear] = useState('2024');
    const [securityCode, setSecurityCode] = useState('');

    const handlePayment = async (e) => {
        e.preventDefault();

        // Get the current date and time
        const paymentDate = new Date().toISOString(); // Use ISO format to store date and time in MongoDB

        const paymentData = {
            paymentMethod,
            name,
            cardNumber,
            expiryMonth,
            expiryYear,
            securityCode,
            paymentDate, // Add payment date to the data being sent to the server
            appointmentId: appointment?.appointmentId,
            amount: service?.price || 100, // Default amount if no service price
        };

        try {
            const response = await fetch('https://health-care-system-csse.vercel.app/paymentRoute/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Payment successful!');
                // Clear form after successful payment
                setPaymentMethod('credit');
                setName('');
                setCardNumber('');
                setExpiryMonth('01');
                setExpiryYear('2024');
                setSecurityCode('');
                // Navigate back to appointments or dashboard
                navigate('/appointments/home');
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Payment Error:', error);
            alert('An error occurred during payment.');
        }
    };

    const breadcrumbItems = [
        { name: 'Patient Details', href: '/patients/home' }
    ];

    return (
        <SnackbarProvider>
            <div className="flex flex-col min-h-screen font-sans">
                <div className="sticky top-0 z-10">
                    <Navbar />
                </div>
                <div className="flex flex-1">
                    <div className="hidden sm:block w-1/6 md:w-1/5 lg:w-1/4">
                        <SideBar />
                    </div>
                    <div className="w-full">
                        <div className="flex flex-row items-center mb-0">
                            <BackButton />
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                        <div className="min-w-screen min-h-screen justify-center px-5 pt-0 border-black">
                            <div className="w-full mx-auto rounded-lg bg-white border-black shadow-lg p-5" style={{ maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
                                <div className="w-full pt-1 pb-5"></div>
                                <div className="mb-8">
                                    <h1 className="text-center font-bold text-xl uppercase">Secure Payment Info</h1>
                                </div>
                                
                                {/* Appointment Summary */}
                                {appointment && (
                                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                                        <h3 className="font-bold text-lg mb-3 text-gray-800">Appointment Summary</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="font-medium">Appointment ID:</span>
                                                <span>{appointment.appointmentId}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">Date:</span>
                                                <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">Time:</span>
                                                <span>{appointment.time}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">Reason:</span>
                                                <span>{appointment.appointmentReason}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">Location:</span>
                                                <span>{appointment.location}</span>
                                            </div>
                                            {service && (
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Service:</span>
                                                    <span>{service.title}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between border-t pt-2 mt-2">
                                                <span className="font-bold">Amount:</span>
                                                <span className="font-bold text-green-600">${service?.price || 100}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Fallback message if no appointment data */}
                                {!appointment && (
                                    <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <h3 className="font-bold text-lg mb-2 text-yellow-800">No Appointment Data</h3>
                                        <p className="text-sm text-yellow-700">
                                            No appointment information found. Please go back and create an appointment first.
                                        </p>
                                        <button
                                            onClick={() => navigate('/add-appointment')}
                                            className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-200"
                                        >
                                            Create Appointment
                                        </button>
                                    </div>
                                )}
                                
                                <form onSubmit={handlePayment} style={{ opacity: appointment ? 1 : 0.5, pointerEvents: appointment ? 'auto' : 'none' }}>
                                    {/* Payment Method Selection */}
                                    <div className="mb-5">
                                        <h2 className="font-bold text-sm mb-2 ml-1">Payment Method</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    value="credit"
                                                    checked={paymentMethod === 'credit'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="mr-2"
                                                />
                                                Credit Card
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    value="paypal"
                                                    checked={paymentMethod === 'paypal'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="mr-2"
                                                />
                                                PayPal
                                            </label>
                                        </div>
                                    </div>
                                    {/* Name on Card */}
                                    <div className="mb-3">
                                        <label className="font-bold text-sm mb-2 ml-1">Name on Card</label>
                                        <input
                                            className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                                            placeholder="John Smith"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    {/* Card Number */}
                                    <div className="mb-3">
                                        <label className="font-bold text-sm mb-2 ml-1">Card Number</label>
                                        <input
                                            className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                                            placeholder="0000 0000 0000 0000"
                                            type="text"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                            required
                                        />
                                    </div>
                                    {/* Expiration Date */}
                                    <div className="mb-3 -mx-2 flex items-end">
                                        <div className="px-2 w-1/2">
                                            <label className="font-bold text-sm mb-2 ml-1">Expiration Date</label>
                                            <select
                                                className="form-select w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                                                value={expiryMonth}
                                                onChange={(e) => setExpiryMonth(e.target.value)}
                                                required
                                            >
                                                {[...Array(12)].map((_, index) => (
                                                    <option key={index} value={String(index + 1).padStart(2, '0')}>
                                                        {String(index + 1).padStart(2, '0')} - {new Date(0, index).toLocaleString('default', { month: 'long' })}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="px-2 w-1/2">
                                            <select
                                                className="form-select w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                                                value={expiryYear}
                                                onChange={(e) => setExpiryYear(e.target.value)}
                                                required
                                            >
                                                {[...Array(10)].map((_, index) => (
                                                    <option key={index} value={2024 + index}>
                                                        {2024 + index}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {/* Security Code */}
                                    <div className="mb-5">
                                        <label className="font-bold text-sm mb-0 ml-1">Security Code</label>
                                        <input
                                            className="w-32 px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                                            placeholder="000"
                                            type="text"
                                            value={securityCode}
                                            onChange={(e) => setSecurityCode(e.target.value)}
                                            required
                                        />
                                    </div>
                                    {/* Payment Button */}
                                    <div>
                                    <button className="block w-full bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-4 py-3 font-semibold transition duration-300">
                                            <i className="mdi mdi-lock-outline mr-1"></i> PAY NOW
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SnackbarProvider>
    );
};

export default PaymentPage;
