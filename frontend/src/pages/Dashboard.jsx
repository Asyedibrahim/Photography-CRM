import LgSideBar from '../components/LgSideBar';
import SmSideBar from '../components/SmSideBar';
import CusData from '../dashboard/CusData';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ViewUsers from '../dashboard/ViewUsers';
import AddUser from '../dashboard/AddUser';
import EditUser from '../dashboard/EditUser';
import ContactRecord from '../dashboard/ContactRecord';

export default function Dashboard() {

  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');

    if (tabFromUrl) {
      setTab(tabFromUrl)
    } else {
      setTab('contact-data')
    };

  }, [location.search]);

  return (
    <div className='flex flex-col lg:flex-row min-h-screen'>

      {/* SideBar large device */}
      <div className='lg:w-64 hidden lg:inline fixed h-full'>
        <LgSideBar />
      </div>

      {/* SideBar small device */}
      <div className="lg:hidden">
        <SmSideBar />
      </div>

      {/* Contact Data... */}
      {tab === 'contact-data' && <CusData />}
      {/* Edit User... */}
      {tab.startsWith('record') && <ContactRecord />}
      {/* User Data... */}
      {tab === 'users' && <ViewUsers />}
      {/* Add User... */}
      {tab === 'add-user' && <AddUser />}
      {/* Edit User... */}
      {tab.startsWith('edit-user') && <EditUser />}

    </div>
  )
}
