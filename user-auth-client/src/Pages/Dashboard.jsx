import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAxiosSecure from '../Hooks/useAxiosSecure';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        axiosSecure
            .get('/user')
            .then((res) => {
                setUser(res.data.user);
                setLoading(false);
            })
            .catch((err) => {
                console.error('User fetch failed:', err);
                setLoading(false);
                navigate('/');
            });
    }, [navigate, axiosSecure]);

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
                await axiosSecure.post('/logout');
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
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <div className="relative">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        alt="Profile"
                        className="w-10 h-10 rounded-full cursor-pointer border border-gray-300"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    />
                    {dropdownOpen && user && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-10 p-4">
                            <p className="font-semibold text-gray-700 mb-2">Your Shops</p>
                            <ul className="space-y-2 max-h-40 overflow-y-auto">
                                {user.shops.map((shop, index) => (
                                    <li key={index}>
                                        <Link
                                            to={`/dashboard/${shop}`}
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            {shop}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <hr className="my-3" />
                            <button
                                onClick={handleLogout}
                                className="w-full py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Welcome Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                    Welcome, {user?.username}!
                </h2>
                <p className="text-gray-600">
                    Use the profile dropdown menu to manage your shops.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
