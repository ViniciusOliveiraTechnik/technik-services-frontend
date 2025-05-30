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
      const response = await baseApi.post(
        "accounts/account/register/",
        userForm
      );
      return response.data;
    } catch (err) {
      throw err.response?.data || "Erro ao registrar usuário";
    }
  };

  const login = async (credentials) => {
    try {
      const response = await baseApi.post(
        "accounts/account/login/",
        credentials
      );
      const temporaryToken = response.data.access_token;
      setAccessToken(temporaryToken);

      return response.data;
    } catch (err) {
      throw err.response?.data || "Erro ao realizar o login";
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await baseApi.post("accounts/password/forgot/", email);
      return response.data;
    } catch (err) {
      console.error(err);
      throw err.response?.data || "Erro ao recuperar senha";
    }
  };

  const forgotPasswordConfirm = async (credentials, auth) => {
    try {
      const response = await baseApi.post(
        `accounts/password/forgot-confirm/?auth=${auth}`,
        credentials
      );
      return response.data;
    } catch (err) {
      throw err.response?.data || "Erro ao confirmar a recuperação de senha"
    }
  };

  const authenticate = async (otpCode) => {
    try {
      const response = await baseApi.post("auth/2FA/", otpCode);
      setAccessToken(response.data.access_token);
    } catch (err) {
      throw err.response?.data || "Erro de autenticação";
    }
  };

  const getMe = async () => {
    try {
      const response = await baseApi.get("accounts/account/me/");

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
        forgotPassword,
        forgotPasswordConfirm,
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
