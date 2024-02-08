import React, { useEffect, useState } from 'react';
import Layout from '../Layout/Layout';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../app/user/userApi';
import { updateSuperUser } from '../../app/user/userSlice';

const AdminDashBord = () => {
    const [userData, setUserData] = useState(null);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const tokenAdmin = localStorage.getItem('jwtToken');
    const [isLoading, setIsLoading] = useState(true);
    let decodedAdminToken;
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState('');

    if (tokenAdmin) {
        decodedAdminToken = jwtDecode(tokenAdmin);
    }

    useEffect(() => {
        if (!tokenAdmin) {
            navigate('/admindashboard');
        } else {
            adminUserDetails();
            getUserlist();
        }
    }, [tokenAdmin]);

    useEffect(() => {
        if (!user.superuser && !isLoading) {
            setTimeout(() => navigate('/admin'));
        }
    }, [user.superuser, isLoading]);

    async function adminUserDetails() {
        try {
            const response = await axios.get(`${BASE_URL}/users/user-detail/${decodedAdminToken.user_id}/`, { is_active: false });
            dispatch(updateSuperUser(response.data));
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function getUserlist() {
        const request = await axios.get(`${BASE_URL}/users/user-list/`);
        setUsers(request.data);
    }

    async function getData() {
        const request = await axios.get(`${BASE_URL}/users/user-list/?search=${searchTerm}`);
        setUsers(request.data);
    }

    async function blockOrUnblockUser(id, currentStatus) {
        try {
            const newStatus = !currentStatus;
            const response = await axios.patch(`${BASE_URL}/users/user-detail/${id}/`, { is_active: newStatus });
            dispatch(updateSuperUser(response.data));
            setUsers(prevUsers => prevUsers.map(user => (user.id === id ? { ...user, is_active: newStatus } : user)));
        } catch (error) {
            console.error("Error blocking/unblocking user:", error);
        }
    }

    return (
        <>
            <Layout>
                
                {user.superuser ? (
                    <div className='bg-gray-900 text-white min-h-screen p-4'>
                        <h2 className='text-2xl font-bold mb-6'>Admin Dashboard</h2>
                        <div className='mb-4'>
                            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type='text' placeholder='Search' className='bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-1 focus:outline-none' />
                            <button onClick={getData} className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg ml-2 focus:outline-none'>Search</button>
                        </div>
                        <div className='overflow-x-auto'>
                            <table className='table-auto w-full'>
                                <thead>
                                    <tr>
                                        <th className='px-4 py-2'>No</th>
                                        <th className='px-4 py-2'>Image</th>
                                        <th className='px-4 py-2'>FirstName</th>
                                        <th className='px-4 py-2'>LastName</th>
                                        <th className='px-4 py-2'>Email</th>
                                        <th className='px-4 py-2'>Status</th>
                                        <th className='px-4 py-2'>Change Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) => (
                                        <tr key={user.id} className='border-t'>
                                            <td className='border px-4 py-2'>{index + 1}</td>
                                            <td className='border px-4 py-2'><img src='' alt='NO PROFILE PIC' /></td>
                                            <td className='border px-4 py-2'>{user.first_name}</td>
                                            <td className='border px-4 py-2'>{user.last_name}</td>
                                            <td className='border px-4 py-2'>{user.email}</td>
                                            <td className='border px-4 py-2'>{user.is_active ? 'Active' : 'Inactive'}</td>
                                            <td className='border px-4 py-2'>
                                                <button onClick={() => blockOrUnblockUser(user.id, user.is_active)} className={`rounded-lg px-4 py-1 ${user.is_active ? 'bg-red-500' : 'bg-green-500'} text-white hover:bg-opacity-80 focus:outline-none`}>
                                                    {user.is_active ? 'Block' : 'Unblock'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <p className='errorfornotlogin'>You're not logged in. Please login first.</p>
                )}
            </Layout>
        </>
    );
};

export default AdminDashBord;
