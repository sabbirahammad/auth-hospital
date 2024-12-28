import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { token, settoken, backendurl } = useContext(AppContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState('Sign up');
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // Disable button while processing

    try {
      const endpoint = state === 'Sign up' ? '/api/user/register' : '/api/user/login';
      const payload = state === 'Sign up' ? { name, email, password } : { email, password };
      const { data } = await axios.post(backendurl + endpoint, payload);

      if (data.success) {
        localStorage.setItem('token', data.token);
        settoken(data.token);
        toast.success(state === 'Sign up' ? 'Account created successfully!' : 'Login successful!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false); // Re-enable button
    }
  };

  useEffect(() => {
   if(token){
    navigate('/')
   }
  }, [token])
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-4"
      >
        <div className="text-center mb-6">
          <p className="text-lg font-bold text-gray-800">
            {state === 'Sign up' ? 'Create Account' : 'Login'}
          </p>
          <p className="text-sm text-gray-600">
            Please {state === 'Sign up' ? 'sign up' : 'login'} to book an appointment
          </p>
        </div>

        {state === 'Sign up' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              className="mt-1 px-4 py-2 w-full border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            className="mt-1 px-4 py-2 w-full border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            className="mt-1 px-4 py-2 w-full border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } text-white py-2 rounded-lg font-semibold text-sm transition duration-200`}
        >
          {loading ? 'Processing...' : state === 'Sign up' ? 'Create Account' : 'Login'}
        </button>

        <div className="text-center mt-4 text-sm text-gray-600">
          {state === 'Sign up' ? (
            <p>
              Already have an account?{' '}
              <span
                onClick={() => setState('Login')}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <span
                onClick={() => setState('Sign up')}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Sign up here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;

