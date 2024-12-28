import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

const Footer = () => {
  return (
    <div className=" text-black py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        
        {/* Logo and Description */}
        <div className="space-y-4">
          <img src={assets.logo} alt="Logo" className="w-24 h-auto" />
          <p className="text-sm">
            A doctor is a licensed medical professional skilled in diagnosing, treating, and preventing illnesses. They provide patient care, prescribe medication, perform surgeries, and promote overall health and wellness.
          </p>
        </div>

        {/* Company Links */}
        <div className="space-y-2">
          <p className="text-lg font-semibold">COMPANY</p>
          <ul className="space-y-1 text-sm">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          <p className="text-lg font-semibold">GET IN TOUCH</p>
          <ul className="space-y-1 text-sm">
            <li>+04960934</li>
            <li>sabbirahammad123467@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-10 border-t border-gray-600 pt-4">
        <p className="text-center text-xs">
          &copy; 2024 Prescripto - All Rights Reserved
        </p>
      </div>
    </div>
  )
}

export default Footer
