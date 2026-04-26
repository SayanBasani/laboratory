"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Field = {
  id: number;
  name: string;
  unit?: string;
  normalRange?: string;
};

type TestType = {
  id: number;
  name: string;
  createdAt: string;
  fields: Field[];
};

export default function TestDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const router = useRouter();
  const [test, setTest] = useState<TestType | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/test/${id}`)
      .then((res) => res.json())
      .then(setTest);
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this test?")) return;

    await fetch(`/api/test/${id}`, { method: "DELETE" });
    router.push("/test");
  };

  if (!test)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading test details...
      </div>
    );

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-200 dark:from-slate-950 dark:to-slate-900 p-6">
      <nav className="flex justify-start items-start py-4">
        <Link href="/test">
          <Button className="bg-blue-500 hover:bg-blue-600 text-black dark:text-white shadow">
            <ArrowLeft className="w-4 h-4 " />
          </Button>
        </Link>
      </nav>
      <div className="max-w-5xl mx-auto space-y-6 grid">

        {/* HEADER CARD */}
        
        <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {test.name}
              </h1>

              <p className="text-gray-500 mt-1 text-sm">
                Created on{" "}
                {new Date(test.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-3">

              <Link href={`/test/edit/${test.id}`}>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white shadow">
                  ✏️ Edit
                </Button>
              </Link>

              <Button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white shadow"
              >
                🗑 Delete
              </Button>

            </div>

          </CardContent>
        </Card>

        {/* TABLE CARD */}
        <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
          <CardContent className="p-0 overflow-hidden">

            <div className="px-6 py-4 border-b bg-linear-to-r from-blue-500 to-indigo-500 text-white font-semibold">
              Test Parameters
            </div>

            {test.fields.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No fields available for this test.
              </div>
            ) : (
              <table className="w-full text-sm">

                <thead className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="p-4 text-left">Parameter</th>
                    <th className="p-4 text-left">Unit</th>
                    <th className="p-4 text-left">Normal Range</th>
                  </tr>
                </thead>

                <tbody>
                  {test.fields.map((field, index) => (
                    <tr
                      key={field.id}
                      className={`border-t transition hover:bg-blue-50 dark:hover:bg-slate-800 ${
                        index % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-gray-50 dark:bg-slate-950"
                      }`}
                    >
                      <td className="p-4 font-medium">
                        {field.name}
                      </td>

                      <td className="p-4 text-gray-600">
                        {field.unit || "-"}
                      </td>

                      <td className="p-4 text-gray-600">
                        {field.normalRange || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            )}

          </CardContent>
        </Card>

      </div>
    </main>
  );
}