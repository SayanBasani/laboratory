"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type Field = {
  name: string;
  unit?: string;
  normalRange?: string;
};

type FormData = {
  name: string;
  fields: Field[];
};

export default function CreateTestPage() {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      fields: [{ name: "", unit: "", normalRange: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/test", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed");

      router.push("/test");
    } catch (err) {
      alert("Error creating test");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6">

      <div className="max-w-5xl mx-auto space-y-6">

        {/* 🔝 HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Create Lab Test</h1>
            <p className="text-gray-500">
              Define test parameters and reference ranges
            </p>
          </div>

          <button
            onClick={() => router.push("/test")}
            className="text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* 🧪 TEST INFO */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow">

            <h2 className="text-lg font-semibold mb-4">
              Test Information
            </h2>

            <div>
              <label className="label">Test Name</label>
              <input
                {...register("name", { required: "Test name required" })}
                placeholder="Enter the test name"
                className="input"
              />
              {errors.name && (
                <p className="error">{errors.name.message}</p>
              )}
            </div>

          </div>

          {/* 📋 TEST FIELDS */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow space-y-4">

            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Test Parameters
              </h2>

              <button
                type="button"
                onClick={() =>
                  append({ name: "", unit: "", normalRange: "" })
                }
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                + Add Parameter
              </button>
            </div>

            <div className="space-y-4">

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="border rounded-xl p-4 bg-gray-50 dark:bg-slate-800"
                >

                  <div className="grid md:grid-cols-3 gap-4">

                    {/* NAME */}
                    <div>
                      <label className="label">Parameter Name</label>
                      <input
                        {...register(`fields.${index}.name`, {
                          required: "Required",
                        })}
                        placeholder="Enter the parameter name"
                        className="input"
                      />
                    </div>

                    {/* UNIT */}
                    <div>
                      <label className="label">Unit</label>
                      <input
                        {...register(`fields.${index}.unit`)}
                        placeholder="g/dL"
                        className="input"
                      />
                    </div>

                    {/* RANGE */}
                    <div>
                      <label className="label">Normal Range</label>
                      <input
                        {...register(`fields.${index}.normalRange`)}
                        placeholder="13 - 17"
                        className="input"
                      />
                    </div>

                  </div>

                  {/* REMOVE BUTTON */}
                  {fields.length > 1 && (
                    <div className="mt-3 text-right">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Remove Parameter
                      </button>
                    </div>
                  )}

                </div>
              ))}

            </div>

          </div>

          {/* 🚀 STICKY ACTION BAR */}
          <div className="sticky bottom-4">
            <div className="bg-white dark:bg-slate-900 border rounded-xl p-4 shadow flex justify-end gap-3">

              <button
                type="button"
                onClick={() => router.push("/test")}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg"
              >
                {isSubmitting ? "Saving..." : "Create Test"}
              </button>

            </div>
          </div>

        </form>

      </div>
    </main>
  );
}