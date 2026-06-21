"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Bell,
  Mail,
  Building2,
  ChartNoAxesColumn,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  MapPin,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Users,
  Wrench,
  X,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [companiesCount, setCompaniesCount] = useState(0);
  const [professionalsCount, setProfessionalsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [systemOnline, setSystemOnline] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminRole, setAdminRole] = useState("Admin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  useEffect(() => {
    async function loadSystemStats() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (user?.email) setAdminEmail(user.email);

      if (user?.id) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (roleData?.role) setAdminRole(roleData.role);
      }

      const { count: companies, error: companiesError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("account_type", "company");

      const { count: professionals, error: professionalsError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("account_type", "professional");

      const { data: pendingProfiles, error: pendingError } =
        await supabase.rpc("admin_get_profiles_by_status", {
          p_status: "pending",
        });

      const { count: unreadCount } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);

      if (companiesError || professionalsError || pendingError) {
        setSystemOnline(false);
        return;
      }

      setCompaniesCount(companies ?? 0);
      setProfessionalsCount(professionals ?? 0);
      setPendingCount(pendingProfiles?.length ?? 0);
      setUnreadMessages(unreadCount ?? 0);
      setSystemOnline(true);
    }

    loadSystemStats();

    window.addEventListener("contact-messages-updated", loadSystemStats);

    return () => {
      window.removeEventListener("contact-messages-updated", loadSystemStats);
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  function navClass(href: string) {
    const isActive =
      href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

    return `flex items-center gap-3 rounded-xl px-4 py-2.5 transition ${
      isActive
        ? "bg-white/10 text-white"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;
  }

  const adminLinks = (
    <>
      <Link href="/admin" className={navClass("/admin")} onClick={() => setMobileMenuOpen(false)}>
        <LayoutDashboard size={19} /> Dashboard
      </Link>

      <Link href="/admin/companies" className={navClass("/admin/companies")} onClick={() => setMobileMenuOpen(false)}>
        <Building2 size={19} /> Kompanitë
      </Link>

      <Link href="/admin/professionals" className={navClass("/admin/professionals")} onClick={() => setMobileMenuOpen(false)}>
        <CircleUserRound size={19} /> Mjeshtrit / Profesionistët
      </Link>

      <Link href="/admin/pending" className={navClass("/admin/pending")} onClick={() => setMobileMenuOpen(false)}>
        <Users size={19} /> Në pritje
      </Link>

      <Link href="/admin/approved" className={navClass("/admin/approved")} onClick={() => setMobileMenuOpen(false)}>
        <CheckCircle2 size={19} /> Të aprovuara
      </Link>

      <Link href="/admin/rejected" className={navClass("/admin/rejected")} onClick={() => setMobileMenuOpen(false)}>
        <X size={19} /> Refuzimet
      </Link>

      <Link href="/admin/reviews" className={navClass("/admin/reviews")} onClick={() => setMobileMenuOpen(false)}>
        <Star size={19} /> Reviews / Vlerësimet
      </Link>

      <Link href="/admin/reports" className={navClass("/admin/reports")} onClick={() => setMobileMenuOpen(false)}>
        <ClipboardList size={19} /> Raportimet
      </Link>

      <Link href="/admin/verifications" className={navClass("/admin/verifications")} onClick={() => setMobileMenuOpen(false)}>
        <ShieldCheck size={19} /> Verifikimet
      </Link>

      <Link href="/admin/users" className={navClass("/admin/users")} onClick={() => setMobileMenuOpen(false)}>
        <Users size={19} /> Përdoruesit
      </Link>

      <Link href="/admin/roles" className={navClass("/admin/roles")} onClick={() => setMobileMenuOpen(false)}>
        <FolderKanban size={19} /> Rolet & Lejet
      </Link>

      <Link href="/admin/categories" className={navClass("/admin/categories")} onClick={() => setMobileMenuOpen(false)}>
        <FolderKanban size={19} /> Kategoritë
      </Link>

      <Link href="/admin/cities" className={navClass("/admin/cities")} onClick={() => setMobileMenuOpen(false)}>
        <MapPin size={19} /> Qytetet
      </Link>

      <Link href="/admin/analytics" className={navClass("/admin/analytics")} onClick={() => setMobileMenuOpen(false)}>
        <ChartNoAxesColumn size={19} /> Analitika
      </Link>

      <Link href="/admin/settings" className={navClass("/admin/settings")} onClick={() => setMobileMenuOpen(false)}>
        <Settings size={19} /> Cilësimet
      </Link>
    </>
  );

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[280px] bg-[#0f172a] text-white lg:block">
        <div className="flex h-full flex-col px-5 py-5">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <Wrench size={22} />
            </div>
            <span className="text-2xl font-black tracking-tight">MojProfi</span>
          </Link>

          <nav className="mt-4 space-y-0 text-[15px] font-bold">
            {adminLinks}
          </nav>

          <div className="my-4 border-t border-white/10" />

          <div className="mt-auto px-4 pb-4">
            <p className="text-sm font-black text-white">Sistemi</p>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-300">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  systemOnline ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
              {systemOnline ? "Online" : "Offline"}
            </div>

            <div className="mt-3 space-y-1 text-sm text-slate-300">
              <p>
                <span className="text-slate-500">Versioni:</span>{" "}
                <span className="font-medium text-white">1.0.0-beta</span>
              </p>
              <p>
                <span className="text-slate-500">Kompani:</span>{" "}
                <span className="font-medium text-white">{companiesCount}</span>
              </p>
              <p>
                <span className="text-slate-500">Profesionistë:</span>{" "}
                <span className="font-medium text-white">{professionalsCount}</span>
              </p>
              <p>
                <span className="text-slate-500">Pending:</span>{" "}
                <span className="font-medium text-white">{pendingCount}</span>
              </p>
            </div>
          </div>
        </div>
      </aside>

      <section className="min-h-screen overflow-x-hidden lg:pl-[280px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl p-2 hover:bg-slate-100 lg:hidden"
            >
              <LayoutDashboard size={21} />
            </button>

            <h1 className="text-lg font-black">Dashboard</h1>
          </div>

          <div className="flex items-center gap-3 lg:gap-5">
            <div className="hidden h-9 w-[330px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 md:flex">
              <Search size={16} className="text-slate-400" />
              <span className="text-sm text-slate-400">Kërko...</span>
              <span className="ml-auto rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-400">
                Ctrl K
              </span>
            </div>

            <Link
              href="/admin/messages"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100"
              title="Mesazhet"
            >
              <Mail size={21} />
              {unreadMessages > 0 && (
                <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-black text-white">
                  {unreadMessages}
                </span>
              )}
            </Link>

            <Link
              href="/admin/pending"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100"
              title="Profile në pritje"
            >
              <Bell size={21} />
              {pendingCount > 0 && (
                <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-black text-white">
                  {pendingCount}
                </span>
              )}
            </Link>

            <div className="relative">
              <button
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                className="flex items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-slate-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-black uppercase">
                  {adminEmail ? adminEmail.charAt(0) : "A"}
                </div>

                <div className="hidden text-left md:block">
                  <p className="text-sm font-black">Admin</p>
                  <p className="text-xs font-medium capitalize text-slate-500">
                    {adminRole.replace("_", " ")}
                  </p>
                </div>

                <ChevronDown size={16} className="text-slate-400" />
              </button>

              {adminMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="text-sm font-bold text-slate-900">Admin</p>
                    <p className="truncate text-xs text-slate-500">
                      {adminEmail}
                    </p>
                  </div>

                  <Link
                    href="/admin/users"
                    className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    onClick={() => setAdminMenuOpen(false)}
                  >
                    <Users size={16} />
                    Përdoruesit
                  </Link>

                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    onClick={() => setAdminMenuOpen(false)}
                  >
                    <Settings size={16} />
                    Cilësimet
                  </Link>

                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Dil
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
            <div className="flex h-full w-[280px] flex-col bg-[#0f172a] p-5 text-white">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                    <Wrench size={22} />
                  </div>
                  <span className="text-xl font-black">MojProfi</span>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl p-2 hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-1 overflow-y-auto text-sm font-bold">
                {adminLinks}
              </nav>

              <div className="mt-auto border-t border-white/10 pt-4 text-sm text-slate-300">
                <p className="font-black text-white">Sistemi</p>
                <p className="mt-2">
                  {systemOnline ? "🟢 Online" : "🔴 Offline"}
                </p>
                <p className="mt-1">Kompani: {companiesCount}</p>
                <p>Profesionistë: {professionalsCount}</p>
                <p>Pending: {pendingCount}</p>
              </div>
            </div>
          </div>
        )}

        {children}
      </section>
    </main>
  );
}