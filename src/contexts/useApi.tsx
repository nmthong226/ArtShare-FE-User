import axios from 'axios';
import { useUser } from './UserProvider';

const useApi = () => {
  const { token } = useUser();

  const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, 
    },
  });

  return api; 
};

export default useApi;
