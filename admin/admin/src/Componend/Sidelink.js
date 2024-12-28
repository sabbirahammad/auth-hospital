import React, { useContext } from 'react';
import { AdminContext } from '../context/Admincontext';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets_admin/assets';

const Sidelink = () => {
  const { atoken } = useContext(AdminContext);

  return (
    <div className="bg-gray-100 shadow-md w-60 h-screen flex flex-col justify-start p-4">
      {atoken && (
        <ul className="space-y-4">
          {/* Dashboard */}
          <li>
            <NavLink
              to={'/dashboard'}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-md ${
                  isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                }`
              }
            >
              <img
                src={assets.home_icon}
                alt="Dashboard"
                className="w-6 h-6 object-contain"
              />
              <p className="font-medium text-gray-800">Dashboard</p>
            </NavLink>
          </li>

          {/* All Appointments */}
          <li>
            <NavLink
              to={'/all-appointment'}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-md ${
                  isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                }`
              }
            >
              <img
                src={assets.appointment_icon}
                alt="Appointments"
                className="w-6 h-6 object-contain"
              />
              <p className="font-medium text-gray-800">Appointments</p>
            </NavLink>
          </li>

          {/* Add Doctor */}
          <li>
            <NavLink
              to={'/add-doctor'}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-md ${
                  isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                }`
              }
            >
              <img
                src={assets.add_icon}
                alt="Add Doctor"
                className="w-6 h-6 object-contain"
              />
              <p className="font-medium text-gray-800">Add Doctor</p>
            </NavLink>
          </li>

          {/* Doctor List */}
          <li>
            <NavLink
              to={'/doctor-list'}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-md ${
                  isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                }`
              }
            >
              <img
                src={assets.people_icon}
                alt="Doctor List"
                className="w-6 h-6 object-contain"
              />
              <p className="font-medium text-gray-800">Doctor List</p>
            </NavLink>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Sidelink;
