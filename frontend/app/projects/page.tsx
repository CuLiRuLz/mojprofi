import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { Camera, MapPin, Building2, UserRound } from "lucide-react";

function getProfileName(profile: any) {
  if (!profile) return "Profil";

  if (profile.account_type === "company") {
    return profile.company_name || "Kompani";
  }

  return (
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
    "Profesionist"
  );
}

function getProfileType(profile: any) {
  if (profile?.account_type === "professional") return "Profesionist";
  return "Kompani";
}

export default async function ProjectsPage() {
  const { data: projects } = await supabase
    .from("projects")
    .select(`
      id,
      title,
      description,
      photo_url,
      created_at,
      profiles(
        slug,
        account_type,
        company_name,
        first_name,
        last_name,
        cities(name)
      ),
      project_photos(*)
    `)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <span className="text-sm font-bold uppercase tracking-wider text-blue-200">
            Projektet
          </span>

          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight text-white">
            Shiko punët e publikuara në MojProfi
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            Eksploro projekte të kryera nga kompani dhe profesionistë të
            regjistruar në platformë.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8">
          <h2 className="text-3xl font-black">Projektet e fundit</h2>
          <p className="mt-2 text-slate-500">
            Shiko galeri, përshkrime dhe profilet që kanë publikuar projektet.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects?.map((project) => {
            const profile = Array.isArray(project.profiles)
              ? project.profiles[0]
              : project.profiles;

            const profileName = getProfileName(profile);
            const profileType = getProfileType(profile);

            const cityName = Array.isArray(profile?.cities)
              ? profile.cities[0]?.name || "Pa qytet"
              : "Pa qytet";

            const photoCount = project.project_photos?.length || 0;

            const cover =
              project.project_photos?.[0]?.photo_url ||
              project.photo_url ||
              "";

            return (
              <Link
                key={project.id}
                href={`/project/${project.id}`}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="h-56 bg-slate-200">
                  {cover ? (
                    <img
                      src={cover}
                      alt={project.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl">
                      📸
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
                      {profile?.account_type === "professional" ? (
                        <UserRound size={14} />
                      ) : (
                        <Building2 size={14} />
                      )}
                      {profileType}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                      <MapPin size={14} />
                      {cityName}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                      <Camera size={14} />
                      {photoCount} foto
                    </span>
                  </div>

                  <h3 className="mt-4 line-clamp-1 text-xl font-black group-hover:text-blue-600">
                    {project.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                    {project.description || "Ky projekt nuk ka përshkrim."}
                  </p>

                  <p className="mt-4 text-sm font-bold text-slate-700">
                    Nga: {profileName}
                  </p>

                  <p className="mt-5 text-sm font-black text-blue-600">
                    Shiko projektin →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {projects?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            Nuk ka projekte për momentin.
          </div>
        )}
      </section>
    </main>
  );
}