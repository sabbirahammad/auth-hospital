
import { useContext } from 'react';
import './App.css';
import Login from './pages/Login';
import { AdminContext } from './context/Admincontext';
import Naver from './Componend/Naver';
import Sidelink from './Componend/Sidelink';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import Adddoctor from './pages/Admin/Adddoctor';
import Doctorlist from './pages/Admin/Doctorlist';
import Allappointment from './pages/Admin/Allappointment';

function App() {
  const{atoken}=useContext(AdminContext)
  return atoken? (
    <div>
          <Naver/>
          <div className='flex items-start'>
            <Sidelink/>
            <Routes>
              <Route path='/' element={<></>}/>
              <Route path='/dashboard' element={<Dashboard/>}/>
              <Route path='/all-appointment' element={<Allappointment/>}/>
              <Route path='/add-doctor' element={<Adddoctor/>}/>
              <Route path='/doctor-list' element={<Doctorlist/>}/>
            </Routes>
          </div>
    </div>
  ):
  (
    <div><Login/></div>
  )
  ;
}

export default App;
