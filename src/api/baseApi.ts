import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BE_URL || "http://localhost:3000/",
  timeout: 5000, // Optional timeout in milliseconds
});

// Optionally, set default headers for all requests
api.defaults.headers.common["Content-Type"] = "application/json";

// Add a request interceptor to dynamically set the Authorization header
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
// api.interceptors.response.use(
//   (response) => response, // Pass through successful responses
//   async (error) => {
//     const originalRequest = error.config;

//     // If the response status is 401 and the request was not already retried
//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       localStorage.getItem("refresh_token")
//     ) {
//       originalRequest._retry = true; // Mark the request as retried
//       const refreshToken = localStorage.getItem("refresh_token");
//       const username = localStorage.getItem("username");

//       try {
//         // Make a request to refresh the access token
//         const { data } = await axios.post(
//           `${import.meta.env.VITE_DOMAIN}/auth/refresh_token`,
//           {
//             username,
//             refreshToken,
//           }
//         );

//         // Update the store with the new access token
//         useAuthStore.setState({
//           accessToken: data.data.accessToken,
//         });

//         // Save the new refresh token in local storage
//         if (data.data)
//           localStorage.setItem("refresh_token", data.data.refreshToken);

//         // Update the Authorization header with the new token
//         originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

//         // Retry the original request
//         return api(originalRequest);
//       } catch (refreshError) {
//         // If refresh token fails, log out the user or handle the error appropriately
//         useAuthStore.setState({
//           accessToken: null,
//         });
//         return Promise.reject(refreshError);
//       }
//     }

//     // If the error is not recoverable, reject it
//     return Promise.reject(error);
//   }
// );

export default api;
