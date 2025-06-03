import React from 'react';
import { Link, useParams } from 'react-router';

const ShopPage = () => {
    const { shopName } = useParams();

    return (
        <div className="h-screen flex flex-col gap-4 justify-center items-center bg-gray-100">
            <h1 className="text-3xl font-semibold text-gray-800">
                This is <span className="text-blue-600">{shopName}</span> shop
            </h1>
            <button>
                <Link to="/dashboard" className="ml-4 text-blue-600 hover:underline">
                    Go back to Dashboard
                </Link>
            </button>
        </div>
    );
};

export default ShopPage;
