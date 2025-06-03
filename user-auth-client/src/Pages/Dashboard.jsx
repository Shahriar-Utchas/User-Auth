import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get('https://user-auth-server-theta.vercel.app/api/auth/verify', { withCredentials: true })
            .then((res) => {
                setUser(res.data.user);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                navigate('/signin');
            });
    }, [navigate]);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Are you sure you want to log out?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, log me out',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        });
        if (result.isConfirmed) {
            try {
                await axios.post('https://user-auth-server-theta.vercel.app//api/auth/logout', {}, { withCredentials: true });
                setUser(null);
                navigate('/');
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex justify-center items-center bg-gray-100">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
                <div className="relative">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        alt="Profile"
                        className="w-10 h-10 rounded-full cursor-pointer"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    />
                    {dropdownOpen && user && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-md shadow-lg z-10 p-4">
                            <p className="font-medium mb-2 text-gray-700">Your Shops:</p>
                            <ul className="space-y-1 mb-4">
                                {user.shops.map((shop, index) => (
                                    <li key={index}>
                                        <Link
                                            to={`/dashboard/${shop.toLowerCase().replace(/\s+/g, '')}`}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            {shop}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main content */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-3xl font-bold text-gray-700 mb-2">
                    Welcome, {user?.username}!
                </h1>
                <p className="text-gray-600">Click on a shop above to visit its dashboard page.</p>
            </div>
        </div>
    );
};

export default Dashboard;
