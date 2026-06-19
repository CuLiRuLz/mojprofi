"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (password.length < 6) {
      setMessage("Fjalëkalimi duhet të ketë së paku 6 karaktere.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Fjalëkalimet nuk përputhen.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Fjalëkalimi u ndryshua me sukses.");
    setTimeout(() => router.push("/login"), 1500);
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50">
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="mx-auto max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-blue-100/50">
            <h1 className="text-3xl font-black">Vendos fjalëkalim të ri</h1>

            <p className="mt-3 text-sm text-slate-600">
              Shkruaj fjalëkalimin e ri për llogarinë tënde.
            </p>

            <form onSubmit={handleUpdate} className="mt-6 space-y-5">
              <div>
                <label className="text-sm font-bold text-slate-800">
                  Fjalëkalimi i ri
                </label>

                <input
                  required
                  type="password"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-800">
                  Përsërit fjalëkalimin
                </label>

                <input
                  required
                  type="password"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Duke ruajtur..." : "Ndrysho fjalëkalimin"}
              </button>

              {message && (
                <p className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                  {message}
                </p>
              )}
            </form>
          </div>
        </section>
      </main>
    </>
  );
}