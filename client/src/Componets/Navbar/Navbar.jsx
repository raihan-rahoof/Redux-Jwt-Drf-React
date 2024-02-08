import React from 'react';
// import './Navbar.css';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../app/user/userSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('jwtTokenadmin');
        dispatch(logout());
    };

    return (
        <div className='nav bg-gray-800 p-4'>
            <div className='navbar flex justify-between items-center'>
                <div className='text-white text-2xl font-bold'>Auth System</div>
                <div className='flex space-x-4'>
                    {user.superuser ? (
                        <>
                            <NavLink className='bg-blue-500 text-white px-4 py-2 rounded-full transition duration-300 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300' to="/admindashboard">Admin Dashboard</NavLink>
                            <NavLink onClick={handleLogout} className='bg-blue-500 text-white px-4 py-2 rounded-full transition duration-300 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300' to="/admin">Admin Logout</NavLink>
                        </>
                    ) : user.user ? (
                        <>
                            <NavLink className='bg-blue-500 text-white px-4 py-2 rounded-full transition duration-300 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300' to="/userpage">Profile</NavLink>
                            <NavLink onClick={handleLogout} className='bg-blue-500 text-white px-4 py-2 rounded-full transition duration-300 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300' to="/">Logout</NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink className='bg-blue-500 text-white px-4 py-2 rounded-full transition duration-300 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300' to="/loginpage">Login</NavLink>
                            <NavLink className='bg-blue-500 text-white px-4 py-2 rounded-full transition duration-300 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300' to="/registerpage">Register</NavLink>
                            <NavLink className='bg-blue-500 text-white px-4 py-2 rounded-full transition duration-300 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300' to="/admin">Admin Login</NavLink>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
