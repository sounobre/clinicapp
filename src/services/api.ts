// Caminho: src/services/api.ts
import axios from "axios";

const api = axios.create({
  // IMPORTANTE: Substitua pela URL real do seu backend
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Você pode adicionar interceptors para lidar com autenticação (tokens JWT) aqui
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('authToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
