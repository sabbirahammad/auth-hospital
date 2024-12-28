import React from 'react'
import { Link } from 'react-router-dom'
import { specialityDatas } from '../assets/assets_frontend/assets'

const SpeciManu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-16 text-gray-800' id='specifi'>
        <h1 className='text-3xl font-medium'>Find by speciality</h1>
        <p className='sm:w-1/3 text-center text-sm'>Doctors specialize in fields like cardiology, neurology, pediatrics, dermatology, and oncology</p>
        <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
            {specialityDatas.map((item, index) => {
                return (
                    <Link 
                        onClick={window.scrollTo({ top: 0, behavior: 'smooth' })} 
                        className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500' 
                        key={index} 
                        to={`/doctors/${item.speciality}`}
                    >
                        <img className='w-16 sm:w-24 mb-2' src={item.image} alt='' />
                        <p>{item.speciality}</p>
                    </Link>
                )
            })}
        </div>
    </div>
  )
}

export default SpeciManu
