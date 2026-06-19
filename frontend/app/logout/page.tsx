"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      await supabase.auth.signOut();
      router.push("/");
    }

    logout();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="font-bold">Duke dalë...</p>
    </main>
  );
}