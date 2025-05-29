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

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import ContactInput from "../inputs/ContactInput";
import CPFInput from "../inputs/CPFInput";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  first_name: z.string().min(2, { message: "Mínimo 2 caracteres" }),
  last_name: z.string().min(2, { message: "Minímo 2 caracteres" }),
  email: z
    .string()
    .min(5, { message: "O email é obrigatório" })
    .email({ message: "Digite um e-mail válido" }),
  password: z.string().min(10, { message: "Mínimo 10 caracteres" }),
  repeat_password: z.string().min(10, { message: "Mínimo 10 caracteres" }),
  phone_number: z.string().min(1, {
    message: "O número de contato deve ser válido",
  }),
  cpf: z.string().min(11, { message: "Digite um número de CPF válido" }),
});

export default function RegisterForm() {
  const { register } = useAuth();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      repeat_password: "",
      phone_number: "",
      cpf: "",
    },
  });

  function onSubmit(values) {
    register(values);
  }

  return (
    <Card className="w-full min-h-screen">
      <CardHeader>
        <CardTitle>Cadastrar</CardTitle>
        <CardDescription>
          Preencha suas informações para concluir o cadastro
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome" className="w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input placeholder="Sobrenome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} />
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
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite sua senha"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repeat_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repetir senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite sua senha novamente"
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
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contato</FormLabel>
                  <FormControl>
                    <ContactInput {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <CPFInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ul className="text-red-500">
              <li className="list-disc list-inside">
                Erro Lorem ipsum dolor sit amet
              </li>
              <li className="list-disc list-inside">
                Erro Lorem ipsum dolor sit amet
              </li>
              <li className="list-disc list-inside">
                Erro Lorem ipsum dolor sit amet
              </li>
              <li className="list-disc list-inside">
                Erro Lorem ipsum dolor sit amet
              </li>
              <li className="list-disc list-inside">
                Erro Lorem ipsum dolor sit amet
              </li>
              <li className="list-disc list-inside">
                Erro Lorem ipsum dolor sit amet
              </li>
            </ul>

            <Button type="submit">
              <UserPlus />
              Cadastrar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
