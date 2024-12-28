import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Doctor from './pages/Doctor';
import Login from './pages/Login';
import Myprofile from './pages/Myprofile';
import About from './pages/About';
import Navber from './componends/Navber';
import Context from './pages/Context';
import Appointment from './pages/Appoinment';
import Footer from './componends/Footer';
import Signup from './pages/Signup';
import Myapperment from './pages/Myapperment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer/>
      <Navber/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctor />} />
        <Route path='/doctors/:speciality' element={<Doctor />} />
        <Route path='/login' element={<Login />} />
        <Route path='/my-profile' element={<Myprofile />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Context/>} />
         <Route path='/my-appointment' element={<Myapperment/>}/>
        <Route path='/appointment/:docid' element={<Appointment />} /> {/* Dynamic docid */}
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
      <Footer/>
    </div>
  );
};

export default App;
