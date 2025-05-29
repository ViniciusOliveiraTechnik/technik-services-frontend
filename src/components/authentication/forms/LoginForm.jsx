import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, Loader2 } from "lucide-react";
import { parseErrors } from "@/utils/errors-util";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [isPending, startTransition] = useTransition();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState([]);

  const handleCredentialsChange = (e) => {
    const { id, value } = e.target;

    setCredentials((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (errors.length) setErrors([]);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrors([]);

    startTransition(async () => {
      try {
        const result = await login(credentials);
        navigate("/auth", { state: { qrCode: result.qr_code } });
      } catch (err) {
        const parsedErrors = parseErrors(err) || ["Erro ao fazer login"];

        setErrors(parsedErrors);
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl h-screen md:h-auto md:px-2">
      <CardHeader>
        <div className="flex items-center justify-center">
          <img
            src="src/assets/logo-technik.png"
            alt="logo-technik"
            className="w-40 md:w-50 h-auto"
          />
        </div>
        <CardTitle className="text-xl md:text-2xl">
          Boas vindas de volta
        </CardTitle>
        <CardDescription className="text-base md:text-lg">
          Entre para acessar os recursos
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="flex flex-col gap-6"
          onSubmit={handleFormSubmit}
          method="post"
        >
          <div>
            <label htmlFor="email" className="block mb-1 text-base md:text-lg">
              Email
            </label>
            <Input
              type="text"
              id="email"
              className="w-full text-base md:text-lg"
              placeholder="m@example.com"
              onChange={handleCredentialsChange}
              required={true}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="text-base md:text-lg">
                Senha
              </label>
              <Link className="text-base md:text-lg text-sky-600 hover:text-sky-600/80 underline">
                Esqueci minha senha
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              className="w-full text-base md:text-lg"
              onChange={handleCredentialsChange}
              required={true}
            />
          </div>

          {errors.length > 0 && (
            <ul className="text-red-500">
              {errors.map((error, index) => (
                <li key={index} className="list-disc list-inside">
                  {error}
                </li>
              ))}
            </ul>
          )}

          <Button
            className="w-full text-base md:text-lg h-10 md:h-11 cursor-pointer bg-blue-950 hover:bg-blue-950/90"
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="animate-spin size-4 md:size-5" />
            ) : (
              <KeyRound className="size-4 md:size-5" />
            )}
            <span>Entrar</span>
          </Button>

          <span className="text-center text-base md:text-lg">
            Não tem uma conta?{" "}
            <Link className="text-sky-600 hover:text-sky-600/80 underline">
              Cadastre-se
            </Link>
          </span>
        </form>
      </CardContent>
    </Card>
  );
}
