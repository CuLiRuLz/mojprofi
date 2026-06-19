"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthButtons() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();
      setIsLoggedIn(!!data.user);
    }

    checkUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-4">
        <a
          href="/dashboard/profile"
          className="rounded-xl bg-blue-600 px-6 py-3 text-lg font-bold text-white shadow-md hover:bg-blue-700"
        >
          Dashboard
        </a>

        <button
          onClick={handleLogout}
          className="rounded-xl border border-red-200 bg-white px-6 py-3 text-lg font-bold text-red-600 hover:bg-red-50"
        >
          Dil
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <a
        href="/register"
        className="rounded-xl bg-blue-600 px-8 py-3 text-lg font-bold text-white shadow-md hover:bg-blue-700"
      >
        Regjistrohu
      </a>

      <a
        href="/login"
        className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-lg font-bold text-slate-900 hover:bg-slate-50"
      >
        Hyr
      </a>
    </div>
  );
}