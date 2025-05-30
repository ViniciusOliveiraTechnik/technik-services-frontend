import ErrorList from "@/components/error/ErrorList";
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
import { BadgeCheck, Check, Loader2, Lock, LogIn } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  password: z.string().min(10, { message: "Mínimo 10 caracteres" }),
  same_password: z.string().min(10, { message: "Mínimo 10 caracteres" }),
});

export default function ForgotPasswordConfirmForm() {
  const [authParam, setAuthParam] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    setAuthParam(searchParams.get("auth"));
  }, [searchParams]);

  const { forgotPasswordConfirm } = useAuth();

  const [isPending, startTransition] = useTransition();

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", same_password: "" },
  });

  const onSubmit = (values) => {
    startTransition(async () => {
      try {
        const result = await forgotPasswordConfirm(values, authParam);
        setMessage(result.message);
      } catch (err) {
        const parsedErrors = parseErrors(err);
        setErrors(parsedErrors);
      }
    });
  };

  return (
    <Card className="w-full max-w-xl h-screen md:h-auto">
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
          <Lock />
          Recuperação de senha
        </CardTitle>
        <CardDescription className="text-base md:text-lg">
          Preencha o formulário com a nova senha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-lg">Senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite sua nova senha"
                      className="text-base md:text-lg"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="same_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-lg">
                    Repetir senha
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-base md:text-lg"
                      placeholder="Repita sua nova senha"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errors && <ErrorList errors={errors} />}

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
                  <Check className="size-4 md:size-5" />
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
