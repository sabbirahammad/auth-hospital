import React, { useContext, useState } from 'react';
import assets3 from '../assets/assets_frontend/logo.svg';
import assets2 from '../assets/assets_frontend/dropdown_icon.svg';
import { assets } from '../assets/assets_frontend/assets';

import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navber = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const {token,settoken}=useContext(AppContext)

  const logout=()=>{
    settoken(false)
    localStorage.removeItem('token')
  }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-9 border-b border-b-gray-400'>
      {/* Logo */}
      {/* <img onClick={() => navigate('/')} className='w-32 cursor-pointer' src={assets3} alt='' /> */}
      <h1 onClick={()=>navigate('/')}>LOREM</h1>

      {/* Desktop Links */}
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/' className="hover:text-primary">
          <li className='py-1'>HOME</li>
        </NavLink>
        <NavLink to='/doctors' className="hover:text-primary">
          <li className='py-1'>ALL DOCTOR</li>
        </NavLink>
        <NavLink to='/about' className="hover:text-primary">
          <li className='py-1'>ABOUT</li>
        </NavLink>
        <NavLink to='/contact' className="hover:text-primary">
          <li className='py-1'>CONTACT</li>
        </NavLink>
      </ul>

      {/* User Profile & Mobile Menu Icon */}
      <div className='flex items-center gap-4'>
        {token ? (
          <div className='flex items-center gap-2 cursor-pointer group relative'>
            <img className='w-8 rounded-full' src={assets.group_profiles} alt='' />
            <img className='w-2.5' src={assets2} alt='' />
            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                <p onClick={() => navigate("/my-profile")} className='hover:text-black cursor-pointer'>My Profile</p>
                <p onClick={() => navigate("/my-appointment")} className='hover:text-black cursor-pointer'>My Appointment</p>
                <p onClick={logout} className='hover:text-black cursor-pointer'>Login</p>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate("/login")} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>
            Create account
          </button>
        )}

        {/* Mobile Menu Icon */}
        <img onClick={() => setShow(true)} className='w-6 md:hidden cursor-pointer' src={assets.menu_icon} alt='menu icon' />
      </div>

      {/* Mobile Sidebar Menu */}
      {show && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-end md:hidden'>
          <div className='bg-white w-3/4 h-full p-6 shadow-lg'>
            <div className='flex items-center justify-between mb-8'>
              <img src={assets3} alt='Logo' className='w-32' />
              <img onClick={() => setShow(false)} src={assets.cross_icon} alt='Close menu' className='w-6 cursor-pointer' />
            </div>
            <ul className='flex flex-col gap-6 text-lg'>
              <NavLink to='/' onClick={() => setShow(false)} className='hover:text-primary'>
                HOME
              </NavLink>
              <NavLink to='/doctors' onClick={() => setShow(false)} className='hover:text-primary'>
                ALL DOCTOR
              </NavLink>
              <NavLink to='/about' onClick={() => setShow(false)} className='hover:text-primary'>
                ABOUT
              </NavLink>
              <NavLink to='/contact' onClick={() => setShow(false)} className='hover:text-primary'>
                CONTACT
              </NavLink>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navber;
