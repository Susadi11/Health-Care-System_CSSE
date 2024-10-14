import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Update the path to firebaseConfig.js

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSignUp = (e) => {
        e.preventDefault();
        setError(null);

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Signed up user:', userCredential.user);
                // Redirect or perform additional actions after signup
            })
            .catch((error) => {
                console.error('Error signing up:', error);
                setError('Could not create account. Try again.');
            });
    };

    return (
        <div className="h-screen w-screen flex justify-center items-center bg-white">
            <div className="grid gap-8">
                <div id="back-div" className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] m-4">
                    <div className="border-[20px] border-transparent rounded-[20px] bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2">
                        <h1 className="pt-8 pb-6 font-bold text-5xl text-center">
                            Sign Up
                        </h1>
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        <form onSubmit={handleSignUp} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="mb-2 text-lg">Email</label>
                                <input
                                    id="email"
                                    className="border p-3 shadow-md border-gray-300 rounded-lg w-full"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="mb-2 text-lg">Password</label>
                                <input
                                    id="password"
                                    className="border p-3 shadow-md border-gray-300 rounded-lg w-full"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                className="bg-gradient-to-r from-blue-500 to-purple-500 mt-6 p-2 text-white rounded-lg w-full hover:scale-105 transition duration-300"
                                type="submit"
                            >
                                SIGN UP
                            </button>
                        </form>
                        <div className="flex flex-col mt-4 items-center text-sm">
                            <h3>Already have an account? <Link to="/login" className="text-blue-400">Log In</Link></h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
