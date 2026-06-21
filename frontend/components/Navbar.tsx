"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ProfileData = {
  account_type: "company" | "professional" | null;
  slug: string | null;
};

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [platformName, setPlatformName] = useState("MojProfi");
  const [platformLogo, setPlatformLogo] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data: settings } = await supabase
        .from("platform_settings")
        .select("platform_name, platform_logo_url")
        .limit(1)
        .single();

      if (settings) {
        setPlatformName(settings.platform_name || "MojProfi");
        setPlatformLogo(settings.platform_logo_url || null);
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsLoggedIn(!!session);

      if (!session?.user) {
        setProfile(null);
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("account_type, slug")
        .eq("user_id", session.user.id)
        .maybeSingle();

      setProfile(profileData);
    }

    loadData();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadData();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const publicProfileLink =
    profile?.account_type === "company"
      ? `/company/${profile.slug}`
      : profile?.account_type === "professional"
      ? `/professional/${profile.slug}`
      : "/dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-6">
        <a href="/" className="flex items-center gap-3 text-2xl font-black">
          {platformLogo ? (
            <img
              src={platformLogo}
              alt={platformName}
              className="h-8 w-8 rounded-lg object-cover md:h-10 md:w-10"
            />
          ) : (
            <span className="rounded-lg bg-blue-600 px-2 py-1 text-white">
              M
            </span>
          )}

          <span className="hidden sm:block">{platformName}</span>
        </a>

        <nav className="hidden items-center gap-10 text-sm font-bold text-slate-900 md:flex">
          <a href="/#categories">Kategoritë</a>
          <a href="/#cities">Qytetet</a>
          <a href="/#companies">Për kompanitë</a>
          <a href="/#how">Si funksionon</a>
          <a href="/contact">Kontakt</a>
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold md:text-sm">AL | MK</span>

          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm md:hidden"
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 rounded-full bg-slate-900"></span>
              <span className="block h-0.5 w-5 rounded-full bg-slate-900"></span>
              <span className="block h-0.5 w-5 rounded-full bg-slate-900"></span>
            </span>
          </button>

          <div className="hidden items-center gap-4 md:flex">
            {isLoggedIn ? (
              <>
                <a
                  href="/dashboard"
                  className="rounded-xl border border-slate-200 px-3 py-1 text-sm font-bold text-slate-900"
                >
                  Dashboard
                </a>

                <a
                  href={publicProfileLink}
                  className="rounded-xl bg-blue-600 px-3 py-1 text-sm font-bold text-white shadow"
                >
                  Profili Im
                </a>

                <a
                  href="/logout"
                  className="rounded-xl border border-red-200 px-3 py-1 text-sm font-bold text-red-600"
                >
                  Dil
                </a>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="rounded-xl border border-slate-200 px-3 py-1 text-sm font-bold text-slate-900"
                >
                  Kyçu
                </a>

                <a
                  href="/register"
                  className="rounded-xl bg-blue-600 px-3 py-1 text-sm font-bold text-white shadow"
                >
                  Regjistrohu
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-bold text-slate-900">
            {isLoggedIn ? (
              <>
                <a href="/dashboard">Dashboard</a>
                <a href={publicProfileLink}>Profili Im</a>
                <a href="/logout" className="text-red-600">
                  Dil
                </a>
              </>
            ) : (
              <>
                <a href="/login">Kyçu</a>
                <a href="/register" className="text-blue-600">
                  Regjistrohu
                </a>
              </>
            )}

            <div className="my-2 border-t border-slate-100"></div>

            <a href="/#categories">Kategoritë</a>
            <a href="/#cities">Qytetet</a>
            <a href="/#companies">Për kompanitë</a>
            <a href="/#how">Si funksionon</a>
            <a href="/contact">Kontakt</a>
          </div>
        </div>
      )}
    </header>
  );
}