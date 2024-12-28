import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets_frontend/assets';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const { docid } = useParams();
  const { doctors, currencysimble, getAllDoctors, backendurl, token } = useContext(AppContext);
  const [doctor, setDoctor] = useState(null);
  const [docslot, setDocSlot] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const dayweek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slottime, setSlotTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]); // Tracks the booked slots with date & time

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorInfo = () => {
      const docInfo = doctors.find((doc) => doc._id === docid);
      setDoctor(docInfo || null);
      setLoading(false);
    };
    if (doctors && docid) fetchDoctorInfo();
  }, [doctors, docid]);

  const getAvailableSlots = () => {
    const slots = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      slots.push({
        day: dayweek[currentDate.getDay()],
        date: currentDate.getDate(),
        times: generateTimes(currentDate),
      });
    }

    setDocSlot(slots);
  };

  const generateTimes = (currentDate) => {
    const times = [];
    let currentTime = new Date(currentDate);
    currentTime.setHours(9, 0, 0, 0);

    while (currentTime.getHours() < 17) {
      const formattedTime = currentTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      const day = currentDate.getDate();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();

      const slotdate = `${day}-${month}-${year}`;

      const isSlotAvailable =
        doctor.slotsbooks && doctor.slotsbooks[slotdate]
          ? !doctor.slotsbooks[slotdate].includes(formattedTime) : true;

      if (isSlotAvailable) {
        times.push(formattedTime);
      }

      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return times;
  };

  useEffect(() => {
    if (doctor) getAvailableSlots();
  }, [doctor]);

  // Logic to check for booked slots and show "Booking not available" if within 24 hours
  const isSlotAvailableWithin24Hours = (slotDate, slotTime) => {
    const currentDate = new Date();
    const bookedSlot = doctor.slotsbooks && doctor.slotsbooks[slotDate];

    if (bookedSlot && bookedSlot.includes(slotTime)) {
      const bookedTime = new Date(`${slotDate} ${slotTime}`);
      const timeDifference = currentDate - bookedTime;
      return timeDifference > 24 * 60 * 60 * 1000; // If more than 24 hours have passed, available again
    }
    return true;
  };

  const handleBookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book an appointment');
      return navigate('/login');
    }

    try {
      const selectedSlot = docslot[selectedSlotIndex];
      const date = selectedSlot?.date;
      const day = String(date).padStart(2, '0');
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      const year = new Date().getFullYear();

      const slotdate = `${day}-${month}-${year}`;

      if (!slottime) {
        toast.error('Please select a time slot');
        return;
      }

      if (doctor.slotsbooks && doctor.slotsbooks[slotdate]?.includes(slottime)) {
        toast.error('This time slot is already booked');
        return;
      }

      const response = await axios.post(
        `${backendurl}/api/user/book-appointment`,
        {
          userId: token.userId,
          docId: docid,
          slotDate: slotdate,
          slotTime: slottime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Update booked slots state here to track the booked slot
        setBookedSlots([...bookedSlots, { date: slotdate, time: slottime }]);
        getAllDoctors(); // Refresh doctors list
        navigate('/my-appointment');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error booking appointment:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to book appointment.');
    }
  };

  const isSlotBooked = (slotDate, slotTime) => {
    // Ensure bookedSlots is an array and contains valid slot objects
    if (!Array.isArray(bookedSlots)) return false;
  
    return bookedSlots.some(
      (slot) =>
        String(slot.date).trim() === String(slotDate).trim() &&
        String(slot.time).trim() === String(slotTime).trim()
    );
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return doctor ? (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-around border-b">
        <button
          className={`py-2 px-4 ${activeTab === 'profile' ? 'font-bold border-b-2 border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('profile')}
        >
          Doctor Profile
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'booking' ? 'font-bold border-b-2 border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('booking')}
        >
          Booking Slots
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="flex mt-4">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden">
            <img src={`${backendurl}/${doctor.image}`} alt={doctor.name} className="object-cover w-full h-full" />
          </div>
          <div className="ml-6 flex-grow">
            <div className="flex items-center space-x-2 text-gray-800 font-semibold text-lg">
              <p>{doctor.name}</p>
              <img src={assets.verified_icon} alt="Verified" className="w-5 h-5" />
            </div>
            <div className="text-gray-500 mt-1 text-sm">
              <p>
                {doctor.degree} - {doctor.speciality}
              </p>
            </div>
            <button className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded-full font-medium shadow-sm hover:bg-blue-600 transition-all duration-200">
              {doctor.experience} Years Experience
            </button>
            <div className="mt-6">
              <div className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                <p>About</p>
                <img src={assets.info_icon} alt="Info" className="w-5 h-5" />
              </div>
              <p className="text-gray-600 mt-2 leading-relaxed text-sm">{doctor.about}</p>
            </div>
            <div className="mt-4">
              <p className="text-gray-800 text-sm">
                Appointment Fee: <span className="font-semibold">{currencysimble}{doctor.fees}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'booking' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800">Booking Slots</h2>
          <div className="flex justify-between mt-2 space-x-2">
            {docslot.length > 0 ? (
              docslot.map((slot, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedSlotIndex(index)}
                  className={`flex flex-col items-center py-2 px-4 rounded-lg cursor-pointer ${selectedSlotIndex === index ? 'bg-blue-500 text-white' : 'bg-black text-white hover:bg-blue-500'}`}
                >
                  <p className="font-semibold text-lg">{slot.day}</p>
                  <p className="text-lg">{slot.date}</p>
                </div>
              ))
            ) : (
              <p>No available slots</p>
            )}
          </div>
          {selectedSlotIndex !== null && docslot[selectedSlotIndex]?.times?.length > 0 ? (
            <div className="mt-4 overflow-x-auto whitespace-nowrap space-x-4 p-2 bg-gray-200 rounded-lg">
              <div className="flex space-x-6">
                {docslot[selectedSlotIndex].times.map((time, idx) => {
                  const slotDate = `${docslot[selectedSlotIndex].date}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${new Date().getFullYear()}`;
                  const isBooked = isSlotBooked(slotDate, time);
                  const isAvailable = isSlotAvailableWithin24Hours(slotDate, time);
                  return (
                    <button
                      key={idx}
                      className={`px-4 py-2 ${isBooked || !isAvailable ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md`}
                      onClick={() => (isBooked || !isAvailable) ? null : setSlotTime(time)}
                      disabled={isBooked || !isAvailable}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600 mt-4">No available times for this day.</p>
          )}
          <button
            className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded-md w-full"
            onClick={handleBookAppointment}
          >
            Book Appointment
          </button>
        </div>
      )}
    </div>
  ) : (
    <div className="text-center mt-10">Doctor not found.</div>
  );
};

export default Appointment;
