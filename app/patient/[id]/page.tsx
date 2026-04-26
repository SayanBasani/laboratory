"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { File, Package } from "lucide-react";

type Patient = {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  address?: string;
};

type Appointment = {
  id: number;

  reason: string;
  notes?: string;

  scheduledAt: string;
  duration?: number;

  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  mode: "ONLINE" | "OFFLINE";

  fee?: number;
  paid: boolean;

  createdAt: string;
  updatedAt: string;

  doctor: {
    id: number;
    name: string;
    specialization?: string;
  };

  patient: {
    id: number;
    name: string;
    phone?: string;
  };
};

export default function PatientDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 FETCH DATA
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // Patient
        const res1 = await fetch(`/api/patient/${id}`);
        const patientData = await res1.json();
        setPatient(patientData.patient);

        // Appointments
        const res2 = await fetch(`/api/appointment/patient/${id}`);
        const apptData = await res2.json();
        console.log("apptData");
        console.log(apptData);
        setAppointments(apptData.appointments);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);


  // ❌ DELETE
  const handleDelete = async () => {
    if (!confirm("Delete this patient?")) return;

    await fetch(`/api/patient/${id}`, {
      method: "DELETE",
    });

    router.push("/patient/");
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center h-[60vh]">
        Loading...
      </main>
    );
  }

  if (!patient) {
    return (
      <main className="flex items-center justify-center h-[60vh]">
        Patient not found
      </main>
    );
  }

  return (
    <main className="bg-gray-50 dark:bg-slate-950 min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* 🔙 HEADER ACTIONS */}
        <div className="flex justify-between items-center">
          <Link href="/patient" className="text-blue-600">
            ← Back
          </Link>

          <div className="flex gap-3">
            <Link href={`/patient/edit/${patient.id}`}>
              <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg">
                Edit
              </button>
            </Link>

            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Delete
            </button>
          </div>
        </div>

        {/* 👤 PATIENT CARD */}
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6 flex justify-between items-center">

            <div>
              <h1 className="text-3xl font-bold">{patient.name}</h1>
              <p className="text-gray-500">
                Patient ID: #{patient.id}
              </p>
            </div>

            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              Active
            </span>

          </CardContent>
        </Card>

        {/* 📊 INFO + ACTIONS */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* INFO */}
          <Card className="rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Basic Info</h2>

              <div className="space-y-2 text-sm">
                <p><b>Age:</b> {patient.age}</p>
                <p><b>Gender:</b> {patient.gender}</p>
                <p><b>Phone:</b> {patient.phone}</p>
                <p><b>Address:</b> {patient.address || "-"}</p>
              </div>
            </CardContent>
          </Card>

          {/* QUICK ACTION */}
          <Card className="rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Quick Actions</h2>

              <div className="flex flex-col gap-3">
                <Link href={`/patient/appointment/${patient.id}`}>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg cursor-pointer">
                    Assign Appointment
                  </button>
                </Link>

                <button className="w-full bg-gray-200 dark:bg-slate-800 py-2 rounded-lg">
                  View Reports
                </button>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* 📅 APPOINTMENTS */}
        <Card className="rounded-2xl">
          <CardContent className="p-6">

            <h2 className="text-lg font-semibold mb-4">
              Appointments
            </h2>

            {appointments.length === 0 ? (
              <p className="text-gray-500">
                No appointments yet
              </p>
            ) : (
              <div className="space-y-3">
                {appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-4 border rounded-xl flex justify-between items-center"
                  >
                    <div className="cursor-pointer">
                      <Link href={`/doctor/${appt.doctor?.id}`}>
                          <p className="font-medium">
                              Dr. {appt.doctor?.name}
                          </p>
                      </Link>
                      <p className="text-sm text-gray-500">
                        {appt.reason}
                      </p>

                      {appt.createdAt && (
                        <p className="text-xs text-gray-400" 
                        style={{color: (new Date(appt.scheduledAt).getTime() > new Date().getTime()) ? "green" : (appt.status == "COMPLETED" ? "blue" : "red") }}
                        >
                          {new Date(appt.scheduledAt).toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 items-end">

                      {/* ACTION LABEL */}
                      <p className="text-xs text-gray-400 mb-1">Actions</p>

                      {/* ACTION BUTTONS */}
                      <div className="flex gap-2">

                        {/* DOCTOR REPORT */}
                        <Link href={`/doctor-report/${appt.id}`}>
                          <button className="cursor-pointer flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                            <File size={14} />
                            Doctor Report
                          </button>
                        </Link>

                        {/* TEST REPORT */}
                        <Link href={`/test-entry/${appt.id}`}>
                          <button className="cursor-pointer flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition">
                            <File size={14} />
                            Test Report
                          </button>
                        </Link>

                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

          </CardContent>
        </Card>

        {/* 🧪 TEST RECORDS */}
        <Card className="rounded-2xl">
          <CardContent className="p-6">

            <h2 className="text-lg font-semibold mb-4">
              Test Records
            </h2>

            <p className="text-gray-500">
              No test records available
            </p>

          </CardContent>
        </Card>

      </div>
    </main>
  );
}