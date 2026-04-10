"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Doctor = {
  id: number;
  name: string;
  specialization: string;
  phone: string;
  experience: number;
};

export default function DoctorListPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filtered, setFiltered] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/doctor");
        const data = await res.json();
        
        setDoctors(data);
        setFiltered(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // 🔍 Search filter
  useEffect(() => {
    const result = doctors.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search)
    );

    setFiltered(result);
  }, [search, doctors]);

  // ❌ Delete doctor
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this doctor?")) return;

    try {
      await fetch(`/api/doctor/${id}`, {
        method: "DELETE",
      });

      setDoctors((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <main className="p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Doctor Management</h1>

        <Link href="/doctor/add">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            + Add Doctor
          </button>
        </Link>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search by name, specialization, phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No doctors found</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Name</th>
              <th className="p-3">Specialization</th>
              <th className="p-3">Experience</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="p-3">{d.name}</td>
                <td className="p-3">{d.specialization}</td>
                <td className="p-3">{d.experience} yrs</td>
                <td className="p-3">{d.phone}</td>

                <td className="p-3 flex gap-3">
                  <Link href={`/doctor/${d.id}`}>
                    <button className="text-blue-600">View</button>
                  </Link>

                  <Link href={`/doctor/edit/${d.id}`}>
                    <button className="text-yellow-600">Edit</button>
                  </Link>

                  <button
                    onClick={() => handleDelete(d.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}