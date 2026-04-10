"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";

type Doctor = {
  id: number;
  name: string;
};

type FormData = {
  reason: string;
  notes?: string;
  doctorId: string;
  scheduledAt: string;
  duration?: number;
  status: string;
  mode: string;
  fee?: number;
  paid: boolean;
};

export default function AppointmentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  // 🔥 Fetch Doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await fetch("/api/doctor");
      const data = await res.json();
      setDoctors(data.doctors);
    };

    fetchDoctors();
  }, []);

  // 🚀 Submit
  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: Number(id),
          doctorId: Number(data.doctorId),
          reason: data.reason,
          notes: data.notes,
          scheduledAt: new Date(data.scheduledAt),
          duration: Number(data.duration),
          status: data.status,
          mode: data.mode,
          fee: Number(data.fee),
          paid: data.paid,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      router.push(`/patient/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create appointment");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <Link href={`/patient/${id}`} className="text-blue-600">
            ← Back
          </Link>

          <h1 className="text-2xl font-bold">
            Create Appointment
          </h1>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow space-y-6"
        >

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* REASON */}
            <div>
              <label className="label">Reason</label>
              <input
                {...register("reason", { required: true })}
                className="input"
                placeholder="Enter reason"
              />
            </div>

            {/* DOCTOR */}
            <div>
              <label className="label">Doctor</label>
              <select {...register("doctorId", { required: true })} className="input">
                <option value="">Select Doctor</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DATE */}
            <div>
              <label className="label">Schedule Date</label>
              <input
                type="datetime-local"
                {...register("scheduledAt", { required: true })}
                className="input"
              />
            </div>

            {/* DURATION */}
            <div>
              <label className="label">Duration (minutes)</label>
              <input
                type="number"
                {...register("duration")}
                className="input"
              />
            </div>

            {/* MODE */}
            <div>
              <label className="label">Mode</label>
              <select {...register("mode")} className="input">
                <option value="OFFLINE">Offline</option>
                <option value="ONLINE">Online</option>
              </select>
            </div>

            {/* STATUS */}
            <div>
              <label className="label">Status</label>
              <select {...register("status")} className="input">
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_SHOW">No Show</option>
              </select>
            </div>

            {/* FEE */}
            <div>
              <label className="label">Consultation Fee</label>
              <input
                type="number"
                {...register("fee")}
                className="input"
              />
            </div>

            {/* PAID */}
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" {...register("paid")} />
              <label>Payment Completed</label>
            </div>

          </div>

          {/* NOTES */}
          <div>
            <label className="label">Notes</label>
            <textarea
              {...register("notes")}
              className="input"
              rows={3}
              placeholder="Optional notes..."
            />
          </div>

          {/* BUTTON */}
          <button
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-xl"
          >
            {isSubmitting ? "Saving..." : "Create Appointment"}
          </button>

        </form>

      </div>
    </main>
  );
}