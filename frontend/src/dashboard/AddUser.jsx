import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function AddUser() {

    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.password !== formData.confirm_password) {
                setError("Passwords doesn't match");
                return;    
            } else {
                setError('');
            }

            const { confirm_password, ...rest } = formData;

            const res = await fetch('/api/user/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(rest)
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message);
                return;
            } else {
                navigate('/dashboard?tab=users', {replace: true});
                toast.success('User has been created!');
            }
            
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="w-full bg-gray-100 p-4 md:px-8 md:py-3">
            <div className='p-4 sm:p-8 bg-white shadow-md'>
                <h2 className="text-lg font-semibold text-gray-700 mb-4 uppercase">Create Users</h2>
                <form onSubmit={handleSubmit} className='max-w-xl'>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Email</label>
                        <input type="email" name='email' onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder='Please Enter Email Id' required/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Name</label>
                        <input type="name" name='name' onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder='Please Enter Name' required/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Password</label>
                        <input type="password" name='password' onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder='Please Enter Password' required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Confirm Password</label>
                        <input type="password" name='confirm_password' onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder='Please Confirm Your Password' required />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button type="submit" className="px-6 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200" >
                        Submit and Create User
                    </button>
                </form>
            </div>
        </div>
    );
}