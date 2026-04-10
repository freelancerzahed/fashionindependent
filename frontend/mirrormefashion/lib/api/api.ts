import axios from 'axios';


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost/mirrormefashion/api/v2',
});


export default api;