import Navbar from "@/components/Navbar";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">
        <section className="mx-auto max-w-4xl px-6 py-16">
          <h1 className="text-4xl font-black text-slate-900">
            Politika e Privatësisë
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            MojProfi respekton privatësinë e përdoruesve dhe angazhohet të
            mbrojë të dhënat personale të mbledhura përmes platformës.
          </p>

          <h2 className="mt-10 text-2xl font-black text-slate-900">
            Çfarë të dhënash mbledhim?
          </h2>

          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-600">
            <li>Emrin dhe mbiemrin</li>
            <li>Adresën e email-it</li>
            <li>Numrin e telefonit</li>
            <li>Të dhënat e profilit profesional ose të kompanisë</li>
            <li>Mesazhet e dërguara përmes formularit të kontaktit</li>
          </ul>

          <h2 className="mt-10 text-2xl font-black text-slate-900">
            Si përdoren të dhënat?
          </h2>

          <p className="mt-4 leading-8 text-slate-600">
            Të dhënat përdoren për funksionimin e platformës, komunikimin me
            përdoruesit, menaxhimin e profileve dhe përmirësimin e shërbimeve.
          </p>

          <h2 className="mt-10 text-2xl font-black text-slate-900">
            Siguria e të dhënave
          </h2>

          <p className="mt-4 leading-8 text-slate-600">
            MojProfi përdor masa teknike dhe organizative për mbrojtjen e të
            dhënave personale. Megjithatë, asnjë sistem online nuk mund të
            garantojë siguri absolute.
          </p>

          <h2 className="mt-10 text-2xl font-black text-slate-900">
            Kontakt
          </h2>

          <p className="mt-4 leading-8 text-slate-600">
            Për pyetje lidhur me privatësinë mund të na kontaktoni në:
            <strong> info@mojprofi.com</strong>
          </p>
        </section>
      </main>
    </>
  );
}