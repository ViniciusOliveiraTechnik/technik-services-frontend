import { createApi } from "@/services/BaseService";
import { createContext, useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const getAccessToken = useCallback(() => accessToken, [accessToken]);

  const baseApi = createApi(getAccessToken, setAccessToken, () =>
    navigate("/login")
  );

  const register = async (userForm) => {
    try {
      const response = await baseApi.post("accounts/auth/register/", userForm);
      console.log(response.data)
    } catch (err) {
      console.error(err);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await baseApi.post("accounts/auth/login/", credentials);
      const temporaryToken = response.data.access_token;
      setAccessToken(temporaryToken);

      return response.data;
    } catch (err) {
      throw err.response?.data || "Erro ao realizar o login";
    }
  };

  const authenticate = async (otpCode) => {
    try {
      const response = await baseApi.post(
        "accounts/auth/2F-authentication/",
        otpCode
      );
      setAccessToken(response.data.access_token);
    } catch (err) {
      throw err.response?.data || "Erro de autenticação";
    }
  };

  const getMe = async () => {
    try {
      const response = await baseApi.get("accounts/auth/me/");

      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        baseApi,
        register,
        login,
        authenticate,
        getMe,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
