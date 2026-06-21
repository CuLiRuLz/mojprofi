"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";



type Profile = {
  id: number;
  account_type: string | null;
  slug: string | null;
  company_name: string | null;
  first_name: string | null;
  last_name: string | null;
  profession: string | null;
  phone: string | null;
  city_id: number | null;
  about: string | null;
  logo_url: string | null;
  cover_url: string | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [favoritesCount, setFavoritesCount] = useState(0);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);

  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projectsCount, setProjectsCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
  setLoading(false);
  router.push("/login");
  return; 
}

      const { data: roleData } = await supabase
  .from("user_roles")
  .select("role")
  .eq("user_id", userData.user.id)
  .maybeSingle();

if (
  roleData &&
  ["super_admin", "admin", "moderator", "operator"].includes(roleData.role)
) {
  router.push("/admin");
  return;
}

      setEmail(userData.user.email ?? null);

      const { data: profileData } = await supabase
        .from("profiles")
        .select(
          "id, account_type, slug, company_name, first_name, last_name, profession, phone, city_id, about, logo_url, cover_url"
        )
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);

        const { count: projectCount } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true })
          .eq("profile_id", profileData.id);

        setProjectsCount(projectCount || 0);

        const { count: reviewCount } = await supabase
          .from("reviews")
          .select("*", { count: "exact", head: true })
          .eq("profile_id", profileData.id);

        setReviewsCount(reviewCount || 0);

        const { count: favoriteCount } = await supabase
  .from("favorites")
  .select("*", { count: "exact", head: true })
  .eq("user_id", userData.user.id);

setFavoritesCount(favoriteCount || 0);

const { data: latestProjects } = await supabase
  .from("projects")
  .select("id, title, description, created_at, photo_url")
  .eq("profile_id", profileData.id)
  .order("created_at", { ascending: false })
  .limit(3);

