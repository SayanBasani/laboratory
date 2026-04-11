"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

type Appointment = {
  id: number;
  reason: string;
  scheduledAt: string;
  status: string;
  fee?: number;
  paid: boolean;

  patient: {
    name: string;
  };

  doctor: {
    name: string;
    specialization: string;
  };
};

export default function AppointmentPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filtered, setFiltered] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [paid, setPaid] = useState("all");
  const [loading, setLoading] = useState(true);

  // fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/appointment");
        const data = await res.json();
        setAppointments(data);
        setFiltered(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // filtering
  useEffect(() => {
    let result = appointments;

    if (search) {
      result = result.filter(
        (a) =>
          a.patient.name.toLowerCase().includes(search.toLowerCase()) ||
          a.doctor.name.toLowerCase().includes(search.toLowerCase()) ||
          a.reason.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== "all") {
      result = result.filter((a) => a.status === status);
    }

    if (paid !== "all") {
      result = result.filter((a) =>
        paid === "paid" ? a.paid : !a.paid
      );
    }

    setFiltered(result);
  }, [search, status, paid, appointments]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;

    await fetch(`/api/appointment/${id}`, {
        method: "DELETE",
    });

    // refresh data
    setAppointments(appointments.filter((a) => a.id !== id));
    setFiltered(filtered.filter((a) => a.id !== id));
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-white to-gray-100 dark:from-slate-950 dark:to-slate-900 p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Appointment Management</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage all patient appointments
        </p>
      </div>

      {/* FILTER BAR */}
      <Card className="mb-6 bg-white/70 dark:bg-slate-900 backdrop-blur">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">

          {/* SEARCH */}
          <input
            placeholder="Search patient, doctor, reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full"
          />

          {/* STATUS */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input"
          >
            <option value="all">All Status</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No Show</option>
          </select>

          {/* PAYMENT */}
          <select
            value={paid}
            onChange={(e) => setPaid(e.target.value)}
            className="input"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>

        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="bg-white dark:bg-slate-900 shadow-lg">
        <CardContent className="p-0 overflow-x-auto">

          {loading ? (
            <div className="p-6 text-center">Loading appointments...</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No appointments found
            </div>
          ) : (
            <table className="w-full text-sm">

              <thead className="bg-gray-100 dark:bg-slate-800">
                <tr>
                  <th className="p-4 text-left">Patient</th>
                  <th className="p-4 text-left">Doctor</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Reason</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Payment</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((a) => (
                  <tr
                    key={a.id}
                    className="border-t hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                  >
                    <td className="p-4">{a.patient.name}</td>
                    <td className="p-4">
                      {a.doctor.name}
                      <div className="text-xs text-gray-500">
                        {a.doctor.specialization}
                      </div>
                    </td>

                    <td className="p-4">
                      {new Date(a.scheduledAt).toLocaleString()}
                    </td>

                    <td className="p-4">{a.reason}</td>

                    {/* STATUS */}
                    <td className="p-4">
                      <span className="badge-status">
                        {a.status}
                      </span>
                    </td>

                    {/* PAYMENT */}
                    <td className="p-4">
                      <span
                        className={
                          a.paid ? "text-green-600" : "text-red-600"
                        }
                      >
                        {a.paid ? "Paid" : "Unpaid"}
                      </span>
                      {a.fee && (
                        <div className="text-xs">₹{a.fee}</div>
                      )}
                    </td>

                    {/* ACTION */}
                    <td className="p-4">
                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">

                            <Link href={`/appointment/${a.id}`}>
                            <button className="w-full sm:w-auto px-3 py-1 rounded-md text-blue-600 hover:bg-blue-50">
                                <Eye size={16} strokeWidth={1.5}/>
                            </button>
                            </Link>

                            <Link href={`/appointment/${a.id}/edit`}>
                            <button className="w-full sm:w-auto px-3 py-1 rounded-md text-green-600 hover:bg-green-50">
                                <Pencil size={16} strokeWidth={1.5}/>
                            </button>
                            </Link>

                            <button
                            onClick={() => handleDelete(a.id)}
                            className="w-full sm:w-auto px-3 py-1 rounded-md text-red-600 hover:bg-red-50"
                            >
                            <Trash2 size={16} strokeWidth={1.5}/>
                            </button>

                        </div>
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