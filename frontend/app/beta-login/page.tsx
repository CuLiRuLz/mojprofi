"use client";

import { useState } from "react";

const BETA_PASSWORD = "stendal";

export default function BetaLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== BETA_PASSWORD) {
      setError("Password i gabuar");
      return;
    }

    document.cookie = `mojprofi_beta_access=${BETA_PASSWORD}; path=/; max-age=2592000`;

    window.location.href = "/";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-black text-slate-900">MojProfi Beta</h1>

        <p className="mt-3 text-slate-500">
          Platforma është në testim privat.
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          {error && (
            <p className="mt-3 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700"
          >
            Hyr në MojProfi
          </button>
        </form>
      </div>
    </main>
  );
}