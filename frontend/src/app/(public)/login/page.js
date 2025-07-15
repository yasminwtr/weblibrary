'use client'
import { Form, Input, Button } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { login, verifyToken } from "@/services/auth";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      await login(email, password);

      const userData = await verifyToken();      
      setUser(userData);

      router.replace('/booklist');

    } catch (err) {
      alert(err?.response?.data?.error || "Erro ao fazer login.");
      console.error("Erro no login:", err);
    }
  };

  return (
    <div className="login">
      <Form className="max-w-xs gap-6 border rounded-medium form-login" onSubmit={handleLogin}>
        <h2 className="text-lg font-bold">Entre na sua conta</h2>

        <Input
          isRequired
          errorMessage="Por favor insira um e-mail válido."
          label="Email"
          labelPlacement="outside"
          placeholder="exemplo@email.com"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <Input
          isRequired
          errorMessage="Por favor insira sua senha."
          label="Senha"
          labelPlacement="outside"
          placeholder="•••••"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <Button type="submit" color="primary" className="w-full">
          Entrar
        </Button>
      </Form>
    </div>
  );
}
