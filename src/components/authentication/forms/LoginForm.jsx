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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z
    .string()
    .min(5, { message: "O e-mail é obrigatório" })
    .email({ message: "Digite um e-mail válido" }),
  password: z.string().min(10, { message: "Mínimo 10 caracteres" }),
});

export default function LoginForm() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [isPending, startTransition] = useTransition();

  const [errors, setErrors] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values) => {
    startTransition(async () => {
      try {
        const result = await login(values);
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
          Bem vindo novamente
        </CardTitle>
        <CardDescription className="text-base md:text-lg">
          Entre para acessar os recursos
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-lg">E-mail</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full text-base md:text-lg"
                      placeholder="seu@e-mail.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-lg flex items-center justify-between">
                    <span>Senha</span>
                    <Link
                      className="text-base md:text-lg text-sky-600 hover:text-sky-600/80 underline cursor-pointer font-normal"
                      to="/forgot-password"
                    >
                      Esqueci minha senha
                    </Link>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full text-base md:text-lg"
                      placeholder="Digite sua senha"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              className="w-full text-base md:text-lg h-10 cursor-pointer bg-blue-950 hover:bg-blue-950/90"
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

            <div className="flex items-center justify-center">
              <span className="text-base md:text-lg">
                Não tem uma conta?{" "}
                <Link
                  className="text-base md:text-lg text-sky-600 hover:text-sky-600/80 underline cursor-pointer font-normal"
                  to="/register"
                >
                  Cadastre-se
                </Link>
              </span>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
