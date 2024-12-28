import React from 'react';
import { assets } from '../assets/assets_frontend/assets';

const Contact = () => {
  return (
    <div className="bg-gray-50 p-8 rounded-lg shadow-lg flex flex-col items-center">
      <div className="text-center mb-8">
        <p className="text-2xl font-bold text-gray-800">
          sabbir <span className="text-blue-600">US</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center max-w-4xl mx-auto">
        <img 
          src={assets.contact_image} 
          alt="Contact Us" 
          className="w-full md:w-1/2 rounded-lg shadow-lg mb-6 md:mb-0 md:mr-8" 
        />
        <div className="md:w-1/2 text-center md:text-left space-y-4">
          <p className="text-lg font-semibold text-gray-800">OUR OFFICE</p>
          <p className="text-sm text-gray-700">
            Dhanmondi, Dhaka <br /> Dhanmondi 32, Bangladesh
          </p>
          <p className="text-sm text-gray-700">
            Phone: 018854343... <br /> Email: sabbirahammad123467@gmail.com
          </p>
          <p className="text-lg font-semibold text-gray-800">Careers at PRESERIPTO</p>
          <p className="text-sm text-gray-700">Learn more about our teams and openings.</p>
          <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
