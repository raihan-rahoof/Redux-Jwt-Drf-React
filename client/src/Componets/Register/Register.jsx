import React, { useState } from 'react';
import Layout from '../Layout/Layout';
import { userRegistation } from '../../app/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';

const Register = () => {
    const registrationError = useSelector((state) => state.user.error);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormdata] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        repeatpassword: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        repeatpassword: '',
    });

    const handleInputChange = (e) => {
        setFormdata({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validateForm = () => {
        const { first_name, last_name, email, password, repeatpassword } = formData;
        const newErrors = {};

        if (!validator.isEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!validator.isLength(password, { min: 6 })) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        if (!validator.equals(password, repeatpassword)) {
            newErrors.repeatpassword = 'Passwords do not match';
        }

        if (!validator.isAlpha(first_name)) {
            newErrors.first_name = 'First name should only contain letters';
        }

        if (validator.isEmpty(first_name)) {
            newErrors.first_name = 'First name cannot be empty';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const registerUser = () => {
        if (validateForm()) {
            dispatch(userRegistation(formData))
                .then(() => {
                    navigate('/loginpage');
                });
        }
    };

    return (
        <Layout title='Auth | Login | Register Window' content='Register Window'>
            <div className='flex justify-center items-center h-screen bg-gray-900 text-white'>
                <form className='bg-gray-900 p-8 rounded-lg w-full max-w-md border-2 border-gray-700 rounded-xl' onSubmit={registerUser}>
                    <h2 className='text-2xl font-bold mb-6'>Register</h2>
                    <div className='mb-4'>
                        <label htmlFor='email' className='block text-sm font-semibold mb-2 text-white'>Enter Email Address</label>
                        <input type='text' onChange={handleInputChange} name='email' id='email' className='w-full rounded border border-white/25 py-2 px-3 text-dark focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500' />
                        {errors.email && <p className='text-sm text-red-500 mt-1'>{errors.email}</p>}
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='first_name' className='block text-sm font-semibold mb-2 text-white'>Enter First Name</label>
                        <input type='text' onChange={handleInputChange} name='first_name'  id='first_name' className='w-full rounded border border-white/25 py-2 px-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500' />
                        {errors.first_name && <p className='text-sm text-red-500 mt-1'>{errors.first_name}</p>}
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='last_name' className='block text-sm font-semibold mb-2 text-white'>Enter Last Name</label>
                        <input type='text' onChange={handleInputChange} name='last_name'  id='last_name' className='w-full rounded border border-white/25 py-2 px-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500' />
                        {errors.last_name && <p className='text-sm text-red-500 mt-1'>{errors.last_name}</p>}
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='password' className='block text-sm font-semibold mb-2 text-white'>Enter Password</label>
                        <input type='password' onChange={handleInputChange} name='password'  id='password' className='w-full rounded border border-white/25 py-2 px-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500' />
                        {errors.password && <p className='text-sm text-red-500 mt-1'>{errors.password}</p>}
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='repeatpassword' className='block text-sm font-semibold mb-2 text-white'>Confirm Password</label>
                        <input type='password' onChange={handleInputChange} name='repeatpassword'  id='repeatpassword' className='w-full rounded border border-white/25 py-2 px-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500' />
                        {errors.repeatpassword && <p className='text-sm text-red-500 mt-1'>{errors.repeatpassword}</p>}
                    </div>
                    <div className='flex justify-center'>
                        <button type='submit' className='inline-block px-6 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 focus:outline-none focus:bg-blue-600 mt-2'>Register</button>
                    </div>
                    {registrationError && <p className='text-sm text-red-500 mt-4'>Error: {registrationError}</p>}
                    <div className='text-center mt-4'>
                        <span className='text-gray-400'>Already have an account? <a href='/loginpage' className='text-blue-400 hover:text-blue-200'>Login here</a></span>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default Register;
