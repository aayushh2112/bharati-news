// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// const api = axios.create({
//   baseURL: API_URL,
// });

// // Add token to requests
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;


import axios from "axios";

// Always use deployed backend URL
const API_URL = "https://bharati-news.onrender.com";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
