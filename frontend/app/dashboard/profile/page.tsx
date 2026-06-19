"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DashboardProfileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    async function redirectUser() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push("/login");
        return;
      }

      const accountType =
        userData.user.user_metadata?.account_type || "company";

      if (accountType === "professional") {
        router.push("/dashboard/professional/profile");
        return;
      }

      router.push("/dashboard/company/profile");
    }

    redirectUser();
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-slate-600 font-semibold">
        Duke hapur profilin...
      </p>
    </main>
  );
}