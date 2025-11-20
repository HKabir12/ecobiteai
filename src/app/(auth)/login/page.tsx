"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.target);

    const res = await signIn("credentials", {
      redirect: false,
      email: form.get("email"),
      password: form.get("password"),
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-5"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="input"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="input"
        />

        <Button className="w-full bg-green-600 hover:bg-green-700">
          Login
        </Button>
      </form>
    </div>
  );
}
