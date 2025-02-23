import React from 'react';

function Navbar() {
    const name = ""; // Replace "STEM" with `null` to see the "Sign In" and "Sign Up" links
    const itemCount = 0;

    return (
        <nav className="flex items-center justify-between p-4 bg-white shadow-md">
            {/* Brand Section */}
            <div className="text-xl font-bold text-blue-600">
                <Link to="/" className="hover:text-blue-800">Mebius</Link>
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-4">
                <Link to="/" className="text-gray-600 hover:text-black">Home</Link>
                <Link to="/shop" className="text-gray-600 hover:text-black">Shop</Link>
            </div>

            {/* Right Section (Cart and User Info) */}
            <div className="flex items-center space-x-4">
                <span className="text-gray-600">{itemCount}</span>
                <a href="#" className="text-gray-600 hover:text-black">Cart</a>
                
                {name ? (
                    <span className="text-gray-600">Hi, {name}</span>
                ) : (
                    <>
                        <a href="/signin" className="text-gray-600 hover:text-black">Sign In</a>
                        <a href="/signup" className="text-gray-600 hover:text-black">Sign Up</a>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
