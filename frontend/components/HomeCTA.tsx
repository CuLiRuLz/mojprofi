"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HomeCTA() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getSession();
      setLoggedIn(!!data.session);
    }

    checkUser();
  }, []);

  return (
    <section className="mx-auto max-w-[1500px] px-8 py-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-slate-900 p-12 text-center text-white shadow-2xl">
        <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-blue-300/20 blur-3xl"></div>

        <h2 className="text-4xl font-extrabold">
          {loggedIn ? "Menaxho profilin tënd" : "Ke kompani ose je mjeshtër?"}
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
          {loggedIn
            ? "Shko te dashboard-i për të menaxhuar profilin, projektet dhe të dhënat."
            : "Krijo profilin tënd, shto projektet dhe bëhu i dukshëm për klientët në Maqedoni dhe diasporë."}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          {loggedIn ? (
            <a
              href="/dashboard"
              className="rounded-xl bg-white px-8 py-4 text-lg font-extrabold text-blue-600"
            >
              Shko te Dashboard
            </a>
          ) : (
            <>
              <a
                href="/register/company"
                className="rounded-xl bg-white px-8 py-4 text-lg font-extrabold text-blue-600"
              >
                Regjistro Kompaninë
              </a>

              <a
                href="/register/professional"
                className="rounded-xl border border-white px-8 py-4 text-lg font-extrabold text-white"
              >
                Regjistrohu si Mjeshtër
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
}