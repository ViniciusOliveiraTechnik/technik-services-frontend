import { Routes, Route } from "react-router-dom";
import Login from "./pages/authentication/Login";
import Authentication from "./pages/authentication/Authentication";
import Home from "./pages/Home";
import Register from "./pages/authentication/Register";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import ForgotPasswordConfirm from "./pages/authentication/ForgotPasswordConfirm";

export default function App() {
  return (
    <main>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route
          path="forgot-password-confirm"
          element={<ForgotPasswordConfirm />}
        />
        <Route path="/auth" element={<Authentication />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </main>
  );
}
