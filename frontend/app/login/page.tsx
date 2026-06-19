"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    const { data: adminRole } = await supabase
  .from("user_roles")
  .select("role")
  .eq("user_id", data.user.id)
  .maybeSingle();

if (
  adminRole &&
  ["super_admin", "admin", "moderator", "operator"].includes(adminRole.role)
) {
  router.push("/admin");
  return;
}

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("slug, account_type")
      .eq("user_id", data.user.id)
      .single();

    if (profileError || !profile) {
      router.push("/dashboard/profile");
      return;
    }

    if (profile.account_type === "company") {
      router.push(`/company/${profile.slug}`);
      return;
    }

    if (profile.account_type === "professional") {
      router.push(`/professional/${profile.slug}`);
      return;
    }

    router.push("/dashboard/profile");
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50 text-slate-900">
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="text-center">
            <span className="inline-flex rounded-full border border-blue-100 bg-white px-4 py-1 text-xs font-bold text-blue-600 shadow-sm">
              Mirë se vjen përsëri
            </span>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl">
              Hyr në MojProfi
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
              Hyr me email dhe fjalëkalim për të menaxhuar profilin,
              projektet dhe të dhënat e tua.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-blue-100/50">
            <form onSubmit={handleLogin}>
              <div className="grid gap-5">
                <div>
                  <label className="text-sm font-bold text-slate-800">
                    Email
                  </label>

                  <input
                    type="email"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-800">
                    Fjalëkalimi
                  </label>

                  <input
                    type="password"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="text-right">
  <Link
    href="/forgot-password"
    className="text-sm font-bold text-blue-600 hover:text-blue-700"
  >
    Harrova fjalëkalimin?
  </Link>
</div>

                <button className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700">
                  Hyr në llogari →
                </button>

                {message && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                    {message}
                  </p>
                )}
              </div>
            </form>

            <div className="mt-6 rounded-2xl bg-blue-50/80 p-4 text-center text-sm text-slate-600">
              Nuk ke llogari?{" "}
              <Link href="/register" className="font-bold text-blue-600">
                Regjistrohu tani
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}