import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { parseErrors } from "@/utils/errors-util";
import { Loader2, QrCode, ShieldCheck, VerifiedIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AuthenticationForm() {
  const { authenticate } = useAuth();

  const [qrCode, setQrCode] = useState("");
  const [otpCode, setOtpCode] = useState({ otp_code: "" });
  const [error, setError] = useState([]);

  const [isPending, startTransition] = useTransition();

  const location = useLocation();
  const navigate = useNavigate();

  const handleOtpInputChange = (value) => {
    setOtpCode((prev) => ({
      ...prev,
      otp_code: value,
    }));
    setError([]);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        await authenticate(otpCode);
        navigate("/home");
      } catch (err) {
        const parsedError = parseErrors(err) || "Erro ao realizar autenticação";
        setError(parsedError);
      }
    });
  };

  useEffect(() => {
    if (location.state?.qrCode) {
      setQrCode(location.state.qrCode);
    }
  }, [location.state]);

  return (
    <Card className="w-full max-w-3xl h-screen md:h-auto md:px-2">
      <CardHeader>
        <div className="flex items-center justify-end md:hidden my-5 relative">
          <img
            src="src/assets/auth/google/icons8-google-authenticator-48.png"
            alt=""
            className="bg-white rounded-full p-1 size-14"
          />
          <img
            src="src/assets/auth/microsoft/icons8-microsoft-authenticator-50.png"
            alt=""
            className="bg-white rounded-full -ml-4 p-1 size-14"
          />
        </div>
        <CardTitle className="text-xl">Autenticação de Duas Etapas</CardTitle>
        <CardDescription className="text-base">
          Leia o QR Code abaixo para verificar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-6 md:grid md:grid-cols-[40%_60%] md:items-end">
        <div className="bg-gray-100 w-60 h-60 rounded-md flex items-center justify-center">
          {qrCode ? (
            <img
              src={qrCode}
              alt="qr-code-auth"
              className="border rounded-md"
            />
          ) : (
            <QrCode className="w-12 h-12 text-gray-200" />
          )}
        </div>
        <div>
          <div className="md:flex items-center justify-center hidden my-5 relative">
            <img
              src="src/assets/auth/google/icons8-google-authenticator-48.png"
              alt=""
              className="bg-white rounded-full p-1 size-14"
            />
            <img
              src="src/assets/auth/microsoft/icons8-microsoft-authenticator-50.png"
              alt=""
              className="bg-white rounded-full -ml-4 p-1 size-14"
            />
          </div>
          <form
            className="w-full flex flex-col items-center justify-center md:items-start gap-6"
            onSubmit={handleFormSubmit}
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="otp-input"
                className="text-base font-medium text-gray-900"
              >
                Código de autenticação
              </label>
              <InputOTP
                id="otp-input"
                maxLength={6}
                required
                value={otpCode.otp_code}
                onChange={(value) => handleOtpInputChange(value)}
              >
                <InputOTPGroup>
                  {Array.from({ length: 6 }, (_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="border-gray-300 text-lg"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {error.length > 0 && (
              <ul className="text-red-500 w-full text-base">
                {error.map((err, index) => (
                  <li key={index} className="list-disc list-inside">
                    {err}
                  </li>
                ))}
              </ul>
            )}

            <Button
              className="w-full text-base h-10 bg-blue-950 hover:bg-blue-950/90 cursor-pointer"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="animate-spin size-5" />
              ) : (
                <ShieldCheck className="size-5" />
              )}
              Verificar
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
