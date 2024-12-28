import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyAppointment = () => {
  const { backendurl, token, getAllDoctors } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetching user appointments
  const getUserAppointments = async () => {
    try {
      const response = await axios.get(`${backendurl}/api/user/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAppointments(response.data.appointments);
      } else {
        toast.error('Failed to fetch appointments');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  // Cancel an appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendurl}/api/user/cancelappointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message || 'Appointment canceled successfully');
        getUserAppointments(); // Refresh appointments
        getAllDoctors(); // Refresh doctor data
      } else {
        toast.error(data.message || 'Unable to cancel the appointment');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to cancel the appointment. Please try again later.'
      );
    }
  };

  // Razorpay payment integration
  const initpay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "FDJOREJREJ", // Ensure key is correct
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(`${backendurl}/api/user/razorpayverify`, response, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (data.success) {
            getUserAppointments();
            navigate('/my-appointment');
          } else {
            toast.error('Payment verification failed.');
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Payment verification failed.');
        }
      },
      prefill: {
        name: 'John Doe', // You can dynamically set this from user data
        email: 'user@example.com', // Same as above
        contact: '1234567890', // You can dynamically set this too
      },
      notes: {
        address: 'address note',
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Payment appointment
  const paymentAppointment = async (appointmentId) => {
    try {
      const body = {
        appointmentId: appointmentId,
        userId: "12345",  // Replace with dynamic user ID
      };
  
      const { data } = await axios.post(
        `${backendurl}/api/user/payment`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Check if payment creation was successful
      if (data.success) {
        initpay(data.order);  // Proceed to initiate the payment if successful
      } else {
        console.error("Payment creation failed:", data.message);
        toast.error(data.message || "Payment creation failed");
      }
    } catch (error) {
      console.error("Error during payment:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Payment failed");
    }
  };
  
  
  

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Appointments</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading appointments...</p>
      ) : appointments.length > 0 ? (
        <div className="grid gap-6">
          {appointments.map((item) => {
            const doctor = item.docdata || {};
            const address = doctor.address || {};

            return (
              <div key={item._id} className="flex flex-col sm:flex-row bg-white shadow-md rounded-lg overflow-hidden">
                {/* Left side: Doctor details */}
                <div className="sm:w-2/3 flex items-start p-4 space-x-4">
                  <img
                    src={`${backendurl}/${doctor.image || 'default-image.jpg'}`}
                    alt={doctor.name || 'Doctor'}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{doctor.name || 'Unknown Doctor'}</h2>
                    <p className="text-sm text-gray-500">{doctor.speciality || 'N/A'}</p>
                    <p className="text-sm text-gray-700">{address.line1 || 'Address not available'}</p>
                    <p className="text-sm text-gray-700">{address.line2 || ''}</p>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Date:</span> {item.slotDate || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Time:</span> {item.slotTime || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Right side: Buttons */}
                <div className="sm:w-1/3 flex flex-col justify-center items-end p-4 space-y-2">
                  {!item.cancelled && item.payment && (
                    <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50">Paid</button>
                  )}
                  {!item.cancelled && !item.payment && (
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded shadow-md transition hover:bg-blue-600"
                      onClick={() => paymentAppointment(item._id)}
                    >
                      Pay Online
                    </button>
                  )}
                  {!item.cancelled ? (
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded shadow-md transition hover:bg-red-600"
                      onClick={() => cancelAppointment(item._id)}
                    >
                      Cancel Appointment
                    </button>
                  ) : (
                    <p className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded">
                      Appointment Canceled
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-600">No appointments found.</p>
      )}
    </div>
  );
};

export default MyAppointment;









