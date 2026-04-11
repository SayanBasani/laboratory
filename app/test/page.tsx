"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type TestType = {
  id: number;
  name: string;
  fields: { id: number }[];
  createdAt: string;
};

export default function TestListPage() {
  const [tests, setTests] = useState<TestType[]>([]);
  const [filtered, setFiltered] = useState<TestType[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // fetch tests
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch("/api/test");
        const data = await res.json();
        setTests(data);
        setFiltered(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  // filter
  useEffect(() => {
    const result = tests.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, tests]);

  // delete
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this test?")) return;

    try {
      await fetch(`/api/test/${id}`, {
        method: "DELETE",
      });

      setTests((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-white to-gray-100 dark:from-slate-950 dark:to-slate-900 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Test Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all lab test types
          </p>
        </div>

        <Link href="/test/create">
          <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white">
            + Create Test
          </Button>
        </Link>
      </div>

      {/* SEARCH */}
      <Card className="mb-6 bg-white/70 dark:bg-slate-900 backdrop-blur">
        <CardContent className="p-4">
          <input
            placeholder="Search test..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full"
          />
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="bg-white dark:bg-slate-900 shadow-lg">
        <CardContent className="p-0 overflow-x-auto">

          {loading ? (
            <div className="p-6 text-center">Loading tests...</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No tests found
            </div>
          ) : (
            <table className="w-full text-sm">

              <thead className="bg-gray-100 dark:bg-slate-800">
                <tr>
                  <th className="p-4 text-left">Test Name</th>
                  <th className="p-4 text-left">Fields</th>
                  <th className="p-4 text-left">Created</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((test) => (
                  <tr
                    key={test.id}
                    className="border-t hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                  >
                    <td className="p-4 font-medium">{test.name}</td>

                    <td className="p-4">
                      {test.fields.length} fields
                    </td>

                    <td className="p-4">
                      {new Date(test.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 flex gap-3">

                      <Link href={`/test/${test.id}`}>
                        <button className="text-blue-600 hover:underline">
                          View
                        </button>
                      </Link>

                      <Link href={`/test/edit/${test.id}`}>
                        <button className="text-yellow-600 hover:underline">
                          Edit
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDelete(test.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </CardContent>
      </Card>

    </main>
  );
}