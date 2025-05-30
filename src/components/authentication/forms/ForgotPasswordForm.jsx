import ErroList from "@/components/error/ErrorList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { parseErrors } from "@/utils/errors-util";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, Loader2, Lock, LogIn, Send } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string()
    .min(5, { message: "O e-mail é obrigatório" })
    .email({ message: "Digite um e-mail válido" }),
});

export default function ForgotPassowordForm() {
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const { forgotPassword } = useAuth();

  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values) => {
    startTransition(async () => {
      try {
        const result = await forgotPassword(values);
        setMessage(result.message);
        setTimeLeft(30);
      } catch (err) {
        console.log(err);
        const parsedErrors = parseErrors(err);
        setErrors(parsedErrors);
      }
    });
  };

  return (
    <Card className="w-full h-screen max-w-xl md:h-auto">
      <CardHeader>
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            className="w-1/4 cursor-pointer text-base md:text-lg"
            onClick={() => {
              navigate("/login");
            }}
          >
            <LogIn className="size-4 md:size-5" />
            Entrar
          </Button>
        </div>
        <CardTitle className="text-xl md:text-2xl flex items-center justify-start gap-2">
          <Lock className="size-5 md:size-6" />
          Recuperar senha
        </CardTitle>
        <CardDescription className="text-base md:text-lg">
          Preencha o seu endereço de e-mail para receber o link de recuperação
          de senha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full gap-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-lg flex items-center justify-between">
                    <span>E-mail</span>
                    {message && (
                      <div className="font-normal">
                        {timeLeft > 0 ? (
                          <span className="text-base md:text-lg text-sky-600 hover:text-sky-600/80">
                            Reenviar em {timeLeft}s
                          </span>
                        ) : (
                          <button
                            className={`text-base md:text-lg text-sky-600 hover:text-sky-600/80 underline cursor-pointer ${
                              timeLeft === 0 ? "" : "hidden"
                            }`}
                            type="submit"
                          >
                            Reenviar e-mail
                          </button>
                        )}
                      </div>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-base md:text-lg"
                      placeholder="seu@e-mail"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errors.length > 0 && <ErroList errors={errors} />}

            {message ? (
              <div className="flex items-center justify-center gap-5 text-blue-600">
                <BadgeCheck />
                <span className="text-base md:text-lg">{message}</span>
              </div>
            ) : (
              <Button
                disabled={isPending}
                className="w-full text-base md:text-lg h-10 cursor-pointer bg-blue-950 hover:bg-blue-950/90"
              >
                {isPending ? (
                  <Loader2 className="animate-spin size-4 md:size-5" />
                ) : (
                  <Send className="size-4 md:size-5" />
                )}
                Enviar
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
