import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/Admincontext';

const Doctorlist = () => {
    const { doctor, atoken, getalldoctors,changeAvailability } = useContext(AdminContext);

    useEffect(() => {
        if (atoken) {
            getalldoctors();
        }
    }, [atoken, getalldoctors]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Doctors</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {doctor?.map((items, index) => (
                    <div
                        key={index}
                        className="doctor-card bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="relative group">
                            <img
                                src={`http://localhost:4000/${items.image}`}
                                alt={items.name}
                                className="w-full h-32 object-cover rounded-md group-hover:opacity-50 transition-opacity duration-300"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
                        </div>
                        <h2 className="text-lg font-semibold mt-2 group-hover:text-blue-500 transition-colors duration-300">
                            {items.name}
                        </h2>
                        <p className="text-gray-600">Speciality: {items.speciality}</p>
                        <div className="flex items-center mt-2">
                            <input
                            onChange={()=>changeAvailability(items._id)}
                                type="checkbox"
                                checked={items.available}
                                readOnly
                                className="mr-2"
                            />
                            <p className="text-gray-800">Available</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Doctorlist;



