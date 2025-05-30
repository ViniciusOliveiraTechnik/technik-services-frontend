import axios from "axios";

export const createApi = (getAccessToken, setAccessToken, navigateToLogin) => {
  const api = axios.create({
    baseURL: "http://localhost:8000/",
    withCredentials: true,
  });

  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };

  api.interceptors.request.use(
    (config) => {
      const accessToken = getAccessToken();

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (originalRequest.url.includes("refresh-token")) {
          setAccessToken(null);
          if (navigateToLogin) navigateToLogin();

          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = "Bearer " + token;
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshResponse = await api.post(
            "auth/refresh-token/"
          );
          const newAccessToken = refreshResponse.data.access_token;

          setAccessToken(newAccessToken);
          processQueue(null, newAccessToken);

          originalRequest.headers.Authorization = "Bearer " + newAccessToken;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          setAccessToken(null);

          if (navigateToLogin) navigateToLogin();

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};
