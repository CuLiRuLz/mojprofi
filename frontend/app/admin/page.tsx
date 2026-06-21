import { supabase } from "@/lib/supabase";
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock,
  Flag,
  HardHat,
  ImageIcon,
  ShieldCheck,
  Star,
  UserRound,
  Users,
  X,
} from "lucide-react";
import PendingVerificationTable from "./PendingVerificationTable";
import type { ReactNode } from "react";

type ActivityType =
  | "company"
  | "professional"
  | "project"
  | "review"
  | "approved";

type ActivityItemData = {
  type: ActivityType;
  title: string;
  sub: string;
  time: string;
  createdAt: string;
};

function profileName(profile: any) {
  if (!profile) return "-";

  if (profile.account_type === "company") {
    return profile.company_name || "-";
  }

  return `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "-";
}

function formatDate(date: string | null) {
  if (!date) return "-";
  return new Date(date).toISOString().split("T")[0];
}

function timeAgo(date: string | null) {
  if (!date) return "-";

  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "tani";
  if (minutes < 60) return `${minutes} min më parë`;
  if (hours < 24) return `${hours} orë më parë`;
  if (days < 7) return `${days} ditë më parë`;

  return formatDate(date);
}

function getActivityIcon(type: ActivityType) {
  if (type === "company") {
    return {
      icon: <Building2 size={16} />,
      color: "bg-blue-50 text-blue-600",
    };
  }

  if (type === "professional") {
    return {
      icon: <HardHat size={16} />,
      color: "bg-emerald-50 text-emerald-600",
    };
  }

  if (type === "project") {
    return {
      icon: <ImageIcon size={16} />,
      color: "bg-purple-50 text-purple-600",
    };
  }

  if (type === "review") {
    return {
      icon: <Star size={16} />,
      color: "bg-amber-50 text-amber-500",
    };
  }

  return {
    icon: <BadgeCheck size={16} />,
    color: "bg-green-50 text-green-600",
  };
}

export default async function AdminPage() {
  const { count: companiesCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("account_type", "company");

  const { count: professionalsCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("account_type", "professional");

  const { data: pendingProfilesRpc } = await supabase.rpc(
    "admin_get_profiles_by_status",
    {
      p_status: "pending",
    }
  );

  const pendingCount = pendingProfilesRpc?.length ?? 0;

  const { count: rejectedCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("approval_status", "rejected");

  const { count: approvedCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("approval_status", "approved");

  const { count: reviewsCount } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true });

  const { count: projectsCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  const { count: reportsCount } = await supabase
    .from("reports")
    .select("*", { count: "exact", head: true });

  const { count: verifiedCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gt("verified_level", 0);

  const pendingProfilesList =
    pendingProfilesRpc?.map((profile: any) => ({
      ...profile,
      created_at: formatDate(profile.created_at),
    })) ?? [];

  const { data: recentProfiles } = await supabase
    .from("profiles")
    .select(
      `
      id,
      account_type,
      company_name,
      first_name,
      last_name,
      created_at
    `
    )
    .order("created_at", { ascending: false })
    .limit(8);

  const { data: recentProjects } = await supabase
    .from("projects")
    .select(
      `
      id,
      title,
      created_at,
      profiles(
        account_type,
        company_name,
        first_name,
        last_name
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentReviews } = await supabase
    .from("reviews")
    .select(
      `
      id,
      rating,
      created_at,
      profiles(
        account_type,
        company_name,
        first_name,
        last_name
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: approvedProfiles } = await supabase
    .from("profiles")
    .select(
      `
      id,
      account_type,
      company_name,
      first_name,
      last_name,
      created_at
    `
    )
    .eq("approval_status", "approved")
    .order("created_at", { ascending: false })
    .limit(5);

  const activities: ActivityItemData[] = [
    ...(recentProjects ?? []).map((project: any) => ({
      type: "project" as ActivityType,
      title: "U shtua projekt i ri",
      sub: `${project.title || "Projekt"} - ${profileName(project.profiles)}`,
      time: timeAgo(project.created_at),
      createdAt: project.created_at,
    })),

    ...(recentReviews ?? []).map((review: any) => ({
      type: "review" as ActivityType,
      title: "U shtua vlerësim i ri",
      sub: `${profileName(review.profiles)} mori ${review.rating || 0} yje`,
      time: timeAgo(review.created_at),
      createdAt: review.created_at,
    })),

    ...(recentProfiles ?? []).map((profile: any) => ({
      type:
        profile.account_type === "professional"
          ? ("professional" as ActivityType)
          : ("company" as ActivityType),
      title:
        profile.account_type === "professional"
          ? "U regjistrua profesionist i ri"
          : "U regjistrua kompani e re",
      sub: profileName(profile),
      time: timeAgo(profile.created_at),
      createdAt: profile.created_at,
    })),

    ...(approvedProfiles ?? []).map((profile: any) => ({
      type: "approved" as ActivityType,
      title: "U aprovua profil",
      sub: profileName(profile),
      time: timeAgo(profile.created_at),
      createdAt: profile.created_at,
    })),
  ]
    .filter((activity) => activity.createdAt)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const { data: profileCategories } = await supabase
    .from("profile_categories")
    .select(`
      id,
      categories(name)
    `);

  const categoryMap = new Map<string, number>();

  (profileCategories ?? []).forEach((item: any) => {
    const name = item.categories?.name || "Tjera";
    categoryMap.set(name, (categoryMap.get(name) || 0) + 1);
  });

  const categoryEntries = Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const totalCategoryCount = categoryEntries.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const topCategories = categoryEntries.slice(0, 4);
  const otherCategories = categoryEntries.slice(4);
  const otherCount = otherCategories.reduce((sum, item) => sum + item.count, 0);

  const categoryStats = [
    ...topCategories,
    ...(otherCount > 0 ? [{ name: "Tjera", count: otherCount }] : []),
  ];

  const conicColors = ["#2563eb", "#22c55e", "#f59e0b", "#8b5cf6", "#cbd5e1"];

  let start = 0;
  const conicGradient =
    totalCategoryCount > 0
      ? categoryStats
          .map((item, index) => {
            const percent = (item.count / totalCategoryCount) * 100;
            const end = start + percent;
            const part = `${conicColors[index]} ${start}% ${end}%`;
            start = end;
            return part;
          })
          .join(",")
      : "#cbd5e1 0% 100%";

  const companyRegistrations =
    recentProfiles?.filter((p: any) => p.account_type === "company").length ?? 0;

  const professionalRegistrations =
    recentProfiles?.filter((p: any) => p.account_type === "professional")
      .length ?? 0;

  return (
    <div className="px-4 py-5 lg:px-8 lg:py-7">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:px-7 lg:py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Përshëndetje, Admin! 👋
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Këtu është një përmbledhje e aktiviteteve në platformë.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex">
            <a
              href="/admin/reports"
              className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold hover:bg-slate-50"
            >
              Raportet
            </a>
            <a
              href="/admin/pending"
              className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white hover:bg-blue-700"
            >
              Verifiko profile
            </a>
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          icon={<Building2 size={24} />}
          title="Kompanitë"
          value={companiesCount || 0}
          sub="Profile kompanish"
          color="blue"
        />
        <StatCard
          icon={<UserRound size={24} />}
          title="Mjeshtrit"
          value={professionalsCount || 0}
          sub="Profesionistë aktivë"
          color="green"
        />
        <StatCard
          icon={<Clock size={24} />}
          title="Në pritje"
          value={pendingCount || 0}
          sub="Presin aprovim"
          color="orange"
        />
        <StatCard
          icon={<X size={24} />}
          title="Refuzuar"
          value={rejectedCount || 0}
          sub="Profile të refuzuara"
          color="red"
        />
        <StatCard
          icon={<Star size={24} />}
          title="Vlerësimet"
          value={reviewsCount || 0}
          sub="Reviews totale"
          color="purple"
        />
        <StatCard
          icon={<Flag size={24} />}
          title="Raportimet"
          value={reportsCount || 0}
          sub="Raportime totale"
          color="red"
        />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">
          <div className="mt-6 flex flex-col items-center gap-6">
            <h3 className="text-lg font-black">Regjistrime të reja</h3>
            <button className="w-fit rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-500">
              Aktivitet real
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium lg:gap-6">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" /> Kompanitë
            </span>

            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Mjeshtrit
            </span>
          </div>

          <div className="mt-5 w-full overflow-x-auto">
            <div className="h-[210px] min-w-[560px] rounded-xl bg-gradient-to-b from-slate-50 to-white p-4">
              <svg viewBox="0 0 600 210" className="h-full w-full">
                <line x1="0" y1="40" x2="600" y2="40" stroke="#e2e8f0" />
                <line x1="0" y1="95" x2="600" y2="95" stroke="#e2e8f0" />
                <line x1="0" y1="150" x2="600" y2="150" stroke="#e2e8f0" />

                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="10,120 60,135 110,95 160,105 210,88 260,145 310,160 360,140 410,130 460,82 510,98 560,72 590,105"
                />

                <polyline
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="10,150 60,165 110,145 160,155 210,138 260,175 310,195 360,168 410,158 460,135 510,115 560,140 590,128"
                />

                <circle cx="560" cy="72" r="5" fill="#2563eb" />
                <circle cx="590" cy="128" r="5" fill="#22c55e" />
              </svg>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-blue-50 px-4 py-3">
              <p className="text-xs font-bold text-blue-600">Kompani të reja</p>
              <p className="text-2xl font-black text-slate-900">
                {companyRegistrations}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 px-4 py-3">
              <p className="text-xs font-bold text-emerald-600">
                Mjeshtër të rinj
              </p>
              <p className="text-2xl font-black text-slate-900">
                {professionalRegistrations}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-black">Përbërja sipas kategorive</h3>
            <button className="hidden w-fit rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-500 lg:block">
  Të gjitha
</button>
          </div>

          <div className="mt-25 flex flex-col items-center justify-center gap-6">
            <div
  className="mx-auto flex h-36 w-36 shrink-0 items-center justify-center rounded-full lg:h-44 lg:w-44"
              style={{ background: `conic-gradient(${conicGradient})` }}
            >
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-2xl font-black">
                  {totalCategoryCount}
                </span>
                <span className="text-sm font-medium text-slate-500">
                  Totali
                </span>
              </div>
            </div>

            <div className="mx-auto grid w-full max-w-[240px] grid-cols-[1fr_auto] gap-y-3 text-sm font-medium">
              {categoryStats.length > 0 ? (
                categoryStats.map((item, index) => (
                  <Legend
                    key={item.name}
                    color={conicColors[index]}
                    label={item.name}
                    value={`${
                      totalCategoryCount > 0
                        ? Math.round((item.count / totalCategoryCount) * 100)
                        : 0
                    }%`}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  Ende nuk ka kategori të lidhura.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <h3 className="text-lg font-black">Aktivitetet e fundit</h3>

    <a
      href="/admin/pending"
      className="text-sm font-bold text-blue-600"
    >
      Shiko të gjitha
    </a>
  </div>

          <div className="mt-5 space-y-4">
            {activities.length > 0 ? (
              activities.map((activity, index) => {
                const iconData = getActivityIcon(activity.type);

                return (
                  <ActivityItem
                    key={`${activity.type}-${index}`}
                    icon={iconData.icon}
                    color={iconData.color}
                    title={activity.title}
                    sub={activity.sub}
                    time={activity.time}
                  />
                );
              })
            ) : (
              <p className="text-sm text-slate-500">
                Ende nuk ka aktivitete të reja.
              </p>
            )}
          </div>

        </div>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.7fr_0.65fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-black">Në pritje për verifikim</h3>
            <a className="text-sm font-bold text-blue-600" href="/admin/pending">
              Shiko të gjitha ({pendingCount || 0})
            </a>
          </div>

          <div className="mt-4 hidden w-full overflow-x-auto lg:block">
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 pr-4 font-bold">Emri</th>
                  <th className="py-3 pr-4 font-bold">Lloji</th>
                  <th className="py-3 pr-4 font-bold">Qyteti</th>
                  <th className="py-3 pr-4 font-bold">Telefoni</th>
                  <th className="py-3 pr-4 font-bold">Regjistruar më</th>
                  <th className="py-3 pr-4 font-bold">Statusi</th>
                  <th className="py-3 font-bold">Veprimet</th>
                </tr>
              </thead>

              <tbody>
                <PendingVerificationTable
                  initialProfiles={pendingProfilesList}
                />
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 p-5 text-center lg:hidden">
  <p className="text-sm font-semibold text-slate-500">
    Lista e profileve në pritje shfaqet më mirë në desktop.
  </p>

  <a
    href="/admin/pending"
    className="mt-3 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white"
  >
    Shiko profilet në pritje
  </a>
</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">
          <h3 className="text-lg font-black">Informacione të shpejta</h3>

          <div className="mt-5 space-y-4">
            <QuickInfo
              icon={<Users size={18} />}
              label="Profile totale"
              value={(companiesCount || 0) + (professionalsCount || 0)}
              color="blue"
            />
            <QuickInfo
              icon={<ImageIcon size={18} />}
              label="Projekte totale"
              value={projectsCount || 0}
              color="purple"
            />
            <QuickInfo
              icon={<Star size={18} />}
              label="Vlerësime totale"
              value={reviewsCount || 0}
              color="amber"
            />
            <QuickInfo
              icon={<ShieldCheck size={18} />}
              label="Profile të verifikuara"
              value={verifiedCount || 0}
              color="green"
            />
            <QuickInfo
              icon={<CheckCircle2 size={18} />}
              label="Profile të aprovuara"
              value={approvedCount || 0}
              color="green"
            />
          </div>
        </div>
      </section>

      <footer className="mt-7 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 MojProfi. Të gjitha të drejtat e rezervuara.</span>
        <span>Versioni 1.0.0-beta</span>
      </footer>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  sub,
  color,
}: {
  icon: ReactNode;
  title: string;
  value: number;
  sub: string;
  color: "blue" | "green" | "orange" | "purple" | "red";
}) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-emerald-100 text-emerald-600",
    orange: "bg-orange-100 text-orange-500",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full ${colors[color]}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-3xl font-black">{value}</h3>
          <p className="mt-1 text-xs font-medium text-slate-500">{sub}</p>
        </div>
      </div>
    </div>
  );
}

function Legend({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 sm:gap-8">
      <span className="flex min-w-0 items-center gap-2">
        <span
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="truncate">{label}</span>
      </span>
      <span className="shrink-0">{value}</span>
    </div>
  );
}

function ActivityItem({
  icon,
  color,
  title,
  sub,
  time,
}: {
  icon: ReactNode;
  color: string;
  title: string;
  sub: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${color}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black">{title}</p>
        <p className="truncate text-sm text-slate-500">{sub}</p>
      </div>
      <span className="shrink-0 text-xs font-medium text-slate-500">
        {time}
      </span>
    </div>
  );
}

function QuickInfo({
  icon,
  label,
  value,
  color,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  color: "blue" | "purple" | "amber" | "green";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-500",
    green: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${colors[color]}`}
        >
          {icon}
        </div>
        <span className="truncate text-sm font-bold">{label}</span>
      </div>
      <span className="shrink-0 text-sm font-black">{value}</span>
    </div>
  );
}