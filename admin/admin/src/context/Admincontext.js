import { createContext, useState } from 'react';
import axios from 'axios';
import toastify from 'toastify-js';
import 'toastify-js/src/toastify.css'; // Ensure toastify styles are included

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [atoken, setAtoken] = useState(localStorage.getItem('token') || "");
  const [doctor, setDoctor] = useState([]);

  const backendurl = "http://localhost:4000";

  const getalldoctors = async () => {
    try {
        const { data } = await axios.post(`${backendurl}/api/admin/all-doctors`, null, {
            headers: { Authorization: `Bearer ${atoken}` },
        });

        if (data.success) {
            setDoctor(data.doctors);
            console.log(data)
        } else {
            toastify({
                text: data.message || "Failed to fetch doctors.",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: { background: "orange" },
            }).showToast();
        }
    } catch (error) {
        toastify({
            text: error.response?.data?.message || "An error occurred while fetching doctors.",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: { background: "red" },
        }).showToast();
    }
};

const changeAvailability = async (docid) => {
  try {
    const { data } = await axios.post(
      `${backendurl}/api/admin/change-availablity`, 
      { docid }, // Pass the docid as part of the request body
      {
        headers: { Authorization: `Bearer ${atoken}` },
      }
    );
    
    if (data.success) {
      toastify.success();
      getalldoctors(); // Reload doctors
    } else {
      toastify({
        text: data.message || "Failed to change availability.",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: { background: "orange" },
      }).showToast();
    }
  } catch (error) {
    toastify({
      text: error.response?.data?.message || " changing availability successfully.",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: { background: "red" },
    }).showToast();
  }
};



  const value = {
    atoken,
    setAtoken,
    backendurl,
    doctor,
    getalldoctors,
    changeAvailability
  };

  return <AdminContext.Provider value={value}>
    {children}
    </AdminContext.Provider>;
};

export default AdminContextProvider;

