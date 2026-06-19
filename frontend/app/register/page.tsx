import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50 text-slate-900">
        <section className="mx-auto max-w-6xl px-6 py-8">
          <div className="text-center">
            <span className="inline-flex rounded-full border border-blue-100 bg-white px-4 py-1 text-xs font-bold text-blue-600 shadow-sm">
              Mirë se vjen në MojProfi
            </span>

            <h1 className="mt-4 text-2xl font-extrabold leading-tight md:text-3xl">
              Bëhu pjesë e platformës
              <br />
              më të madhe të shërbimeve
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
              Krijo profilin tënd dhe rrit biznesin ose karrierën tënde.
            </p>

            <div className="mx-auto mt-7 grid max-w-4xl gap-4 md:grid-cols-4">
              <div>
                <div className="text-2xl font-black text-blue-600">2,000+</div>
                <p className="text-xs font-semibold text-slate-500">
                  Kompani aktive
                </p>
              </div>

              <div>
                <div className="text-2xl font-black text-orange-500">15,000+</div>
                <p className="text-xs font-semibold text-slate-500">
                  Vlerësime reale
                </p>
              </div>

              <div>
                <div className="text-2xl font-black text-emerald-500">30+</div>
                <p className="text-xs font-semibold text-slate-500">
                  Qytete
                </p>
              </div>

              <div>
                <div className="text-2xl font-black text-blue-600">10,000+</div>
                <p className="text-xs font-semibold text-slate-500">
                  Klientë të kënaqur
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-2">
            <div className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-blue-100/50">
              <div className="flex gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-5xl">
                  🏢
                </div>

                <div>
                  <h2 className="text-xl font-extrabold">
                    Regjistro Kompaninë
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Për kompani të regjistruara që duan të shfaqin shërbimet,
                    projektet dhe të marrin klientë të rinj.
                  </p>
                </div>
              </div>

              <Link
                href="/register/company"
                className="mt-auto flex items-centerr rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700"
              >
                Fillo si Kompani →
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-blue-100/50">
              <div className="flex gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-5xl">
                  👷
                </div>

                <div>
                  <h2 className="text-xl font-extrabold">
                    Regjistrohu si Mjeshtër
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Për profesionistë të pavarur që punojnë vetë dhe duan të
                    prezantojnë punën e tyre.
                  </p>
                </div>
              </div>

              <Link
                href="/register/professional"
                className="mt-5 flex items-center justify-center rounded-xl border border-orange-400 px-6 py-3 text-sm font-bold text-orange-500 hover:bg-orange-50"
              >
                Fillo si Mjeshtër →
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-6 grid max-w-4xl gap-3 rounded-2xl bg-blue-50/80 p-4 shadow-sm md:grid-cols-3">
            <div className="flex items-center justify-center gap-3 text-sm font-semibold text-slate-700">
              <span className="rounded-xl bg-white p-2">✅</span>
              Verifikim i profileve
            </div>

            <div className="flex items-center justify-center gap-3 text-sm font-semibold text-slate-700">
              <span className="rounded-xl bg-white p-2">🔒</span>
              Të dhëna të sigurta
            </div>

            <div className="flex items-center justify-center gap-3 text-sm font-semibold text-slate-700">
              <span className="rounded-xl bg-white p-2">⭐</span>
              Mbështetje për çdo anëtar
            </div>
          </div>
        </section>
      </main>
    </>
  );
}