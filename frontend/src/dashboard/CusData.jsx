import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import AddCustomer from './AddCustomer';

export default function CusData() {

  const [contacts, setContacts] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/contact/get-contacts');
      const data = await res.json();
      setContacts(data);
    };

    fetchData();
  }, []);

  const handleContactDelete = async (cusId) => {
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
        const res = await fetch(`/api/contact/delete-contact/${cusId}`, {
          method: 'DELETE',
        });
        const data = await res.json();

        if (!res.ok) {
          console.log(data.message);
          return;
        } else {
          setContacts(prev => prev.filter((contact) => contact.id != cusId));
          toast.success('Contacts has been deleted!');
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="container mx-auto p-5 lg:ml-64">
      <div className='mb-6 flex justify-between items-center'>
        <h2 className="text-2xl font-semibold text-blue-900">Contacts</h2>
        <AddCustomer contacts={contacts} setContacts={setContacts} />
      </div>

      <div className="!overflow-x-auto">
        <table className="table-auto w-full text-left bg-white shadow-md rounded-lg border-collapse border-b border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-900 uppercase leading-normal font-semibold border-b border-gray-300 text-sm">
              <th className="py-3 px-2 sm:px-4 border-gray-300">Name</th>
              <th className="py-3 px-2 sm:px-4 border-gray-300">Phone</th>
              <th className="py-3 px-2 sm:px-4 border-gray-300">Email</th>
              <th className="py-3 px-2 sm:px-4 border-gray-300">Address</th>
              <th className="py-3 px-2 sm:px-4 border-gray-300">Stage</th>
              <th className="py-3 px-2 sm:px-4 border-gray-300">Status</th>
              {currentUser.isAdmin === 1 && (
                <th className="py-3 px-2 sm:px-4 border-gray-300 text-center">Action</th>
              )}
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-100 border-b border-gray-300 text-sm">
                  <td className="py-3 px-2 sm:px-4 flex items-center cursor-pointer whitespace-nowrap" onClick={() => navigate(`/dashboard?tab=record/${contact.id}`)}>
                    <div
                      className="w-8 h-8 flex items-center justify-center rounded-full text-white mr-3 bg-blue-600"
                      // Random color style={{ backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}` }}
                    >
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hover:underline capitalize">{contact.name}</span>
                  </td>
                  <td className="py-3 px-2 sm:px-4 border-b border-gray-300">{contact.phone}</td>
                  <td className="py-3 px-2 sm:px-4 border-b border-gray-300">{contact.email}</td>
                  <td className="py-3 px-2 sm:px-4 border-b border-gray-300 truncate max-w-[160px]">{contact.address}</td>
                  <td className="py-3 px-2 sm:px-4 border-b border-gray-300">{contact.stage}</td>
                  <td className="py-3 px-2 sm:px-4 border-b border-gray-300">{contact.status}</td>
                  {currentUser.isAdmin === 1 && (
                    <td className="py-3 px-2 sm:px-4 space-x-4 text-center">
                      <span
                        className="text-red-600 cursor-pointer hover:underline"
                        onClick={() => handleContactDelete(contact.id)}
                      >
                        Delete
                      </span>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No contacts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
