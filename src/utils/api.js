import axios from 'axios';

// ✅ Vite proxy ishlatilganda faqat /api yetarli
// Cookie same-origin bo'ladi → httpOnly cookie ishlaydi
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;