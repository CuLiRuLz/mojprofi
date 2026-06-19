"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CompanyRegisterPage() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!companyName || !email || !password || !confirmPassword) {
      setMessage("Ju lutem plotësoni të gjitha fushat.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Fjalëkalimet nuk përputhen.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          account_type: "company",
          company_name: companyName,
        },
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Llogaria u krijua me sukses.");

    setTimeout(() => {
      router.push("/dashboard/profile");
    }, 800);
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-5 text-slate-900">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[26px] bg-white shadow-xl lg:grid-cols-[0.82fr_1.18fr]">
        <section className="bg-blue-50 px-8 py-8 lg:px-10">
          <Link href="/" className="flex items-center gap-2 text-xl font-black">
            <span className="text-blue-600">⌂</span>
            MojProfi
          </Link>

          <div className="mt-12">
            <h1 className="text-4xl font-black leading-tight tracking-tight">
              Krijo llogarinë <br /> e kompanisë
            </h1>

            <p className="mt-4 max-w-sm text-base leading-relaxed text-slate-600">
              Thjesht, shpejt dhe profesional. Bëhu pjesë e platformës më të
              madhe të profesionistëve.
            </p>

            <div className="mt-6 h-1 w-12 rounded-full bg-blue-600" />
          </div>

          <div className="mt-8 space-y-5">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-lg text-blue-600 shadow-sm">
                🏢
              </div>
              <div>
                <h3 className="font-bold">Profil profesional për kompaninë</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Prezanto biznesin tënd në mënyrë profesionale.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-lg text-blue-600 shadow-sm">
                💼
              </div>
              <div>
                <h3 className="font-bold">Shto projekte dhe shërbime</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Trego punimet dhe shërbimet që ofron.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-lg text-blue-600 shadow-sm">
                👥
              </div>
              <div>
                <h3 className="font-bold">Merr kërkesa nga klientët</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Lidhu drejtpërdrejt me klientët e interesuar.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-lg text-blue-600 shadow-sm">
                🛡️
              </div>
              <div>
                <h3 className="font-bold">Rrit besueshmërinë</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Ndërto reputacion dhe fito besimin e klientëve.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-10 text-xs text-slate-500">
            🔒 Të dhënat tuaja janë të sigurta. Ne respektojmë privatësinë tuaj.
          </p>
        </section>

        <section className="flex items-center justify-center px-8 py-8 lg:px-16">
          <div className="w-full max-w-xl">
            <h2 className="text-2xl font-black">Informacion bazë</h2>
            <p className="mt-2 text-base text-slate-600">
              Plotëso të dhënat bazë për të krijuar llogarinë.
            </p>

            <form onSubmit={handleRegister} className="mt-7 space-y-4">
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base outline-none focus:border-blue-500"
                placeholder="Emri i kompanisë"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />

              <input
                type="email"
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base outline-none focus:border-blue-500"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base outline-none focus:border-blue-500"
                placeholder="Fjalëkalimi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                type="password"
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base outline-none focus:border-blue-500"
                placeholder="Konfirmo fjalëkalimin"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                disabled={loading}
                className="w-full rounded-2xl bg-blue-600 px-5 py-4 text-base font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Duke u regjistruar..." : "Regjistro Kompaninë →"}
              </button>

              {message && (
                <p className="text-center text-sm font-semibold text-slate-700">
                  {message}
                </p>
              )}
            </form>

            <p className="mt-5 text-center text-sm text-slate-600">
              Ke llogari?{" "}
              <Link href="/login" className="font-bold text-blue-600">
                Hyr këtu
              </Link>
            </p>

            <p className="mt-5 text-center text-xs text-slate-500">
              Duke u regjistruar, pranoni{" "}
              <span className="font-semibold text-blue-600">
                Kushtet e Përdorimit
              </span>{" "}
              dhe{" "}
              <span className="font-semibold text-blue-600">
                Politikën e Privatësisë
              </span>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}