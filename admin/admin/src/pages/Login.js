import React, { useContext, useState } from 'react';
import { AdminContext } from '../context/Admincontext';
import axios from 'axios';

const Login = () => {
  const [state, setState] = useState('Admin');
  const { setAtoken, backendurl } = useContext(AdminContext); // Updated to use setatoken
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onsubmithandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = state === 'Admin' ? '/api/admin/login' : '/api/doctor/login';
      const { data } = await axios.post(`${backendurl}${endpoint}`, { email, password });

      if (data.success) {
        localStorage.setItem('token',data.token)
        setAtoken(data.token); // Use setatoken to update the token
        console.log('Token:', data.token);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onsubmithandler} className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md bg-gray-800 text-white p-8 rounded-lg shadow-lg space-y-6">
        <p className="text-3xl font-bold text-center mb-4">
          <span className="text-indigo-400 capitalize">{state}</span> Login
        </p>

        {error && <p className="text-red-500 text-center">{error}</p>}
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Email</label>
          <input 
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            required
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200" 
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Password</label>
          <input 
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            required
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200" 
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-md transition duration-200 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <div className="text-center text-sm mt-4">
          {state === 'Admin' ? (
            <p className="text-gray-300">Doctor Login? 
              <span 
                onClick={() => setState('Doctor')} 
                className="text-indigo-400 cursor-pointer hover:text-indigo-500 ml-1">
                  Click here
              </span>
            </p>
          ) : (
            <p className="text-gray-300">Admin Login? 
              <span 
                onClick={() => setState('Admin')} 
                className="text-indigo-400 cursor-pointer hover:text-indigo-500 ml-1">
                  Click here
              </span>
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default Login;



