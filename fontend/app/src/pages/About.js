import React from 'react';
import { assets } from '../assets/assets_frontend/assets';

const About = () => {
  return (
    <div className="bg-gray-50 py-8">
      <div className="text-center mb-6">
        <p className="text-2xl md:text-3xl font-bold text-gray-800">About <span className="text-blue-600">Us</span></p>
      </div>
      <div className="flex flex-col md:flex-row items-center max-w-4xl mx-auto px-4">
        <img 
          src={assets.about_image} 
          alt="About Us" 
          className="w-full md:w-1/3 rounded-lg shadow-lg mb-4 md:mb-0 md:mr-6" 
        />
        <div className="md:w-2/3">
          <p className="text-sm md:text-base text-gray-700 mb-3">
            "At [Hospital Name], our skilled medical team, led by Dr. [Name], is committed to delivering personalized, advanced care, ensuring every patient receives exceptional treatment in a compassionate and supportive environment."
          </p>
          <p className="text-sm md:text-base text-gray-700 mb-4">
            At [Hospital Name], we prioritize compassionate care, combining advanced medical expertise with personalized treatment. Led by Dr. [Name], our team is dedicated to improving health outcomes and providing a supportive, patient-focused experience.
          </p>
          <b className="text-lg md:text-xl text-blue-600">Our Vision</b>
          <p className="text-sm md:text-base text-gray-700 mt-2">
            Our team of doctors combines extensive medical expertise, empathy, and a commitment to excellence. Each physician is highly skilled, attentive, and dedicated to providing personalized care, ensuring every patient receives the best possible treatment and support.
          </p>
        </div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg">
  <div className="mb-6">
    <p className="text-lg font-bold text-gray-800">
      WHY <span className="text-blue-600">CHOOSE US</span>
    </p>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <b className="text-sm text-blue-600">Efficiency:</b>
      <p className="text-xs md:text-sm text-gray-700 mt-1">
        Efficiency is achieving maximum productivity with minimal wasted time, effort, or resources, consistently.
      </p>
    </div>
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <b className="text-sm text-blue-600">Convenience:</b>
      <p className="text-xs md:text-sm text-gray-700 mt-1">
        Convenience means making tasks easier and more accessible, saving time, effort, and hassle.
      </p>
    </div>
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <b className="text-sm text-blue-600">Personalization:</b>
      <p className="text-xs md:text-sm text-gray-700 mt-1">
        Personalization tailors experiences and services to individual preferences, enhancing satisfaction and fostering deeper connections.
      </p>
    </div>
  </div>
</div>


    </div>
  );
};

export default About;

