import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
// import { Eye, EyeOff } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [admin, setAdmin] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('Seller');

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        // Combine first and last name
        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
        setName(fullName);

        // Set admin based on role
        setAdmin(role.toLowerCase() === 'admin');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post(process.env.REACT_APP_API_URL+'/api/authentication/signup', {
                name: fullName,
                email,
                password,
                admin: role.toLowerCase() === 'admin',
                confirmPassword
            });
            alert(response.data.message);
            navigate('/');
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
            <div className="w-full max-w-md">
                {/* Avatar placeholder */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                </div>

                {/* Main card */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <h1 className="text-xl font-semibold mb-2">Create an account</h1>
                    <p className="text-sm text-gray-600 mb-6">
                        Already have an account? <Link to="/" className="text-blue-600 hover:underline">Log in</Link>
                    </p>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    First name
                                </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Last name
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Email address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Confirm your password
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="text-xs text-gray-600">
                            Use 8 or more characters with a mix of letters, numbers & symbols
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="showPassword"
                                checked={showPassword}
                                onChange={(e) => setShowPassword(e.target.checked)}
                                className="rounded border-gray-300"
                            />
                            <label htmlFor="showPassword" className="text-sm text-gray-600">
                                Show password
                            </label>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                        >
                            Create an account
                        </button>
                    </form>
                </div>
                {/* Footer */}
                <div className="w-full h-px bg-gray-200 my-8"></div>

                <div className="mt-8 flex justify-center items-center space-x-6 text-sm text-gray-500">
                <a href="#" className="hover:text-gray-700">Help Center</a>
                <a href="#" className="hover:text-gray-700">Terms of Service</a>
                <a href="#" className="hover:text-gray-700">Privacy Policy</a>
                </div>
            
            </div>
        </div>
    );
};

export default Signup;






