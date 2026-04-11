"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, File, Plus } from "lucide-react";
import Link from "next/link";

export default function DoctorDetailPage() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/doctor/${id}`)
      .then((res) => res.json())
      .then((data)=>{setDoctor(data.doctor)});

    fetch(`/api/appointment?doctorId=${id}`)
      .then((res) => res.json())
      .then(setAppointments);
  }, [id]);

  if (!doctor) return <div className="p-6">Loading...</div>;

  const upcoming = appointments.filter(
    (a) => a.status === "SCHEDULED"
  );

  const completed = appointments.filter(
    (a) => a.status === "COMPLETED"
  );

  return (
    <main className="min-h-screen bg-linear-to-br from-white to-gray-100 dark:from-slate-950 dark:to-slate-900 p-6">

      {/* 🔙 HEADER ACTIONS */}
      <div className="flex justify-between items-center mb-3">
        <Link href="/doctor" className="text-blue-600">
          ← Back
        </Link>

        <div className="flex gap-3">
          <Link href={`/doctor/edit/${doctor.id}`}>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg">
              Edit
            </button>
          </Link>

          <button
            // onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <Card className="bg-white dark:bg-slate-900">
          <CardContent className="p-6 flex justify-between items-center">

            <div>
              <h1 className="text-3xl font-bold">{doctor.name}</h1>
              <p className="text-gray-500">
                {doctor.specialization}
              </p>
              <p className="text-sm text-gray-400">
                {doctor.phone}
              </p>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm ${
                doctor.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {doctor.isActive ? "Active" : "Inactive"}
            </span>

          </CardContent>
        </Card>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-4">

          <Stat title="Total" value={appointments.length} />
          <Stat title="Upcoming" value={upcoming.length} />
          <Stat title="Completed" value={completed.length} />
          <Stat title="Cancelled" value={
            appointments.filter(a => a.status === "CANCELLED").length
          } />

        </div>

        {/* UPCOMING */}
        <Card className="bg-white dark:bg-slate-900">
          <CardContent className="p-6">

            <h2 className="font-semibold mb-4">
              Upcoming Appointments
            </h2>

            {upcoming.map((a) => (
              <Row key={a.id} appointment={a} />
            ))}

          </CardContent>
        </Card>

        {/* COMPLETED */}
        <Card className="bg-white dark:bg-slate-900">
          <CardContent className="p-6">

            <h2 className="font-semibold mb-4">
              Completed Appointments
            </h2>

            {completed.map((a) => (
              <Row key={a.id} appointment={a} />
            ))}

          </CardContent>
        </Card>

      </div>
    </main>
  );
}

// STAT CARD
function Stat({ title, value }: any) {
  return (
    <Card className="bg-white dark:bg-slate-900">
      <CardContent className="p-4 text-center">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

// ROW
function Row({ appointment }: any) {
  return (
    <div className="flex justify-between items-center border-b py-2">

      <div>
        <p className="font-medium">{appointment.patient.name}</p>
        <p className="text-xs text-gray-500">
          {new Date(appointment.scheduledAt).toLocaleString()}
        </p>
      </div>

      <div className="flex gap-3 text-sm">

        <a href={`/patient/${appointment.patient.id}`} className="flex gap-2 items-center text-blue-600">
          <Eye size={15} /> View
        </a>

        <Link href={`/test-entry/${appointment.id}`} className="flex gap-2 items-center text-green-600">
          <Plus size={15} /> Add Test
        </Link>

        <Link href={`/test/${appointment.id}`} className="flex gap-2 items-center text-purple-600">
          <File size={15} />
          Report
        </Link>

      </div>

    </div>
  );
}

