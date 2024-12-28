import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Doctor = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filter, setFilter] = useState([]);
  const navigate = useNavigate();

  // Filter doctors based on the specialty
  const specialFilter = () => {
    if (speciality) {
      setFilter(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilter(doctors);
    }
  };

  useEffect(() => {
    specialFilter();
  }, [doctors, speciality]);

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Browse Through Doctor Specialties</h2>

      <div className="flex flex-col md:flex-row">
        {/* Specialties List */}
        <div className="md:w-1/4 p-4 md:p-0 mb-6 md:mb-0">
          <div className="flex flex-col space-y-2 md:space-y-4">
            {["General physician", "Gynecologist", "Dermatologist", "Pediatricians", "Neurologist"].map((spec) => (
              <p
                key={spec}
                onClick={() => (speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`))}
                className={`cursor-pointer border border-gray-300 rounded-lg px-4 py-2 text-center hover:bg-blue-500 hover:text-white transition duration-300
                ${speciality === spec ? "bg-indigo-100 text-black" : ""}`}
              >
                {spec}
              </p>
            ))}
          </div>
        </div>

        {/* Doctor Cards */}
        <div className="md:w-3/4 p-4 md:pl-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filter.map((item, index) => (
              <div
                onClick={() => navigate(`/appointment/${item._id}`)}
                key={index}
                className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300'
              >
                {/* Display Image */}
                <img
                  className="bg-blue-50 w-full h-32 object-cover"
                  src={`http://localhost:4000/${item.image}`} // Make sure to use the correct URL for the image
                  alt={item.name}
                />
                <div className='p-4'>
                  <div className='flex items-center gap-2 text-sm text-green-500'>
                    <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                    <p>Available</p>
                  </div>
                  <p className='font-semibold text-lg'>{item.name}</p>
                  <p className='text-gray-600'>{item.speciality}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctor;





