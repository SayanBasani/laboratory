"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type TestType = {
  id: number;
  name: string;
  fields: {
    id: number;
    name: string;
    unit?: string;
    normalRange?: string;
  }[];
};

export default function CreateReportPage() {
  const { register, setValue, handleSubmit } = useForm();

  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);

  const [tests, setTests] = useState<TestType[]>([]);
  const [selectedTest, setSelectedTest] = useState<TestType | null>(null);

  // 🧪 Fetch tests
  useEffect(() => {
    fetch("/api/test")
      .then((res) => res.json())
      .then(setTests);
  }, []);

  // 🔍 Patient search
  const searchPatient = async (q: string) => {
    if (!q) {
      setPatients([]);
      setShowPatientDropdown(false);
      return;
    }

    const res = await fetch(`/api/patient?search=${q}`);
    const data = await res.json();

    setPatients(data.patient || []);
    setShowPatientDropdown(true);
  };

  // 🔍 Doctor search
  const searchDoctor = async (q: string) => {
    if (!q) {
      setDoctors([]);
      setShowDoctorDropdown(false);
      return;
    }

    const res = await fetch(`/api/doctor?search=${q}`);
    const data = await res.json();

    setDoctors(Array.isArray(data) ? data : []);
    setShowDoctorDropdown(true);
  };

  // ✅ Select patient
  const selectPatient = (p: any) => {
    setShowPatientDropdown(false);

    setValue("patientId", p.id);
    setValue("patientName", p.name);
    setValue("patientAge", p.age);
    setValue("patientGender", p.gender);
    setValue("patientPhone", p.phone);
  };

  // ✅ Select doctor
  const selectDoctor = (d: any) => {
    setShowDoctorDropdown(false);

    setValue("doctorId", d.id);
    setValue("doctorName", d.name);
    setValue("doctorSpecialization", d.specialization);
  };

  // 🧪 Select test
  const handleTestSelect = (id: string) => {
    const t = tests.find((t) => t.id === Number(id));
    setSelectedTest(t || null);
  };

  // 🚀 Submit
  const onSubmit = async (data: any) => {
    await fetch("/api/report", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        testTypeId: selectedTest?.id,
      }),
    });

    alert("Report Created Successfully");
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold">Create Report</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* 👤 PATIENT */}
          <section className="card">
            <h2 className="section-title">Patient Details</h2>

            <div className="relative">
              <input
                placeholder="Search patient..."
                onChange={(e) => searchPatient(e.target.value)}
                className="input"
              />

              {showPatientDropdown && patients.length > 0 && (
                <div className="dropdown text-black">
                  {patients.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => selectPatient(p)}
                      className="dropdown-item"
                    >
                      {p.name} • {p.phone}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <input {...register("patientName")} placeholder="Name" className="input" />
              <input {...register("patientAge")} placeholder="Age" className="input" />
              <input {...register("patientGender")} placeholder="Gender" className="input" />
              <input {...register("patientPhone")} placeholder="Phone" className="input" />
            </div>
          </section>

          {/* 👨‍⚕️ DOCTOR */}
          <section className="card">
            <h2 className="section-title">Doctor Details</h2>

            <div className="relative">
              <input
                placeholder="Search doctor..."
                onChange={(e) => searchDoctor(e.target.value)}
                className="input"
              />

              {showDoctorDropdown && doctors.length > 0 && (
                <div className="dropdown text-black">
                  {doctors.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => selectDoctor(d)}
                      className="dropdown-item"
                    >
                      {d.name} • {d.specialization}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <input {...register("doctorName")} placeholder="Doctor Name" className="input" />
              <input {...register("doctorSpecialization")} placeholder="Specialization" className="input" />
            </div>
          </section>

          {/* 🧪 TEST SELECT */}
          <section className="card">
            <h2 className="section-title">Select Test</h2>

            <select
              onChange={(e) => handleTestSelect(e.target.value)}
              className="input"
            >
              <option value="">Select Test</option>
              {tests.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </section>

          {/* 🧪 TEST RESULT TABLE */}
          {selectedTest && (
            <section className="card">
              <h2 className="section-title">{selectedTest.name} Results</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border rounded-xl overflow-hidden">

                  <thead className="bg-gray-100 dark:bg-slate-700">
                    <tr>
                      <th className="p-3 text-left">Parameter</th>
                      <th className="p-3 text-left">Value</th>
                      <th className="p-3 text-left">Unit</th>
                      <th className="p-3 text-left">Normal Range</th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedTest.fields.map((f) => (
                      <tr key={f.id} className="border-t">
                        <td className="p-3 font-medium">{f.name}</td>

                        <td className="p-3">
                          <input
                            {...register(`values.field_${f.id}`)} // ✅ FIXED
                            className="input-small"
                            placeholder="Enter value"
                          />
                        </td>

                        <td className="p-3 text-gray-500">
                          {f.unit || "-"}
                        </td>

                        <td className="p-3 text-gray-500">
                          {f.normalRange || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </section>
          )}

          <button className="btn-primary w-full">
            Create Report
          </button>

        </form>
      </div>
    </main>
  );
}