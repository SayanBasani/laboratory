"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

type Doctor = {
  id: number;
  name: string;
  specialization: string;
  phone: string;
  experience?: number;
  consultationFee?: number;
  isActive: boolean;
};

export default function DoctorListPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filtered, setFiltered] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/doctor");
        const data = await res.json();
        setDoctors(data.doctors);
        setFiltered(data.doctors);
        setDoctors(Array.isArray(data) ? data : data.doctors || []);
        setFiltered(Array.isArray(data) ? data : data.doctors || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = doctors;

    if (search) {
      result = result.filter((doc) =>
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((doc) =>
        statusFilter === "active" ? doc.isActive : !doc.isActive
      );
    }

    setFiltered(result);
  }, [search, statusFilter, doctors]);

  // Delete doctor
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Delete this doctor?");
    if (!confirmDelete) return;

    try {
      await fetch(`/api/doctors/${id}`, {
        method: "DELETE",
      });

      setDoctors((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Doctor Management</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage all registered doctors
          </p>
        </div>

        <Link href="/doctor/registation">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            + Add Doctor
          </Button>
        </Link>
      </div>

      {/* FILTER BAR */}
      <Card className="mb-6 bg-gray-50 dark:bg-slate-900">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">

          {/* SEARCH */}
          <input
            placeholder="Search doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input flex-1"
          />

          {/* STATUS FILTER */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="bg-white dark:bg-slate-900">
        <CardContent className="p-0 overflow-x-auto">

          {loading ? (
            <div className="p-6 text-center">Loading doctors...</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No doctors found
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-slate-800 text-left">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Specialization</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4">Fee</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-t hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                  >
                    <td className="p-4 font-medium">{doc.name}</td>
                    <td className="p-4">{doc.specialization}</td>
                    <td className="p-4">{doc.phone}</td>
                    <td className="p-4">
                      {doc.experience ? `${doc.experience} yrs` : "-"}
                    </td>
                    <td className="p-4">
                      {doc.consultationFee ? `₹${doc.consultationFee}` : "-"}
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          doc.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {doc.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 flex gap-3">

                      <Link href={`/doctor/edit/${doc.id}`}>
                        <button className="text-blue-600 hover:underline">
                          Edit
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDelete(doc.id)}
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