"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Report = {
  id: number;
  patientName: string;
  doctorName: string;
  testTypeId: number;
  createdAt: string;
};

export default function ReportListPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filtered, setFiltered] = useState<Report[]>([]);
  const [search, setSearch] = useState("");

  // 📡 Fetch reports
  useEffect(() => {
    fetch("/api/report")
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
        setFiltered(data);
      });
  }, []);

  // 🔍 Search
  useEffect(() => {
    const result = reports.filter((r) =>
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.doctorName.toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(result);
  }, [search, reports]);

  // ❌ Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this report?")) return;

    await fetch(`/api/report/${id}`, { method: "DELETE" });

    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">

      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Report Management</h1>

          <Link href="/report/create">
            <button className="btn-primary">
              + Create Report
            </button>
          </Link>
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search by patient or doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
        />

        {/* TABLE */}
        <div className="card overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-100 dark:bg-slate-700">
              <tr>
                <th className="p-3 text-left">Patient</th>
                <th className="p-3 text-left">Doctor</th>
                <th className="p-3 text-left">Test ID</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t">

                  <td className="p-3">{r.patientName}</td>
                  <td className="p-3">{r.doctorName}</td>
                  <td className="p-3">{r.testTypeId}</td>

                  <td className="p-3">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3 flex gap-3 text-sm">

                    <Link href={`/report/${r.id}`}>
                      <span className="text-blue-600 cursor-pointer">View</span>
                    </Link>

                    <Link href={`/report/edit/${r.id}`}>
                      <span className="text-yellow-600 cursor-pointer">Edit</span>
                    </Link>

                    <span
                      onClick={() => handleDelete(r.id)}
                      className="text-red-600 cursor-pointer"
                    >
                      Delete
                    </span>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>

          {filtered.length === 0 && (
            <p className="p-4 text-center text-gray-500">
              No reports found
            </p>
          )}

        </div>

      </div>
    </main>
  );
}