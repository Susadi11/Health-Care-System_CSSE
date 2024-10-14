import React, { useState } from 'react';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'Male',
    email: '',
    phone: '',
    address: '',
    insuranceNumber: '',
    physician: '',
    medicalHistory: '',
    bloodType: '',
    emergencyContact: '',
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg max-w-4xl w-full p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile Information</h2>
        
        {/* Two-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={profileData.firstName}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              readOnly
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={profileData.lastName}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              readOnly
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              value={profileData.dob}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              readOnly
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <input
              type="text"
              value={profileData.gender}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              readOnly
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={profileData.email}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              readOnly
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={profileData.phone}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              readOnly
            />
          </div>

          {/* Address (full width in two columns) */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              value={profileData.address}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              readOnly
            />
          </div>

          {/* Insurance Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Insurance Number</label>
            <input
              type="text"
              value={profileData.insuranceNumber}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              readOnly
            />
          </div>

          {/* Physician */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Physician</label>
            <input
              type="text"
              value={profileData.physician}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              readOnly
            />
          </div>

          {/* Medical History (full width) */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Medical History</label>
            <textarea
              value={profileData.medicalHistory}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              readOnly
            />
          </div>

          {/* Blood Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Blood Type</label>
            <input
              type="text"
              value={profileData.bloodType}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              readOnly
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
            <input
              type="tel"
              value={profileData.emergencyContact}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
