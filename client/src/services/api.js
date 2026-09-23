/*----- FILE: api.js | CONTENT: Axios API client configuration. | PURPOSE: Keeps the backend URL in one place and automatically sends the logged-in user's JWT token with protected API requests. -----*/

import axios from "axios";

/*----- BASE URL: VITE_API_URL can be changed in client/.env when the backend host or port changes. -----*/
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",
});

/*----- REQUEST INTERCEPTOR: Adds the JWT token to the Authorization header when a user is logged in. -----*/
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("moviemateToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
