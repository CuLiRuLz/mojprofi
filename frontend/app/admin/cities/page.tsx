import { supabase } from "@/lib/supabase";
import AddCityForm from "./AddCityForm";
import EditCityButton from "./EditCityButton";
import DeleteCityButton from "./DeleteCityButton";

type City = {
  id: number;
  name: string | null;
  created_at?: string | null;
};

export default async function AdminCitiesPage() {
  const { data: cities, error } = await supabase
    .from("cities")
    .select("id, name, created_at")
    .order("id", { ascending: false });

  if (error) {
    return (
      <div className="px-8 py-7">
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="px-8 py-7">
      <h1 className="text-2xl font-black">Qytetet</h1>

      <p className="mt-1 text-sm text-slate-500">
        Këtu menaxhohen qytetet që përdoren në kërkim dhe në profile.
      </p>

      <AddCityForm />

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="py-3 font-bold">ID</th>
              <th className="py-3 font-bold">Qyteti</th>
              <th className="py-3 font-bold">Data</th>
              <th className="py-3 font-bold">Veprimet</th>
            </tr>
          </thead>

          <tbody>
            {(cities as City[] | null)?.map((city) => (
              <tr
                key={city.id}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="py-3 font-medium">#{city.id}</td>

                <td className="py-3 font-bold">{city.name || "-"}</td>

                <td className="py-3 text-slate-600">
                  {city.created_at
                    ? new Date(city.created_at).toISOString().split("T")[0]
                    : "-"}
                </td>

                <td className="py-3">
                  <div className="flex gap-2">
                    <EditCityButton
                      cityId={city.id}
                      currentName={city.name || ""}
                    />

                    <DeleteCityButton cityId={city.id} />
                  </div>
                </td>
              </tr>
            ))}

            {cities?.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-slate-500">
                  Nuk ka qytete.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}