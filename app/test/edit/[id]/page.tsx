"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Link } from "lucide-react";

type Field = {
  id?: number;
  name: string;
  unit?: string;
  normalRange?: string;
};

type FormData = {
  name: string;
  fields: Field[];
};

export default function EditTestPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      fields: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  // fetch existing test
  useEffect(() => {
    const fetchTest = async () => {
      const res = await fetch(`/api/test/${id}`);
      const data = await res.json();

      reset({
        name: data.name,
        fields: data.fields,
      });

      setLoading(false);
    };

    fetchTest();
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch(`/api/test/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed");

      router.push(`/test/${id}`);
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <main className="min-h-screen bg-linear-to-br from-white to-gray-100 dark:from-slate-950 dark:to-slate-900 p-6">
 
 
      <nav className="flex justify-start items-start py-4">
        <Link href="/test">
          <Button className="bg-blue-500 hover:bg-blue-600 text-black dark:text-white shadow">
            <ArrowLeft className="w-4 h-4 " />
          </Button>
        </Link>
      </nav>


      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Edit Test</h1>
          <p className="text-gray-500">
            Modify test structure and parameters
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* TEST NAME */}
          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-6 space-y-3">
              <h2 className="font-semibold">Test Name</h2>

              <input
                {...register("name", { required: true })}
                className="input"
              />
            </CardContent>
          </Card>

          {/* FIELDS */}
          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-6 space-y-4">

              <div className="flex justify-between items-center">
                <h2 className="font-semibold">Fields</h2>

                <Button
                  type="button"
                  onClick={() =>
                    append({ name: "", unit: "", normalRange: "" })
                  }
                  className="bg-green-600 text-white"
                >
                  + Add Field
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid md:grid-cols-4 gap-3 items-center border-b pb-2"
                >

                  {/* NAME */}
                  <input
                    {...register(`fields.${index}.name`, {
                      required: true,
                    })}
                    className="input"
                    placeholder="Field name"
                  />

                  {/* UNIT */}
                  <input
                    {...register(`fields.${index}.unit`)}
                    className="input"
                    placeholder="Unit"
                  />

                  {/* RANGE */}
                  <input
                    {...register(`fields.${index}.normalRange`)}
                    className="input"
                    placeholder="Normal range"
                  />

                  {/* REMOVE */}
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 text-sm"
                  >
                    Remove
                  </button>

                </div>
              ))}

            </CardContent>
          </Card>

          {/* SUBMIT */}
          <Button
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white"
          >
            {isSubmitting ? "Updating..." : "Update Test"}
          </Button>

        </form>

      </div>
    </main>
  );
}