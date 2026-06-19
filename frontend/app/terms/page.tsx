import Navbar from "@/components/Navbar";

export default function TermsPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">
        <section className="mx-auto max-w-4xl px-6 py-16">
          <h1 className="text-4xl font-black text-slate-900">
            Kushtet e Përdorimit
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Duke përdorur platformën MojProfi, ju pranoni këto kushte
            përdorimi. Nëse nuk pajtoheni me to, ju lutemi të mos përdorni
            platformën.
          </p>

          <h2 className="mt-10 text-2xl font-black text-slate-900">
            1. Qëllimi i platformës
          </h2>

          <p className="mt-4 leading-8 text-slate-600">
            MojProfi është një platformë që lidh klientët me kompani dhe
            profesionistë të pavarur. Platforma nuk është palë në marrëveshjet,
            kontratat apo pagesat mes përdoruesve.
          </p>

          <h2 className="mt-10 text-2xl font-black text-slate-900">
            2. Përgjegjësia e përdoruesve
          </h2>

          <p className="mt-4 leading-8 text-slate-600">
            Përdoruesit janë përgjegjës për saktësinë e informacionit që
            publikojnë në profilet e tyre. Ndalohet publikimi i informacionit
            të rremë, mashtrues ose të paligjshëm.
          </p>

          <h2 className="mt-10 text-2xl font-black text-slate-900">
            3. Profilet dhe përmbajtja
          </h2>

          <p className="mt-4 leading-8 text-slate-600">
            MojProfi rezervon të drejtën të aprovojë, refuzojë, modifikojë ose
            largojë profile, projekte, komente dhe përmbajtje që shkelin
            rregullat e platformës.
          </p>

          <h2 className="mt-10 text-2xl font-black text-slate-900">
            4. Kufizimi i përgjegjësisë
          </h2>

          <p className="mt-4 leading-8 text-slate-600">
            MojProfi nuk garanton cilësinë e punimeve, saktësinë e
            informacioneve ose rezultatet e bashkëpunimit mes klientëve dhe
            ofruesve të shërbimeve.
          </p>

          <h2 className="mt-10 text-2xl font-black text-slate-900">
            5. Ndryshimet
          </h2>

          <p className="mt-4 leading-8 text-slate-600">
            MojProfi mund të ndryshojë këto kushte në çdo kohë. Versioni më i
            fundit do të publikohet gjithmonë në këtë faqe.
          </p>

          <h2 className="mt-10 text-2xl font-black text-slate-900">
            6. Kontakt
          </h2>

          <p className="mt-4 leading-8 text-slate-600">
            Për pyetje lidhur me kushtet e përdorimit mund të na kontaktoni në:
            <strong> info@mojprofi.com</strong>
          </p>

          <div className="mt-12 rounded-2xl bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-500">
              Përditësimi i fundit: Qershor 2026
            </p>
          </div>
        </section>
      </main>
    </>
  );
}