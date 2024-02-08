import React, { useState } from 'react';
import Layout from '../Layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { superUserLogin } from '../../app/user/userSlice';

const Admin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const check = useSelector((state) => state.user);

    const [adminUser, setAdminUser] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const loginpage = (e) => {
        setAdminUser({ ...adminUser, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const adminLogin = async () => {
        if (!adminUser.email || !adminUser.password) {
            setErrors({ ...errors, email: 'Email and password are required' });
            return;
        }

        try {
            const decodedToken = await dispatch(superUserLogin(adminUser));

            if (decodedToken.payload.is_admin) {
                navigate('/admindashboard');
            }
            else {
                setErrors({ ...errors, email: 'Only admins are allowed to log in.' });
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response && error.message === "Request failed with status code 401") {
                setErrors({ ...errors, email: 'Invalid email or password. Please try again.' });
            } else {
                setErrors({ ...errors, email: 'An error occurred. Please try again.' });
            }
        }
    };

    return (
        <>
            <Layout>
                <div className='flex justify-center items-center h-screen bg-gray-900 text-white'>
                    <div className='bg-gray-900 p-8 rounded-lg w-full max-w-md border border-gray-700'>
                        <div>
                            <h2 className='text-2xl font-bold mb-6'>Admin Login</h2>
                        </div>
                        <div className='errmessage'>
                            {/* <p>{err}</p> */}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className='block text-sm  font-semibold mb-2 text-white'>Email</label>
                            <input onChange={loginpage} type="email" name="email" placeholder='Enter The email' id="email" className='w-full rounded text-black border border-white/25 py-2 px-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500' />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className='block text-sm font-semibold mb-2 text-white'>Password</label>
                            <input onChange={loginpage} placeholder='Enter the password' type="password" name="password" id="Password" className='w-full rounded text-black border border-white/25 py-2 px-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500' />
                        </div>
                        <div>
                            <button onClick={adminLogin} type='button' className='mt-2 inline-block px-6 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 focus:outline-none focus:bg-blue-600'>Login</button>
                        </div>
                        {errors.email && <p className='text-sm text-red-500 mt-4'>{errors.email}</p>}
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Admin;
