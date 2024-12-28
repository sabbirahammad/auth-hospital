import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const RelatedDoctor = ({ docid, speciality }) => {
    const [relatedDoctors, setRelatedDoctors] = useState([]);
    const { doctors } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const filteredDoctors = doctors.filter(doc => doc.speciality === speciality && doc._id !== docid);
            setRelatedDoctors(filteredDoctors);
        }
    }, [doctors, docid, speciality]);

    return (
        <div>
            <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
                <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
                <p className='sm:w-1/3 text-center text-sm'>
                    Simply browse through our extensive list of trusted doctors
                </p>
                <div className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                    {relatedDoctors.slice(0, 5).map((item) => (
                        <div
                            onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0); }}
                            key={item._id}
                            className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500'
                        >
                            {/* Ensure full URL for the image */}
                            <img className='bg-blue-50 w-full h-32 object-cover' src={`http://localhost:4000/${item.image}`} alt={`${item.name} profile`} />
                            <div className='p-4'>
                                <div className='flex items-center gap-2 text-sm text-green-500'>
                                    <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                                    <p>Available</p>
                                </div>
                                <p className='font-bold'>{item.name}</p>
                                <p>{item.speciality}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'>
                    More
                </button>
            </div>
        </div>
    );
};

export default RelatedDoctor;

