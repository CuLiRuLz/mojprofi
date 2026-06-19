import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

const categoryIcons: Record<string, string> = {
  Fasada: "🏠",
  Renovime: "🔨",
  Banja: "🚿",
  Trockenbau: "🚪",
  Pllaka: "🔲",
  Laminat: "🪵",
  Hidraulikë: "🚰",
  Elektrikë: "⚡",
  Çati: "🏘️",
  Kopshtari: "🌿",
  Transport: "🚚",
  Moler: "🎨",
  Puntor: "👷",
};

export default async function CategoriesPage() {
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <span className="text-sm font-bold uppercase tracking-wider text-blue-200">
            Kategoritë
          </span>

          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight text-white">
            Gjej shërbimin që të duhet
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            Zgjidh një kategori dhe shiko kompanitë dhe profesionistët e
            verifikuar në MojProfi.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900">
            Të gjitha kategoritë
          </h2>

          <p className="mt-2 text-slate-500">
            Zgjidh kategorinë që të intereson.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {categories?.map((category) => (
            <Link
              key={category.id}
              href={`/search?category=${category.id}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <div className="text-center">
                <div className="mb-2 text-2xl">
                  {categoryIcons[category.name] || "🛠️"}
                </div>

                <h3 className="text-base font-black text-slate-900 transition group-hover:text-blue-600">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}