setRecentProjects(latestProjects || []);
      }

      setLoading(false);
    }

    loadDashboard();
  }, [router]);

  const accountType = profile?.account_type;
  const profileSlug = profile?.slug;

  const displayName =
    accountType === "professional"
      ? `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() ||
        "Profesionist"
      : profile?.company_name || "Kompania ime";

  const roleLabel =
  accountType === "professional"
    ? "Mjeshtër i Pavarur"
    : accountType === "company"
    ? "Kompani"
    : "Profil";

  const editProfileUrl =
  accountType === "professional"
    ? "/dashboard/professional/profile"
    : accountType === "company"
    ? "/dashboard/company/profile"
    : "/dashboard";

  const publicProfileUrl =
    accountType === "professional"
      ? `/professional/${profileSlug}`
      : `/company/${profileSlug}`;

  const completionItems = [
    { label: "Logo", done: Boolean(profile?.logo_url) },
    { label: "Cover", done: Boolean(profile?.cover_url) },
    { label: "Telefon", done: Boolean(profile?.phone) },
    { label: "Qytet", done: Boolean(profile?.city_id) },
    { label: "Përshkrim", done: Boolean(profile?.about) },
    { label: "Projekt", done: projectsCount > 0 },
  ];

  const completionPercent = Math.round(
    (completionItems.filter((item) => item.done).length /
      completionItems.length) *
      100
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
        Duke ngarkuar dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <aside className="fixed left-0 top-0 hidden h-screen w-60 border-r border-slate-200 bg-white p-4 lg:block">
          <a href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white">
              M
            </span>
            <span className="text-xl font-black">MojProfi</span>
          </a>

          <nav className="mt-8 space-y-1.5 text-sm">
            <a className="block rounded-xl bg-blue-50 px-4 py-3 font-black text-blue-700" href="/dashboard">
              Dashboard
            </a>
            <a
  className="block rounded-xl px-4 py-3 font-bold text-slate-600 hover:bg-slate-50"
  href={publicProfileUrl}
>
  Profili Publik
</a>
            <a className="block rounded-xl px-4 py-3 font-bold text-slate-600 hover:bg-slate-50" href="/dashboard/projects">
              Projektet
            </a>
            <a className="block rounded-xl px-4 py-3 font-bold text-slate-600 hover:bg-slate-50" href="/dashboard/reviews">
              Vlerësimet
            </a>
            <a className="block rounded-xl px-4 py-3 font-bold text-slate-600 hover:bg-slate-50" href="/dashboard/favorites">
              Favoritët
            </a>
          </nav>

          <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-blue-600 p-4 text-white">
            <p className="text-sm font-black">Rrit dukshmërinë</p>
            <p className="mt-1 text-xs text-blue-100">
              Paketat premium do të shtohen më vonë.
            </p>
          </div>
        </aside>

        <div className="min-h-screen flex-1 lg:ml-60">
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between px-5 py-2.5">
              <input
                className="hidden w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none md:block"
                placeholder="Kërko shërbime, kategori, kompani..."
              />

              <div className="ml-auto flex items-center gap-3 text-sm">
                <a href="/" className="font-bold text-slate-600">
                  Ballina
                </a>

                <a
                  href="/logout"
                  className="rounded-xl border border-red-200 px-4 py-2 font-black text-red-600"
                >
                  Dil
                </a>
              </div>
            </div>
          </header>

          <div className="px-5 py-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-black text-blue-600">Dashboard</p>
                <h1 className="mt-1 text-2xl font-black">
                  Mirë se erdhe, {displayName}! 👋
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Përmbledhja e aktivitetit të profilit tënd.
                </p>
                <p className="mt-1 text-xs text-slate-500">Kyçur si: {email}</p>
                <p className="mt-1 text-xs font-black text-red-600">
  DEBUG: {accountType || "NUK KA ACCOUNT TYPE"} / ID: {profile?.id}
</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {profileSlug && (
                  <a
                    href={publicProfileUrl}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black shadow-sm"
                  >
                    Shiko profilin publik
                  </a>
                )}

                <a
                  href="/dashboard/projects"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-black text-white shadow-sm"
                >
                  Shto projekt +
                </a>

                <a
                  href={editProfileUrl}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black shadow-sm"
                >
                  Edito profilin
                </a>
              </div>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_1fr_0.9fr]">
              <section className="rounded-2xl bg-white p-4 shadow-sm">
                <h2 className="text-lg font-black">Plotësimi i profilit</h2>

                <div className="mt-4 flex items-center gap-5">
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[8px] border-blue-600 text-2xl font-black">
                    {completionPercent}%
                  </div>

                  <div className="flex-1 space-y-3">
                    {completionItems.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between text-sm font-bold"
                      >
                        <span>{item.label}</span>
                        <span>{item.done ? "✅" : "❌"}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {completionPercent < 100 && (
                  <div className="mt-4 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
                    Shto të dhënat që mungojnë për ta kompletuar profilin.
                  </div>
                )}
              </section>

              <section className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black">Statistikat</h2>
                  
                </div>

                <div className="mt-4 grid gap-1 sm:grid-cols-2">
                  {[
                      ["📁", "Projekte", projectsCount],
                      ["⭐", "Vlerësime", reviewsCount],
                      ["❤️", "Favoritë", favoritesCount],
                      ["👁️", "Shikime", 0],
                  ].map(([icon, label, value]) => (
                    <div key={label} className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-2xl font-black">{value}</p>
                      <div className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-600">
  <span>{icon}</span>
  <span>{label}</span>
</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black">Verifikimi</h2>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">
                    Në pritje
                  </span>
                </div>

                <div className="mt-5 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl">
                    🛡️
                  </div>
                  <p className="mt-3 text-xl font-black">Level 1</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {roleLabel} ende nuk është verifikuar plotësisht.
                  </p>
                </div>

                <a
                  href={editProfileUrl}
                  className="mt-4 block rounded-xl border border-slate-200 px-4 py-2 text-center text-sm font-black hover:bg-slate-50"
                >
                  Përmirëso profilin
                </a>
              </section>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
  <section className="rounded-2xl bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-black">Projektet e fundit</h2>

      <a
        href="/dashboard/projects"
        className="text-xs font-black text-blue-600"
      >
        Shiko të gjitha
      </a>
    </div>

    {recentProjects.length === 0 ? (
      <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
        <p className="text-4xl">📁</p>

        <p className="mt-3 text-lg font-black">
          Ende nuk ka projekte
        </p>

        <p className="mt-1 text-sm text-slate-600">
          Projektet që shton do të shfaqen këtu.
        </p>

        <a
          href="/dashboard/projects"
          className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2 text-sm font-black text-white"
        >
          Shto projekt
        </a>
      </div>
    ) : (
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {recentProjects.map((project) => (
  <a
    key={project.id}
    href="/dashboard/projects"
    className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md"
  >
    {project.photo_url && (
      <img
        src={project.photo_url}
        alt={project.title}
        className="h-32 w-full object-cover"
      />
    )}

    <div className="p-3">
  <h3 className="line-clamp-1 text-sm font-black">
    {project.title}
  </h3>

  <p className="mt-1 text-xs font-medium text-slate-500">
    {new Date(project.created_at).toLocaleDateString("sq-AL")}
  </p>
</div>
  </a>
))}
      </div>
    )}
  </section>

              <section className="rounded-2xl bg-white p-4 shadow-sm">
  <h2 className="text-lg font-black">
    📈 Analitika
  </h2>

  <div className="mt-4 grid gap-3 sm:grid-cols-2">

    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-2xl font-black">0</p>
      <p className="text-sm font-bold text-slate-600">
        👁️ Shikime profili
      </p>
    </div>

    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-2xl font-black">0</p>
      <p className="text-sm font-bold text-slate-600">
        📁 Klikime projektesh
      </p>
    </div>

    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-2xl font-black">-</p>
      <p className="text-sm font-bold text-slate-600">
        🔥 Më i popullarizuari
      </p>
    </div>

    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-2xl font-black">0%</p>
      <p className="text-sm font-bold text-slate-600">
        📊 Ndryshimi javor
      </p>
    </div>

  </div>
</section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}