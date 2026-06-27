import axios from "axios";

// ✅ API base URL
// Local: /api (Vite proxy orqali backend ga yo'naltiriladi)
// Production: /api (Vercel rewrites orqali backend ga yo'naltiriladi)
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // httpOnly cookie uchun kerak
  timeout: 30000, // 30 soniya
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Sessiya yo'q deb belgilangan URL lar (401 xato ko'rsatmaymiz)
const SILENT_401_URLS = ['/users/me', '/users/logout'];

// ✅ Sessiya tekshirilayotganini belgilash
let isCheckingAuth = false;

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    // ✅ Backend javob formati: { success, data, message? }
    // Frontend'da har doim `data.data` ishlatmaslik uchun — shu yerda normalizatsiya qilamiz
    const body = response.data;

    if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
      // response.data.data ni response.data ga ko'chiramiz (axios uchun response.data bo'lib qoladi)
      response.data = body.data;
      // success/message ham metadata sifatida saqlab qo'yamiz
      response.meta = {
        success: body.success,
        message: body.message,
      };
    }

    return response;
  },
  (error) => {
    const originalUrl = error.config?.url || '';
    const isSilent = SILENT_401_URLS.some((url) => originalUrl.includes(url));

    // ─── Network error ───
    if (!error.response) {
      if (error.code === "ECONNABORTED") {
        error.message = "So'rov vaqti tugadi. Internetni tekshiring.";
      } else if (error.code === "ERR_NETWORK") {
        error.message = "Server bilan bog'lanib bo'lmadi. Backend ishlamayotgan bo'lishi mumkin.";
      } else {
        error.message = "Tarmoq xatoligi yuz berdi.";
      }
      return Promise.reject(error);
    }

    const status = error.response.status;
    const data = error.response.data;

    // ─── 401 Unauthorized ───
    if (status === 401) {
      // Sessiya tekshiruvi — silent (xato ko'rsatmaymiz)
      if (isSilent) {
        const isLoginPage = window.location.pathname.includes('/login');
        if (!isLoginPage && !isCheckingAuth) {
          localStorage.removeItem("logistic_user");
        }
        error._silent = true;
        return Promise.reject(error);
      }

      const isLoginPage = window.location.pathname.includes('/login') ||
                          originalUrl.includes('/users/login');
      if (isLoginPage) {
        error.message = data?.message || "Email yoki parol noto'g'ri";
      } else {
        localStorage.removeItem("logistic_user");
        error.message = data?.message || "Sessiya tugagan. Qayta kiring.";
        const PUBLIC_PATHS = ['/', '/xizmatlar', '/narxlar', '/boglanish', '/buyurtma', '/kuzatish', '/login', '/register'];
        const isPublic = PUBLIC_PATHS.some(p => window.location.pathname === p);
        if (!isPublic && !window.location.pathname.startsWith('/tasdiqlash')) {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }

    // ─── 403 Forbidden ───
    if (status === 403) {
      error.message = data?.message || "Bu amalni bajarish uchun ruxsatingiz yo'q.";
      return Promise.reject(error);
    }

    // ─── 404 Not Found ───
    if (status === 404) {
      error.message = data?.message || "Ma'lumot topilmadi";
      return Promise.reject(error);
    }

    // ─── 429 Rate Limit ───
    if (status === 429) {
      error.message = data?.message || "Juda ko'p so'rov yuborildi. 15 daqiqadan so'ng qayta urinib ko'ring.";
      return Promise.reject(error);
    }

    // ─── 503 Service Unavailable ───
    if (status === 503) {
      error.message = data?.message || "Server vaqtincha xizmat ko'rsatmayapti. Iltimos, keyinroq urinib ko'ring.";
      return Promise.reject(error);
    }

    // ─── 400 Bad Request ───
    if (status === 400) {
      error.message = data?.message || "So'rov noto'g'ri";
      return Promise.reject(error);
    }

    // ─── 500 Internal Server Error ───
    if (status === 500) {
      error.message = data?.message || "Serverda xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.";
      return Promise.reject(error);
    }

    // ─── Boshqa xatolar ───
    error.message = data?.message || `Server xatoligi (${status})`;
    return Promise.reject(error);
  }
);

export default api;