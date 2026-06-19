import {
  BadgeCheck,
  Building2,
  Clock3,
  Flag,
  HardHat,
  Heart,
  ImageIcon,
  ShieldX,
  Star,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  const [
    companies,
    professionals,
    projects,
    reviews,
    favorites,
    reports,
    pending,
    approved,
    rejected,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("account_type", "company"),

    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("account_type", "professional"),

    supabase.from("projects").select("id", { count: "exact", head: true }),

    supabase.from("reviews").select("id", { count: "exact", head: true }),

    supabase.from("favorites").select("id", { count: "exact", head: true }),

    supabase.from("reports").select("id", { count: "exact", head: true }),

    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("approval_status", "pending"),

    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("approval_status", "approved"),

    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("approval_status", "rejected"),
  ]);

  return (
    <div className="px-8 py-7">
      <h1 className="text-2xl font-black">Analitika</h1>

      <p className="mt-1 text-sm text-slate-500">
        Pasqyrë e përgjithshme e statistikave kryesore të platformës MojProfi.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Kompani totale"
          value={companies.count || 0}
          icon={<Building2 size={24} />}
          color="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Profesionistë total"
          value={professionals.count || 0}
          icon={<HardHat size={24} />}
          color="bg-emerald-100 text-emerald-600"
        />

        <StatCard
          title="Projekte totale"
          value={projects.count || 0}
          icon={<ImageIcon size={24} />}
          color="bg-purple-100 text-purple-600"
        />

        <StatCard
          title="Reviews / Vlerësime"
          value={reviews.count || 0}
          icon={<Star size={24} />}
          color="bg-amber-100 text-amber-500"
        />

        <StatCard
          title="Favoritete"
          value={favorites.count || 0}
          icon={<Heart size={24} />}
          color="bg-pink-100 text-pink-600"
        />

        <StatCard
          title="Raportime"
          value={reports.count || 0}
          icon={<Flag size={24} />}
          color="bg-red-100 text-red-600"
        />

        <StatCard
          title="Në pritje"
          value={pending.count || 0}
          icon={<Clock3 size={24} />}
          color="bg-orange-100 text-orange-600"
        />

        <StatCard
          title="Të aprovuara"
          value={approved.count || 0}
          icon={<BadgeCheck size={24} />}
          color="bg-green-100 text-green-600"
        />

        <StatCard
          title="Refuzime"
          value={rejected.count || 0}
          icon={<ShieldX size={24} />}
          color="bg-rose-100 text-rose-600"
        />
      </div>
    </div>
  );
}