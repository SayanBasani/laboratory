
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Doctor = {
  id: number;
  name: string;
};

type FormData = {
  problem: string;
  doctorId: string;
};

export default function AppointmentPage() {
  const { id } = useParams(); // patientId
  const router = useRouter();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  // ✅ Fetch Doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/doctors");
        const data = await res.json();
        setDoctors(data.doctors);
      } catch (err) {
        console.error("Failed to fetch doctors");
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  // ✅ Submit Appointment
  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        body: JSON.stringify({
          patientId: Number(id),
          doctorId: Number(data.doctorId),
          problem: data.problem,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      const result = await res.json();

      // 🔥 Redirect to next step (you can change later)
      router.push(`/`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-6">

      {/* BACK */}
      <Link href="/" className="absolute top-6 left-6">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:opacity-80">
          <ArrowLeft size={18} />
          Back
        </div>
      </Link>

      {/* CARD */}
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
        <CardContent className="p-8">

          {/* TITLE */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Assign Doctor</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Add patient problem and assign a doctor
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* PROBLEM */}
            <div>
              <label className="text-sm mb-1 block">Patient Problem</label>
              <textarea
                {...register("problem", {
                  required: "Problem is required",
                })}
                placeholder="Enter patient problem"
                rows={4}
                className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.problem && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.problem.message}
                </p>
              )}
            </div>

            {/* DOCTOR DROPDOWN */}
            <div>
              <label className="text-sm mb-1 block">Select Doctor</label>

              <select
                {...register("doctorId", {
                  required: "Please select a doctor",
                })}
                className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  {loadingDoctors ? "Loading doctors..." : "Select Doctor"}
                </option>

                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>

              {errors.doctorId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.doctorId.message}
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <Button
              disabled={isSubmitting}
              className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              {isSubmitting ? "Saving..." : "Assign Doctor"}
            </Button>

          </form>

        </CardContent>
      </Card>

    </main>
  );
}