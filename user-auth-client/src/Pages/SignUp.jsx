import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const SignUp = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        shops: ['', '', ''],
    });

    const [errors, setErrors] = useState({
        username: '',
        password: {
            length: true,
            number: true,
            specialChar: true,
        },
        shops: [],
        global: '',
    });

    const [loading, setLoading] = useState(false);

    const validatePassword = (password) => {
        return {
            length: password.length >= 8,
            number: /\d/.test(password),
            specialChar: /[!@#$%^&*]/.test(password),
        };
    };

    const hasDuplicates = (arr) => new Set(arr.map(s => s.trim().toLowerCase())).size !== arr.length;

    const handleChange = (e, index = null) => {
        const { name, value } = e.target;

        if (name === 'shops') {
            const updatedShops = [...formData.shops];
            updatedShops[index] = value;
            setFormData((prev) => ({ ...prev, shops: updatedShops }));

            const updatedErrors = [...errors.shops];
            updatedErrors[index] = value.trim() === '' ? 'This field is required' : '';
            setErrors((prev) => ({ ...prev, shops: updatedErrors }));
        } else if (name === 'password') {
            setFormData((prev) => ({ ...prev, [name]: value }));
            const validation = validatePassword(value);
            setErrors((prev) => ({ ...prev, password: validation }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const addMoreShops = () => {
        setFormData((prev) => ({ ...prev, shops: [...prev.shops, ''] }));
        setErrors((prev) => ({ ...prev, shops: [...prev.shops, ''] }));
    };

    const removeShop = (index) => {
        if (formData.shops.length <= 3) return;

        const updatedShops = formData.shops.filter((_, i) => i !== index);
        const updatedErrors = errors.shops.filter((_, i) => i !== index);

        setFormData((prev) => ({ ...prev, shops: updatedShops }));
        setErrors((prev) => ({ ...prev, shops: updatedErrors }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const shopErrors = formData.shops.map((shop) =>
            shop.trim() === '' ? 'This field is required' : ''
        );
        const validShops = formData.shops.filter((s) => s.trim() !== '');

        if (validShops.length < 3) {
            setErrors((prev) => ({
                ...prev,
                global: 'Please enter at least 3 shop names.',
                shops: shopErrors,
            }));
            return;
        }

        const passwordValid = validatePassword(formData.password);
        if (!passwordValid.length || !passwordValid.number || !passwordValid.specialChar) {
            setErrors((prev) => ({
                ...prev,
                password: passwordValid,
            }));
            return;
        }

        if (hasDuplicates(validShops)) {
            setErrors((prev) => ({
                ...prev,
                global: 'Shop names must be unique.',
            }));
            return;
        }

        setLoading(true);
        setErrors((prev) => ({ ...prev, global: '' }));

        try {
            await axios.post('http://localhost:3000/api/auth/signup', {
                username: formData.username,
                password: formData.password,
                shops: validShops,
            });
            Swal.fire({
                icon: 'success',
                title: 'Signup Successful',
                text: 'You can now log in to your account.',
                confirmButtonColor: '#3085d6',
            }).then(() => {
                navigate('/');
            });
        } catch (err) {
            setErrors((prev) => ({
                ...prev,
                global: err.response?.data?.message || 'Signup failed.',
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">Sign Up</h2>

                {errors.global && <p className="text-red-500 text-center mb-4">{errors.global}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username */}
                    <div>
                        <label className="block mb-1 text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter a unique username"
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-1 text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Min 8 chars, 1 number & special char"
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {/* Password Error Messages */}
                        {!errors.password.length && (
                            <p className="text-red-500 text-sm mt-1">At least 8 characters required</p>
                        )}
                        {!errors.password.number && (
                            <p className="text-red-500 text-sm mt-1">At least one number required</p>
                        )}
                        {!errors.password.specialChar && (
                            <p className="text-red-500 text-sm mt-1">At least one special character required</p>
                        )}
                    </div>

                    {/* Shops */}
                    <div>
                        <label className="block mb-1 text-gray-700">Shop Names</label>
                        {formData.shops.map((shop, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <input
                                    type="text"
                                    name="shops"
                                    value={shop}
                                    onChange={(e) => handleChange(e, index)}
                                    placeholder={`Shop ${index + 1}`}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                                {index >= 3 && (
                                    <button
                                        type="button"
                                        onClick={() => removeShop(index)}
                                        className="ml-2 text-red-600 hover:text-red-800"
                                        title="Remove shop"
                                    >
                                        ❌
                                    </button>
                                )}
                            </div>
                        ))}
                        {errors.shops.map((err, index) =>
                            err ? (
                                <p key={index} className="text-red-500 text-sm -mt-1 mb-2">
                                    {err}
                                </p>
                            ) : null
                        )}
                        <button
                            type="button"
                            onClick={addMoreShops}
                            className="text-blue-600 hover:underline text-sm mt-1"
                        >
                            + Add more shops
                        </button>
                    </div>


                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-300"
                    >
                        {loading ? 'Registering...' : 'Sign Up'}
                    </button>
                </form>

                {/* Sign In Link */}
                <div className="mt-4 text-center">
                    <span className="text-gray-600">Don't have an account? </span>
                    <Link to="/" className="text-blue-600 hover:underline font-medium">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
