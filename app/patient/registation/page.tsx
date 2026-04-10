"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function RegisterPatient() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Patient Data:", form);
    try{
      const res = await fetch("/api/patient/registation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if(!res.ok) throw new Error("Failed to save user");
      const result = await res.json();
      alert('User saved!');
      router.push(`/patient/appointment/${result.id}`);
    }catch(error){
      console.log(error);
      alert('Failed to save user');
    }

  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-white to-gray-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-6">

      {/* BACK BUTTON */}
      <Link href="/" className="absolute top-6 left-6">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:opacity-80">
          <ArrowLeft size={18} /> Back
        </div>
      </Link>

      {/* FORM CARD */}
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
        <CardContent className="p-8">

          {/* TITLE */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Patient Registration</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Enter patient details to create a new record
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* GRID */}
            <div className="grid md:grid-cols-2 gap-5">

              {/* NAME */}
              <div>
                <label className="text-sm mb-1 block">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter Patient name"
                  className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* AGE */}
              <div>
                <label className="text-sm mb-1 block">Age</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Enter Patient Age"
                  className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* GENDER */}
              <div>
                <label className="text-sm mb-1 block">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* PHONE */}
              <div>
                <label className="text-sm mb-1 block">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

            </div>

            {/* ADDRESS */}
            <div>
              <label className="text-sm mb-1 block">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter full address"
                rows={3}
                className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* BUTTON */}
            <Button className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition">
              Register Patient
            </Button>

          </form>

        </CardContent>
      </Card>

    </main>
  );
}