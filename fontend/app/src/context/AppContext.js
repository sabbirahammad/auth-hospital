import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Create the context
const AppContext = createContext();

// Create the provider component
const AppProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const currencysimble = '$';
  const [token, settoken] = useState(localStorage.getItem('token')? localStorage.getItem('token'):false); // Token from localStorage
  const backendurl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';  // Use environment variable for backend URL
const [userdata, setUserdata] = useState(false)

  // Fetch all doctors
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendurl}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to fetch doctors');
    }
  };

  const loaduserprofiledata = async () => {
    try {
        if (!token) {
            throw new Error('User token is missing.');
        }

        const { data } = await axios.get(`${backendurl}/api/user/get-profile`, {
            headers: {
                Authorization: `Bearer ${token}`, // Pass token in the Authorization header
            },
        });

        if (data.success) {
            setUserdata(data.userdata);
        } else {
            toast.error(data.message || 'Failed to load user profile');
        }
    } catch (error) {
        console.error("Profile Load Error:", error.message);
        toast.error(error.response?.data?.message || 'An unexpected error occurred');
    }
};


  // Context value to be provided to consumers
  const value = {
    getAllDoctors,
    doctors,
    currencysimble,
    token,
    settoken,
    backendurl,
    userdata,setUserdata,
    loaduserprofiledata
  };

  // Fetch doctors on mount
  useEffect(() => {
    getAllDoctors();
  }, []); // Only run once when component mounts

  useEffect(() => {
    if(token){
      loaduserprofiledata();
    }
    else{
      setUserdata(false)
    }
  }, [token])
  

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };


