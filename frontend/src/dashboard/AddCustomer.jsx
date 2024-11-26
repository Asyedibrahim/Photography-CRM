import { useState } from 'react';
import { Label, Select, Textarea, TextInput } from 'flowbite-react';
import toast from 'react-hot-toast';

export default function AddCustomer({ contacts, setContacts }) {

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    stage: '',
    status: '',
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const isFormValid = Object.values(formData).every((value) => value.trim() !== '');
      if (!isFormValid) {
        toast.error('All customer fields are required!');
        return;
      }

      const res = await fetch('/api/contact/add-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      } else {
        toast.success('Contact added successfully!');
        setContacts(prev => [...prev, data.contact]);
        setFormData({ name: '', phone: '', email: '', address: '', stage: '', status: ''});
        setIsSidebarOpen(false);
      }
    } catch (error) {
      toast.error(error.message);
    };
  };

  return (
    <div className="relative">
      <button onClick={() => setIsSidebarOpen(true)} className='py-2 px-4 rounded-md text-xs bg-[#2C3E50] text-white hover:bg-[#2e4153]'>
        Create Contact
      </button>

      <div className={`fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-xl transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
        
        <div className="bg-[#2C3E50] p-4 sticky top-0">
          <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-white">Create Contact</h2>
        </div>

        <div className='overflow-y-auto h-[calc(100%-64px)] p-6'>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Details */}
            <div>
              <Label>Full Name</Label>
              <TextInput type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter contact name" className="mt-1" />
            </div>
            <div>
              <Label>Phone</Label>
              <TextInput type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" className="mt-1" />
            </div>
            <div>
              <Label>Email</Label>
              <TextInput type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" className="mt-1" />
            </div>
            {/* Address Fields */}
            <div>
              <Label>Address</Label>
              <Textarea type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter Address" className="mt-1" />
            </div>
            {/* Lifecycle */}
            <div>
              <Label>Lifecycle Stage</Label>
              <Select name="stage" id="stage" className='mt-1' onChange={handleChange}>
                <option value="">Select a Stage</option>
                <option value="lead">Lead</option>
                <option value="customer">Customer</option>
              </Select>
            </div>
            <div>
              <Label>Lead Status</Label>
              <Select name="status" id="status" className='mt-1' onChange={handleChange}>
                <option value="">Select a Status</option>
                <option value="new">New</option>
                <option value="process">In process</option>
                <option value="connected">Connected</option>
              </Select>
            </div>
            {/* Submit Button */}
            <div className="pt-3 flex gap-3 items-center">
              <button type="submit" className='py-3 px-4 rounded-md text-sm bg-green-700 text-white hover:bg-green-800 disabled:!bg-green-500 border border-green-700'>
                Create Contact
              </button>
              <button type="button" onClick={() => setIsSidebarOpen(false)} className='py-3 px-4 rounded-md text-sm border border-[#2c3e50] hover:bg-[#2C3E50] hover:text-white disabled:!bg-[#606d7a] transition-colors duration-150'>
                Cancel
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
