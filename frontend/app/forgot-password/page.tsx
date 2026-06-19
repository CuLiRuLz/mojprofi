"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Linku për resetimin e fjalëkalimit u dërgua në email.");
    setEmail("");
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50">
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="mx-auto max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-blue-100/50">
            <h1 className="text-3xl font-black">Harrova fjalëkalimin</h1>

            <p className="mt-3 text-sm text-slate-600">
              Shkruaj email-in dhe do të dërgojmë një link për resetim.
            </p>

            <form onSubmit={handleReset} className="mt-6 space-y-5">
              <div>
                <label className="text-sm font-bold text-slate-800">
                  Email
                </label>

                <input
                  required
                  type="email"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Duke dërguar..." : "Dërgo linkun"}
              </button>

              {message && (
                <p className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                  {message}
                </p>
              )}
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
              <Link href="/login" className="font-bold text-blue-600">
                Kthehu te login
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}