import React, { useState } from 'react';
import Layout from '../Layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../../app/user/userSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const check = useSelector((state) => state.user);

  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const loginpage = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const login = async () => {
    if (!user.email || !user.password) {
      setErrors({ ...errors, email: 'Email and password are required' });
      return; 
    }

    try {
      const decodedToken = await dispatch(userLogin(user));

      if (!decodedToken.payload.is_admin && decodedToken.payload.is_active) {
        navigate('/');
      }
      else if (decodedToken.payload.is_admin == true) {
        setErrors({ ...errors, email: 'Only users are allowed to log in.' });
      }
      else if(decodedToken.payload.is_active == false) {
        setErrors({ ...errors, email: 'Your account is blocked.' });
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
      <Layout title='Auth | Login | Login Dashboard' content='Login Dashboard page'>
        <div className='flex justify-center items-center h-screen bg-gray-900 text-white'>
          <div className='bg-gray-900 p-8 rounded-lg w-full max-w-md border border-gray-700'>
            <h2 className='text-2xl font-bold mb-6'>Login</h2>
            <div className={`mb-4 ${errors.email && 'error'}`}>
              <label htmlFor='email' className='block text-sm text-white font-semibold mb-2'>Email</label>
              <input
                onChange={loginpage}
                type='email'
                name='email'
                placeholder='Enter email'
                id='email'
                className='w-full rounded border border-white/25 py-2 px-3 text-black focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              />
              {errors.email && <p className='text-sm text-red-500 mt-1'>{errors.email}</p>}
            </div>
            <div className='mb-4'>
              <label htmlFor='password' className='block text-white text-sm font-semibold mb-2'>Password</label>
              <input
                onChange={loginpage}
                placeholder='Enter the password'
                type='password'
                name='password'
                id='Password'
                className='w-full rounded border border-white/25 py-2 px-3 text-black focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              />
            </div>
            <div className='flex justify-center'>
              <button type='submit' onClick={login} className='inline-block px-6 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 focus:outline-none focus:bg-blue-600'>Login</button>
            </div>
            {errors.email && <p className='text-sm text-red-500 mt-4'>{errors.email}</p>}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Login;
