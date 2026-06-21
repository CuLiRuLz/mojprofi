import { supabase } from "@/lib/supabase";
import AddCategoryForm from "./AddCategoryForm";
import EditCategoryButton from "./EditCategoryButton";
import DeleteCategoryButton from "./DeleteCategoryButton";

type Category = {
  id: number;
  name: string | null;
  created_at?: string | null;
};

export default async function AdminCategoriesPage() {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, created_at")
    .order("id", { ascending: false });

  const categoriesList = (categories as Category[] | null) || [];

  if (error) {
    return (
      <div className="px-4 py-5 lg:px-8 lg:py-7">
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 lg:px-8 lg:py-7">
      <h1 className="text-2xl font-black">Kategoritë</h1>

      <p className="mt-1 text-sm text-slate-500">
        Këtu menaxhohen kategoritë e shërbimeve në MojProfi.
      </p>

      <AddCategoryForm />

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[650px] w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3 pr-4 font-bold">ID</th>
                <th className="py-3 pr-4 font-bold">Kategoria</th>
                <th className="py-3 pr-4 font-bold">Data</th>
                <th className="py-3 font-bold">Veprimet</th>
              </tr>
            </thead>

            <tbody>
              {categoriesList.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="py-4 pr-4 font-medium">#{category.id}</td>

                  <td className="py-4 pr-4 font-bold">
                    {category.name || "-"}
                  </td>

                  <td className="py-4 pr-4 text-slate-600">
                    {category.created_at
                      ? new Date(category.created_at)
                          .toISOString()
                          .split("T")[0]
                      : "-"}
                  </td>

                  <td className="py-4">
                    <div className="flex gap-2">
                      <EditCategoryButton
                        categoryId={category.id}
                        currentName={category.name || ""}
                      />

                      <DeleteCategoryButton categoryId={category.id} />
                    </div>
                  </td>
                </tr>
              ))}

              {categoriesList.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-500">
                    Nuk ka kategori.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}