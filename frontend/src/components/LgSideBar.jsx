import { Sidebar } from 'flowbite-react';
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { signOutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { MdDashboard, MdDataSaverOff, MdLogout } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";

export default function LgSideBar() {

    const location = useLocation();
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if ( tabFromUrl ) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    const handleLogout = async () => {
      try {
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: 'You will be logged out of your account!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Log out!',
          cancelButtonText: 'Cancel!'
        });
        if (result.isConfirmed) {
          const res = await fetch('/api/user/sign-out',{
            method: 'POST'
          });
          const data = await res.json();
          if (res.ok) {
            toast.success('Logged out successfully!', { theme: 'colored' });
            dispatch(signOutSuccess(data));
          } else {
            toast.error(data.message);
          }
        }
      } catch (error) {
          toast.error(error.message);
      }
    };

  return (
    <div className="w-full md:w-[16rem] pb-2 bg-[#2C3E50] shadow-md h-screen">
        <div className="flex items-center justify-center py-5">
          <h1 className='text-white text-2xl font-semibold font-serif px-2'>Elite Photography</h1>
        </div>
      <div className="flex flex-col gap-3 px-3">
        
        <Link to="/dashboard?tab=contact-data">
          <div className={`px-2 py-2 flex items-center rounded-md gap-2 cursor-pointer text-white transition-all duration-200 ease-linear ${tab === 'contact-data' || tab === '' || tab.startsWith('record') ? 'bg-white bg-opacity-20 ' : 'hover:bg-white hover:bg-opacity-20'}`}>
            <MdDataSaverOff className="inline-block" />
            Contacts Data
          </div>
        </Link>

        {/* {currentUser.isAdmin === 1 && (
          <Link to="/dashboard?tab=users">
            <div className={`px-2 py-2 flex items-center rounded-md gap-2 cursor-pointer text-white transition-all duration-200 ease-linear ${tab === 'users' ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-20'}`} >
              <FaUserEdit className="inline-block" />
              Manage Users
            </div>
          </Link>
        )} */}

        <div className="px-2 py-2 cursor-pointer text-white rounded-md flex items-center gap-2 hover:bg-white hover:bg-opacity-20 transition-all duration-200 ease-linear" onClick={handleLogout}>
          <MdLogout className="inline-block" />
          Log out
        </div>
      </div>
    </div>
  )
}