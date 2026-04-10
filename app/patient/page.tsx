// export default async function patientList(){
//     const patient = await fetch('/api/patient/patientList')
//     const data = await patient.json();
//     console.log(data);
//     return (
//         <div>
//             All Patient
//         </div>
//     )
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Patient = {
  id: number;
  name: string;
  age: number;
  phone: string;
};

export default function PatientListPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filtered, setFiltered] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("/api/patient");
        const data = await res.json();
        setPatients(data.patient);
        setFiltered(data.patient);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // search filter
  useEffect(() => {
    const result = patients.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
    );
    setFiltered(result);
  }, [search, patients]);

  // delete
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this patient?")) return;

    try {
      await fetch(`/api/patient/${id}`, {
        method: "DELETE",
      });

      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-slate-950 dark:to-slate-900 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Patient Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all registered patients
          </p>
        </div>

        <Link href="/patient/registation">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            + Add Patient
          </Button>
        </Link>
      </div>

      {/* SEARCH */}
      <Card className="mb-6 bg-white/70 dark:bg-slate-900 backdrop-blur">
        <CardContent className="p-4">
          <input
            placeholder="Search by name or phone..."
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
            <div className="p-6 text-center">Loading patients...</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No patients found
            </div>
          ) : (
            <table className="w-full text-sm">

              <thead className="bg-gray-100 dark:bg-slate-800">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Age</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                  >
                    <td className="p-4 font-medium">{p.name}</td>
                    <td className="p-4">{p.age}</td>
                    <td className="p-4">{p.phone}</td>

                    <td className="p-4 flex gap-3">

                      <Link href={`/patient/${p.id}`}>
                        <button className="text-blue-600 hover:underline">
                          View
                        </button>
                      </Link>

                      <Link href={`/patient/edit/${p.id}`}>
                        <button className="text-yellow-600 hover:underline">
                          Edit
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>

                      <Link href={`/patient/appointment/${p.id}`}>
                        <button className="text-green-600 hover:underline">
                          Assign
                        </button>
                      </Link>

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