import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">
        <section className="mx-auto max-w-4xl px-6 py-16">
          <h1 className="text-4xl font-black text-slate-900">Rreth MojProfi</h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            MojProfi është një platformë online që ndihmon përdoruesit të gjejnë
            kompani dhe profesionistë të pavarur sipas qytetit dhe kategorisë.
          </p>

          <p className="mt-4 leading-8 text-slate-600">
            Qëllimi ynë është ta bëjmë më të lehtë gjetjen e mjeshtrave,
            kompanive dhe shërbimeve të besueshme në Maqedoninë e Veriut.
          </p>

          <p className="mt-4 leading-8 text-slate-600">
            MojProfi nuk negocion çmime, nuk organizon punët dhe nuk merr
            pjesë në marrëveshjet mes klientit dhe profesionistit. Platforma
            shërben vetëm si lidhje mes përdoruesve dhe ofruesve të shërbimeve.
          </p>
        </section>
      </main>
    </>
  );
}