import { Checkbox, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice.js'

export default function SignIn() {

  const [ formData, setFormData ] = useState({});
  const navigate =  useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/user/sign-in', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
      })

      const data = await res.json();

      if (!res.ok) {
        dispatch(signInFailure(data.message));
        toast.error(data.message);
        return;
      } else {
        dispatch(signInSuccess(data));
        toast.success('Logged in successfully!');
        navigate('/dashboard?tab=contact-data', { replace: true });
      };

    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error(error.message);
    }
  };

  const handleShow = () => {
    const show = document.getElementById('password');
    if (show.type === 'password') {
      show.type = 'text' ;
    } else {
      show.type = 'password' ;
    }
  };

  return (
    <div className='bg-[#2C3E50] h-screen'>
      <div className="flex flex-col justify-center items-center h-full">
        <form className="flex max-w-md flex-col gap-4 w-full sm:bg-white  sm:shadow-md p-5 rounded-md" onSubmit={handleSubmit}>
          <h2 className='text-3xl font-bold text-white sm:text-slate-700'>Elite Photography</h2>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Your email" className="text-white sm:text-blue-950"/>
            </div>
            <TextInput onChange={handleChange} id="email" type="email" placeholder="company@gmail.com" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Your password" className="text-white sm:text-blue-950"/>
            </div>
            <TextInput onChange={handleChange} id="password" type="password" required placeholder='**********'/>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="show" onClick={handleShow}/>
            <Label htmlFor="show" className="text-white sm:text-blue-950">Show password</Label>
          </div>
          <button type="submit" className="bg-[#BDC3C7] hover:bg-[#abb1b4] py-2 rounded-md transition-colors duration-100 sm:bg-[#2C3E50] sm:text-white sm:hover:bg-[#2e4153] disabled:!bg-[#606d7a]" disabled={loading}>
            {loading ? (
              <>
                <Spinner size='sm'/>
                <span className='pl-3'>Signing in...</span>
              </> 
              ) : 'Login'
            }
          </button>
        </form>
      </div>
    </div>
  )
}