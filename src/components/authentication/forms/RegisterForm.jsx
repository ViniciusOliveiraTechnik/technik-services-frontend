import { useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Button } from "@/components/ui/button";
import { Loader2, LogIn, UserPlus, Users } from "lucide-react";

import ContactInput from "../inputs/ContactInput";
import CPFInput from "../inputs/CPFInput";

import { useAuth } from "@/contexts/AuthContext";
import { parseErrors } from "@/utils/errors-util";
import ErroList from "@/components/error/ErrorList";

const formSchema = z.object({
  first_name: z.string().min(2, { message: "Mínimo 2 caracteres" }),
  last_name: z.string().min(2, { message: "Minímo 2 caracteres" }),
  email: z
    .string()
    .min(5, { message: "O e-mail é obrigatório" })
    .email({ message: "Digite um e-mail válido" }),
  password: z.string().min(10, { message: "Mínimo 10 caracteres" }),
  same_password: z.string().min(10, { message: "Mínimo 10 caracteres" }),
  phone_number: z.string().min(1, {
    message: "O número de contato deve ser válido",
  }),
  cpf: z.string().min(11, { message: "Digite um número de CPF válido" }),
});

export default function RegisterForm() {
  const { register } = useAuth();

  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      same_password: "",
      phone_number: "",
      cpf: "",
    },
  });

  function onSubmit(values) {
    startTransition(async () => {
      try {
        const result = await register(values);
        console.log(result);
        navigate("/login");
      } catch (err) {
        console.error(err);
        const parsedErrors = parseErrors(err);
        setErrors(parsedErrors);
      }
    });
  }

  return (
    <Card className="w-full max-w-3xl min-h-screen md:min-h-fit md:my-10">
      <CardHeader className="space-y-6">
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
        <div>
          <CardTitle className="text-xl md:text-2xl flex items-center justify-start gap-2">
            <Users className="size-5 md:size-6" />
            Cadastrar
          </CardTitle>
          <CardDescription className="text-base md:text-lg">
            Preencha suas informações para concluir o cadastro
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Nome e Sobrenome */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base md:text-lg">Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome"
                        className="w-full text-base md:text-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm md:text-base" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base md:text-lg">
                      Sobrenome
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Sobrenome"
                        className="text-base md:text-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm md:text-base" />
                  </FormItem>
                )}
              />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-lg">E-mail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="seu@e-mail.com"
                      className="text-base md:text-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm md:text-base" />
                </FormItem>
              )}
            />

            {/* Senha */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-lg">Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Digite sua senha"
                      className="text-base md:text-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm md:text-base" />
                </FormItem>
              )}
            />

            {/* Repetir senha */}
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
                      type="password"
                      placeholder="Digite sua senha novamente"
                      className="text-base md:text-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm md:text-base" />
                </FormItem>
              )}
            />

            {/* Telefone */}
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-lg">
                    Contato
                  </FormLabel>
                  <FormControl>
                    <ContactInput
                      {...field}
                      value={field.value || ""}
                      className="text-base md:text-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-sm md:text-base" />
                </FormItem>
              )}
            />

            {/* CPF */}
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-lg">CPF</FormLabel>
                  <FormControl>
                    <CPFInput {...field} className="text-base md:text-lg" />
                  </FormControl>
                  <FormMessage className="text-sm md:text-base" />
                </FormItem>
              )}
            />

            {/* Erros gerais */}

            {errors.length > 0 && <ErroList errors={errors} />}

            {/* Botão */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center items-center gap-2 text-base md:text-lg h-10 cursor-pointer bg-blue-950 hover:bg-blue-950/90"
            >
              {isPending ? (
                <Loader2 className="animate-spin size-4 md:size-5" />
              ) : (
                <UserPlus className="size-4 md:size-5" />
              )}
              Cadastrar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
