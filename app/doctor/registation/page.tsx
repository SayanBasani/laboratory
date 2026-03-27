"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type FormData = {
  name: string;
  specialization: string;
  phone: string;
  email?: string;
  experience?: number;
  availability?: string;
  consultationFee?: number;
  isActive: boolean;
};

export default function DoctorRegister() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      isActive: true,
    },
  });

  const availability = watch("availability");
  const isActive = watch("isActive");

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/doctors", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed");

      router.push("/doctor");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-white to-gray-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-6">

      {/* BACK */}
      <Link href="/" className="absolute top-6 left-6">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:opacity-80">
          <ArrowLeft size={18} />
          Back
        </div>
      </Link>

      {/* CONTAINER */}
      <div className="w-full max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Doctor Registration</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add and manage doctors for your laboratory
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* 🧑 BASIC INFO */}
          <Card className="bg-white dark:bg-slate-900 border dark:border-slate-800">
            <CardContent className="p-6 space-y-5">

              <h2 className="text-lg font-semibold">Basic Information</h2>

              <div className="grid md:grid-cols-2 gap-5">

                <div>
                  <label className="label">Full Name</label>
                  <input {...register("name", { required: "Required" })} className="input" />
                  {errors.name && <p className="error">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="label">Specialization</label>
                  <input {...register("specialization", { required: "Required" })} className="input" />
                  {errors.specialization && <p className="error">{errors.specialization.message}</p>}
                </div>

                <div>
                  <label className="label">Phone</label>
                  <input {...register("phone", { required: "Required" })} className="input" />
                  {errors.phone && <p className="error">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="label">Email</label>
                  <input {...register("email")} className="input" />
                </div>

              </div>
            </CardContent>
          </Card>

          {/* 🩺 PROFESSIONAL INFO */}
          <Card className="bg-white dark:bg-slate-900 border dark:border-slate-800">
            <CardContent className="p-6 space-y-5">

              <h2 className="text-lg font-semibold">Professional Details</h2>

              <div className="grid md:grid-cols-2 gap-5">

                <div>
                  <label className="label">Experience (Years)</label>
                  <input type="number" {...register("experience")} className="input" />
                </div>

                <div>
                  <label className="label">Consultation Fee</label>
                  <input type="number" {...register("consultationFee")} className="input" />
                </div>

              </div>
            </CardContent>
          </Card>

          {/* 🕒 AVAILABILITY */}
          <Card className="bg-white dark:bg-slate-900 border dark:border-slate-800">
            <CardContent className="p-6 space-y-5">

              <h2 className="text-lg font-semibold">Availability</h2>

              <div className="flex gap-3 flex-wrap">

                {["morning", "evening", "full-day"].map((time) => (
                  <button
                    type="button"
                    key={time}
                    onClick={() => setValue("availability", time)}
                    className={`px-4 py-2 rounded-xl border transition ${
                      availability === time
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-slate-800"
                    }`}
                  >
                    {time}
                  </button>
                ))}

              </div>

            </CardContent>
          </Card>

          {/* ⚙ STATUS */}
          <Card className="bg-white dark:bg-slate-900 border dark:border-slate-800">
            <CardContent className="p-6 flex items-center justify-between">

              <div>
                <h2 className="font-semibold">Doctor Status</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enable or disable this doctor
                </p>
              </div>

              <button
                type="button"
                onClick={() => setValue("isActive", !isActive)}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition ${
                  isActive ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                <div
                  className={`bg-white w-6 h-6 rounded-full shadow transform transition ${
                    isActive ? "translate-x-6" : ""
                  }`}
                />
              </button>

            </CardContent>
          </Card>

          {/* SUBMIT */}
          <Button
            disabled={isSubmitting}
            className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            {isSubmitting ? "Saving..." : "Register Doctor"}
          </Button>

        </form>
      </div>
    </main>
  );
}