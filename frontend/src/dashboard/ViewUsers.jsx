import { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';

export default function ViewUsers() {

  const [users, setUsers] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/user/get-users');
      const data = await res.json();
      setUsers(data);
    };

    fetchData();
  }, []);

  const handleUserDelete = async (userId) => {
    const result = await Swal.fire({
      title: 'Want to delete?',
      text: "You won't be able to revert this!",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancel!',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/customer/delete-user/${userId}`, {
          method: 'DELETE',
        });
        const data = await res.json();

        if (!res.ok) {
          console.log(data.message);
          return;
        } else {
          setUsers(prev => prev.filter((user) => user.id != userId));
          toast.success('User has been deleted!');
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
        <div className='flex justify-between items-center'>
          <h2 className="text-lg font-semibold text-gray-700 mb-6 uppercase">Manage Users</h2>
          <button onClick={() => navigate('/dashboard?tab=add-user')} className='bg-green-700 hover:bg-green-800 text-white px-4 py-2 text-sm rounded'>Create User</button>
        </div>

        <div className="overflow-x-auto">
            <table className="table-auto w-full text-left bg-white shadow-md rounded-lg border-collapse">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-xs leading-normal">
                    <th className="py-3 px-6">Email</th>
                    <th className="py-3 px-6">Name</th>
                    <th className="py-3 px-6">Admin</th>
                    {currentUser.isAdmin === 1 && (
                        <th className="py-3 px-6 text-center">Action</th>
                    )}
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                    {users.length > 0 ? (
                    users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-6">{user.email}</td>
                        <td className="py-3 px-6">{user.name}</td>
                        <td className="py-3 px-6">{user.isAdmin === 1 ? <span className='text-green-600'>Yes</span> : <span className='text-red-600'>No</span>}</td>
                        {currentUser.isAdmin === 1 && (
                            <td className='space-x-4 text-center'>
                              <button onClick={() => navigate(`/dashboard?tab=edit-user/${user.id}`)} className="text-blue-600 hover:underline">Edit</button>
                              <span className='text-red-600 cursor-pointer hover:underline' onClick={() => handleUserDelete(user.id)}>Delete</span>
                            </td>
                        )}
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="5" className="text-center py-4">
                        No user found
                        </td>
                    </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>

  );
}
