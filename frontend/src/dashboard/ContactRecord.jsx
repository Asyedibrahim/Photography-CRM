import { MdKeyboardArrowLeft } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCopy } from "react-icons/fi";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa6";
import Notes from "../layouts/Notes";
import Tasks from "../layouts/Tasks";
import EditCustomer from "./EditCustomer";
// import Meetings from "../layouts/Meetings";
import { Drawer } from "flowbite-react";
import { FaUserCog } from "react-icons/fa";

export default function ContactRecord() {

  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState("Copy to clipboard");
  const [activeTab, setActiveTab] = useState("notes");
  const [details, setDetails] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Get id from params
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab');
  const id = tab ? tab.split('/')[1] : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/contact/getContact/${id}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          return;
      } else {
          setDetails(data[0]);
      }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, [location.search]);

  const handleCopy = () => {
    navigator.clipboard.writeText(details.email);
    setTooltip("Copied!");
    setTimeout(() => setTooltip("Copy to clipboard"), 2000);
  };

  const handleNotePage = () => {
    setActiveTab("notes");
    setShowModal(true);
  }

  const handleTaskPage = () => {
    setActiveTab("tasks");
    setShowTaskModal(true);
  }

  return (
    <div className='w-full max-h-screen flex'>
      
      {/* Flowbite Drawer for Small Devices */}
      <Drawer placement="left" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} className="lg:hidden">
        <div className="p-2">
          <div className="flex justify-between items-center">
            <p className="flex items-center text-sm text-blue-900 hover:underline font-semibold cursor-pointer" onClick={() => navigate('/dashboard?tab=contact-data')} >
              <MdKeyboardArrowLeft className="text-base" />
              Contacts
            </p>
            {/* Edit Page */}
            <EditCustomer id={id} details={details} setDetails={setDetails} />
          </div>
          {/* Contact Details */}
          <div className="flex flex-col gap-2 justify-center items-center mt-7">
            <p className="w-10 h-10 rounded-full bg-blue-700 flex justify-center items-center text-white">
              {details?.name && details.name.charAt(0).toUpperCase()}
            </p>
            <p className="capitalize">{details.name}</p>
            <div className="flex items-center space-x-2 pr-3">
              <p className="text-blue-950">{details.email}</p>
              <div className="relative group">
                <FiCopy onClick={handleCopy} className="cursor-pointer text-blue-600 hover:text-blue-800 text-lg" />
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-[10px] bg-gray-800 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {tooltip}
                </span>
              </div>
            </div>
            {/* Note Button */}
            <div className="flex justify-between gap-4 my-4">
              <div className="flex flex-col gap-1 items-center cursor-pointer" onClick={handleNotePage}>
                <div className="w-9 h-9 flex justify-center items-center bg-gray-200 rounded-full">
                  <FaRegEdit className="text-sm" />
                </div>
                <p className="text-xs text-gray-900">Note</p>
              </div>
              {/* Task Button */}
              <div className="flex flex-col gap-1 items-center cursor-pointer" onClick={handleTaskPage}>
                <div className="w-9 h-9 flex justify-center items-center bg-gray-200 rounded-full">
                  <FaRegCalendarCheck className="text-sm" />
                </div>
                <p className="text-xs text-gray-900">Task</p>
              </div>
            </div>
          </div>
          <hr />
          {/* About Contact */}
          <div className="p-3 mt-4">
            <p className="font-semibold text-slate-600 mb-3">About this contact</p>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-2">
                <label className="text-xs text-gray-900">Email</label>
                <p className="border-gray-300 text-sm border-b ml-2">{details.email}</p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <label className="text-xs text-gray-900">Phone</label>
                <p className="border-gray-300 text-sm border-b ml-2">{details.phone}</p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <label className="text-xs text-gray-900">Address</label>
                <p className="border-gray-300 text-sm border-b ml-2">{details.address}</p>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      {/* Sidebar for Larger Devices */}
      <div className="hidden lg:block lg:w-2/5 xl:w-1/4 bg-white border-r h-screen overflow-y-auto ml-64">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <p className="flex items-center text-sm text-blue-900 hover:underline font-semibold cursor-pointer" onClick={() => navigate('/dashboard?tab=contact-data')} >
              <MdKeyboardArrowLeft className="text-base" />
              Contacts
            </p>
            {/* Edit Page */}
            <EditCustomer id={id} details={details} setDetails={setDetails} />
          </div>
          {/* Contact Details */}
          <div className="flex flex-col gap-2 justify-center items-center mt-7">
            <p className="w-10 h-10 rounded-full bg-blue-700 flex justify-center items-center text-white">
              {details?.name && details.name.charAt(0).toUpperCase()}
            </p>
            <p className="capitalize">{details.name}</p>
            <div className="flex items-center space-x-2 pr-3">
              <p className="text-blue-950">{details.email}</p>
              <div className="relative group">
                <FiCopy onClick={handleCopy} className="cursor-pointer text-blue-600 hover:text-blue-800 text-lg" />
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-[10px] bg-gray-800 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {tooltip}
                </span>
              </div>
            </div>
            {/* Note, Task */}
            <div className="flex justify-between gap-4 my-4">
              <div className="flex flex-col gap-1 items-center cursor-pointer" onClick={handleNotePage} title="Create Note">
                <div className="w-9 h-9 flex justify-center items-center bg-gray-200 rounded-full">
                  <FaRegEdit className="text-sm"/>
                </div>
                <p className="text-xs text-gray-900">Note</p>
              </div>
              <div className="flex flex-col gap-1 items-center cursor-pointer" onClick={handleTaskPage} title="Create Task">
                <div className="w-9 h-9 flex justify-center items-center bg-gray-200 rounded-full">
                  <FaRegCalendarCheck className="text-sm"/>
                </div>
                <p className="text-xs text-gray-900">Task</p>
              </div>
            </div>
          </div>
          <hr />
          {/* About Contact */}
          <div className="mt-4">
            <p className="font-semibold text-slate-600 mb-3">About this contact</p>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-2">
                <label className="text-xs text-gray-900">Email</label>
                <p className="border-gray-300 text-sm border-b ml-2">{details.email}</p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <label className="text-xs text-gray-900">Phone</label>
                <p className="border-gray-300 text-sm border-b ml-2">{details.phone}</p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <label className="text-xs text-gray-900">Address</label>
                <p className="border-gray-300 text-sm border-b ml-2">{details.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-2/3 bg-gray-100 overflow-y-auto h-full p-6">

        {/* Toggle Drawer Button for Small Devices */}
        <button className="lg:hidden text-white flex items-center gap-1 cursor-pointer" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
          <p className="flex items-center justify-center w-7 h-7 bg-gray-700 rounded-full text-sm">{details?.name && details.name.charAt(0).toUpperCase()}</p>
          <span className="text-black capitalize">{details.name}</span>
          <FaUserCog className="text-black"/>
        </button>

        <p className="text-blue-900 font-semibold mt-5 lg:mt-0">Overviews</p>
        <div className="bg-white shadow-md p-4 rounded-md mt-3">
          <p className="font-semibold text-gray-600">Data highlights</p>
          <div className="flex flex-col sm:flex-row sm:space-x-5 lg:space-x-0 sm:justify-between pt-5 pb-2 gap-5 sm:gap-0">
            <div className="text-center sm:flex-1">
              <p className="text-xs uppercase text-blue-950 font-semibold">Create date</p>
              <p className="text-sm text-gray-600">
                {details.created_at && new Date(details.created_at).toUTCString('en-GB')}
              </p>
            </div>
            <div className="flex sm:flex-1 sm:space-x-5 justify-center gap-16 sm:gap-0">
              <div className="text-center sm:flex-1">
                <p className="text-xs uppercase text-blue-950 font-semibold">Lifecycle Stage</p>
                <p className="text-sm capitalize text-gray-600">{details.stage}</p>
              </div>
              <div className="text-center sm:flex-1">
                <p className="text-xs uppercase text-blue-950 font-semibold">Lifecycle Status</p>
                <p className="text-sm capitalize text-gray-600">{details.status}</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="space-x-9 mt-5 border-b border-gray-300">
          <button className={`px-4 py-2 ${ activeTab === "notes" ? "border-b-2 border-blue-700 text-blue-700" : "" }`} onClick={() => setActiveTab("notes")}>Notes</button>
          <button className={`px-4 py-2 ${ activeTab === "tasks" ? "border-b-2 border-blue-700 text-blue-700" : "" }`} onClick={() => setActiveTab("tasks")}>Tasks</button>
        </nav>
        <div className="mt-5">
          {activeTab === "notes" && ( <Notes id={id} name={details.name} showModal={showModal} setShowModal={setShowModal} /> )}
          {activeTab === "tasks" && ( <Tasks id={id} name={details.name} showTaskModal={showTaskModal} setShowTaskModal={setShowTaskModal} /> )}
        </div>
      </div>

    </div>
  )
}
