import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatApi, messageApi } from '../api/api';

const AxiosInterceptor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Function to handle 401 Unauthorized errors
    const handleUnauthorized = (error) => {
      if (error.response && error.response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
      return Promise.reject(error);
    };

    // Apply interceptors
    const chatInterceptor = chatApi.interceptors.response.use(
      (response) => response,
      handleUnauthorized
    );

    const messageInterceptor = messageApi.interceptors.response.use(
      (response) => response,
      handleUnauthorized
    );

    // Cleanup interceptors on unmount
    return () => {
      chatApi.interceptors.response.eject(chatInterceptor);
      messageApi.interceptors.response.eject(messageInterceptor);
    };
  }, [navigate]);

  return null; // This component handles side effects only
};

export default AxiosInterceptor;
