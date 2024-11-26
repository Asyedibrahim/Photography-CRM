import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function EditUser() {

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        confirm_password: '',
        isAdmin: false, 
    });
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    // Get id from params
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const id = tab ? tab.split('/')[1] : null;
  
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`/api/user/get-user/${id}`);
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setFormData(data);
            }
        }
        fetchData();
    }, []);
  

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'isAdmin' && checked) {
            Swal.fire({
                title: 'Are you sure?',
                text: "Do you want to make this user an admin?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Yes, make admin!',
                cancelButtonText: 'No, cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                    setFormData({
                        ...formData,
                        [name]: checked,
                    });
                    toast.success('User has been made an admin!');
                } else {
                    // If user cancels, uncheck the checkbox
                    e.target.checked = false;
                    setFormData({
                        ...formData,
                        [name]: false,
                    });
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.password !== formData.confirm_password) {
                setError('Passwords do not match');
                return;
            } else {
                setError('');
            }

            const { confirm_password, ...rest } = formData;

            const res = await fetch(`/api/user/edit-user/${id}`, {
                method: 'PUT',
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
                toast.success('User has been updated!');
            }
            
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="w-full bg-gray-100 p-4 md:px-8 md:py-3">
            <div className="p-4 sm:p-8 bg-white shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 uppercase">Edit User</h2>
                <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Email</label>
                        <input type="email" name="email" onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Please Enter Email Id" value={formData.email || ''} required />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Name</label>
                        <input type="name" name="name" onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Please Enter Name" value={formData.name || ''} required />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">Password</label>
                        <input type="password" name="password" onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Please Enter Password" value={formData.password || ''} />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
                        <input type="password" name="confirm_password" onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Please Confirm Your Password" value={formData.confirm_password || ''} />
                    </div>

                    <div className="mb-4 flex items-center">
                        <label className="text-gray-700 font-semibold">Make as Admin</label>
                        <input type="checkbox" name="isAdmin" onChange={handleFormChange} className="ml-2" checked={formData.isAdmin} />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <button type="submit" className="px-6 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"> 
                        Submit and Update User
                    </button>
                </form>
            </div>
        </div>
    );
}