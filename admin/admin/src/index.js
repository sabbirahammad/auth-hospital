import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import AdminContextProvider from './context/Admincontext';
import DoctorContextProvider from './context/Doctorcontext';
import Appcontextprovide from './context/AppContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AdminContextProvider>
      <DoctorContextProvider>
        <Appcontextprovide>
          <App />
        </Appcontextprovide>
      </DoctorContextProvider>
    </AdminContextProvider>
  </BrowserRouter>
);



