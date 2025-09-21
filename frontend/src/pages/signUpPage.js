import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { auth, googleProvider } from '../firebaseConfig'; // Adjust the path to where firebaseConfig.js is located
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { FaArrowLeft } from 'react-icons/fa'; // Import an arrow icon (FontAwesome for this example)
import GoogleButton from '../components/GoogleButton';
import Divider from '../components/Divider';

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const navigate = useNavigate(); // Initialize the useNavigate hook

    const handleSignUp = (e) => {
        e.preventDefault();
        setError(null);

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Signed up user:', userCredential.user);
                navigate('/signup/register'); // Navigate to the register page after signup
            })
            .catch((error) => {
                console.error('Error signing up:', error);
                setError('Could not create account. Try again.');
            });
    };

    const handleGoogleSignUp = async () => {
        setError(null);
        setIsGoogleLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log('Google sign-up successful:', result.user);
            navigate('/signup/register'); // Navigate to the register page after Google signup
        } catch (error) {
            console.error('Error with Google sign-up:', error);
            setError('Failed to sign up with Google');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex justify-center items-center bg-white">
            <div className="grid gap-8">
                <div id="back-div" className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] m-4">
                    <div className="border-[20px] border-transparent rounded-[20px] bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2 relative">
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
                        
                        <Divider />
                        <GoogleButton 
                            onClick={handleGoogleSignUp} 
                            text={isGoogleLoading ? "Signing up..." : "Sign up with Google"}
                            className={isGoogleLoading ? "opacity-75 cursor-not-allowed" : ""}
                        />
                        <div className="flex flex-col mt-4 items-center text-sm">
                            <h3>Already have an account? <Link to="/login" className="text-blue-400">Log In</Link></h3>
                        </div>

                        {/* Back Arrow to navigate to RegPage */}
                        <div className="absolute bottom-4 left-4">
                            <FaArrowLeft
                                onClick={() => navigate('/signup/register')}
                                className="cursor-pointer text-2xl text-blue-500 hover:text-blue-700 transition duration-200"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
