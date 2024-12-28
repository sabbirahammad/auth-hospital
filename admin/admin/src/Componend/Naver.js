import React, { useContext} from 'react';
import { assets } from '../assets/assets_admin/assets';
import { AdminContext } from '../context/Admincontext';
import { useNavigate } from 'react-router-dom';

const Naver = () => {

  const { atoken, setAtoken } = useContext(AdminContext);
  const navigate = useNavigate();

  const logout = () => {
    navigate('/');
    if (atoken) {
      setAtoken('');
      localStorage.removeItem('token');
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-100 shadow-lg p-4 w-full">
      {/* Admin/Doctor Info */}
      <div className="flex items-center">
        <img
          src={assets.admin_logo}
          alt="Admin Logo"
          className="w-20 h-20 object-contain rounded-full mr-4 md:w-24 md:h-24"
        />
        <p className="text-lg md:text-xl font-semibold text-gray-800">
          {atoken ? 'Admin' : 'Doctor'}
        </p>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="px-6 py-2 text-sm md:text-base font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Logout
      </button>
    </div>
  );
};

export default Naver;


