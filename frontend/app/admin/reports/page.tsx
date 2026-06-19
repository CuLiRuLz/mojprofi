import Link from "next/link";
import { Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ResolveReportButton from "./ResolveReportButton";
import RejectReportButton from "./RejectReportButton";

type Report = {
  id: number;
  profile_id: number | null;
  reporter_name: string | null;
  reason: string | null;
  description: string | null;
  status: string | null;
  created_at: string | null;
  profiles: {
    id: number;
    account_type: string | null;
    slug: string | null;
    company_name: string | null;
    first_name: string | null;
    last_name: string | null;
  } | null;
};

function getProfileName(report: Report) {
  const profile = report.profiles;

  if (!profile) return "-";

  if (profile.account_type === "company") {
    return profile.company_name || "-";
  }

  const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
  return fullName || "-";
}

function getProfileType(report: Report) {
  const type = report.profiles?.account_type;

  if (type === "company") {
    return (
      <span className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-bold text-blue-600">
        Kompani
      </span>
    );
  }

  if (type === "professional") {
    return (
      <span className="rounded-lg bg-purple-100 px-3 py-1 text-xs font-bold text-purple-600">
        Profesionist
      </span>
    );
  }

  return (
    <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
      -
    </span>
  );
}

function getStatusBadge(status: string | null) {
  if (status === "resolved") {
    return (
      <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-600">
        Zgjidhur
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="rounded-lg bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
        Refuzuar
      </span>
    );
  }

  if (status === "reviewing") {
    return (
      <span className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-bold text-blue-600">
        Në shqyrtim
      </span>
    );
  }

  return (
    <span className="rounded-lg bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
      Në pritje
    </span>
  );
}

function getProfileLink(report: Report) {
  const profile = report.profiles;

  if (!profile?.slug) return "#";

  if (profile.account_type === "professional") {
    return `/professional/${profile.slug}`;
  }

  return `/company/${profile.slug}`;
}

export default async function AdminReportsPage() {
  const { data: reports, error } = await supabase
    .from("reports")
    .select(`
      id,
      profile_id,
      reporter_name,
      reason,
      description,
      status,
      created_at,
      profiles(
        id,
        account_type,
        slug,
        company_name,
        first_name,
        last_name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="px-8 py-7">
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="px-8 py-7">
      <h1 className="text-2xl font-black">Raportimet</h1>
      <p className="mt-1 text-sm text-slate-500">
        Këtu menaxhohen raportimet për profilet e kompanive dhe profesionistëve.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="py-3 font-bold">Raportuesi</th>
              <th className="py-3 font-bold">Profili</th>
              <th className="py-3 font-bold">Lloji</th>
              <th className="py-3 font-bold">Arsyeja</th>
              <th className="py-3 font-bold">Përshkrimi</th>
              <th className="py-3 font-bold">Statusi</th>
              <th className="py-3 font-bold">Data</th>
              <th className="py-3 font-bold">Veprimet</th>
            </tr>
          </thead>

          <tbody>
            {(reports as unknown as Report[] | null)?.map((report) => (
              <tr
                key={report.id}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="py-3 font-bold">
                  {report.reporter_name || "-"}
                </td>

                <td className="py-3 text-slate-600">
                  {getProfileName(report)}
                </td>

                <td className="py-3">{getProfileType(report)}</td>

                <td className="py-3 text-slate-600">
                  {report.reason || "-"}
                </td>

                <td className="w-[35%] py-3 text-slate-600">
                  {report.description || "-"}
                </td>

                <td className="py-3 text-center">
  {getStatusBadge(report.status)}
</td>

                <td className="py-3 text-slate-600">
                  {report.created_at
                    ? new Date(report.created_at).toISOString().split("T")[0]
                    : "-"}
                </td>

                <td className="py-3">
                  <div className="flex gap-2">
  <Link
    href={getProfileLink(report)}
    className="inline-flex rounded-lg bg-blue-50 p-2 text-blue-600"
    title="Shiko profilin"
  >
    <Eye size={15} />
  </Link>

  <ResolveReportButton reportId={report.id} />

  <RejectReportButton reportId={report.id} />
</div>
                </td>
              </tr>
            ))}

            {reports?.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-slate-500">
                  Nuk ka raportime për momentin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}