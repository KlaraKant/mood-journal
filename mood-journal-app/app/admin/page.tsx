"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function login() {
    setError("");

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      router.push("/dashboard");
    } catch {
      setError(
        "Neplatný e-mail nebo heslo."
      );
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-pink-500">
          🔐 Admin
        </h1>

        <p className="text-center text-gray-500 mt-3">
          Přihlášení administrátora
        </p>

        {error && (
          <div className="mt-5 rounded-2xl bg-red-100 border border-red-300 p-3 text-center text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8">
          <label className="font-semibold">
            E-mail
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="mt-2 w-full border rounded-2xl p-3"
            placeholder="admin@email.cz"
          />
        </div>

        <div className="mt-5">
          <label className="font-semibold">
            Heslo
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="mt-2 w-full border rounded-2xl p-3"
            placeholder="••••••••"
          />
        </div>

        <button
          onClick={login}
          className="mt-8 w-full bg-pink-500 text-white p-4 rounded-2xl hover:bg-pink-600 transition"
        >
          Přihlásit se
        </button>
      </div>
    </main>
  );
}