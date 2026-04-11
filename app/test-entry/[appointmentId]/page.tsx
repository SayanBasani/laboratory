"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Appointment = {
  id: number;
  scheduledAt: string;
  patient: {
    name: string;
    age: number;
    gender: string;
    phone: string;
  };
  doctor: {
    name: string;
    specialization: string;
  };
};

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

export default function TestEntryPage() {
  const { appointmentId } = useParams();
  const router = useRouter();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [tests, setTests] = useState<TestType[]>([]);
  const [selectedTest, setSelectedTest] = useState<TestType | null>(null);

  const { register, handleSubmit, reset } = useForm();

  // fetch appointment
  useEffect(() => {
    fetch(`/api/appointment/${appointmentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.appointment) {
          setAppointment(data.appointment);
        } else {
          setAppointment(null);
        }
      });
    
  }, [appointmentId]);
  useEffect(()=>{
    console.log("appointment :- ")
    console.log(appointment)
  },[appointment])
  // fetch tests
  useEffect(() => {
    fetch("/api/test")
      .then((res) => res.json())
      .then(setTests);
  }, []);

  const handleSelectTest = (id: string) => {
    const test = tests.find((t) => t.id === Number(id));
    setSelectedTest(test || null);
    reset();
  };

  const onSubmit = async (data: any) => {
    await fetch("/api/test-result", {
      method: "POST",
      body: JSON.stringify({
        appointmentId: Number(appointmentId),
        testTypeId: selectedTest?.id,
        values: data,
      }),
    });

    router.push("/test-records");
  };
  if (!appointment) return <div className="p-6">Loading...</div>;

  return (
    <main className="min-h-screen bg-linear-to-br from-white to-gray-100 dark:from-slate-950 dark:to-slate-900 p-6">

      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <h1 className="text-3xl font-bold">Test Entry</h1>

        {/* 🧾 PATIENT + DOCTOR INFO */}
        <div className="grid md:grid-cols-2 gap-4">

          {/* PATIENT */}
          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-5 space-y-2">
              <h2 className="font-semibold">Patient Info</h2>
              <p><b>Name:</b> {appointment?.patient.name}</p>
              <p><b>Age:</b> {appointment?.patient.age}</p>
              <p><b>Gender:</b> {appointment.patient.gender}</p>
              <p><b>Phone:</b> {appointment.patient.phone}</p>
            </CardContent>
          </Card>

          {/* DOCTOR */}
          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-5 space-y-2">
              <h2 className="font-semibold">Doctor Info</h2>
              <p><b>Name:</b> {appointment.doctor.name}</p>
              <p><b>Specialization:</b> {appointment.doctor.specialization}</p>
              <p>
                <b>Date:</b>{" "}
                {new Date(appointment.scheduledAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>

        </div>

        {/* SELECT TEST */}
        <Card className="bg-white dark:bg-slate-900">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-3">Select Test</h2>

            <select
              onChange={(e) => handleSelectTest(e.target.value)}
              className="input"
            >
              <option value="">Select Test</option>
              {tests.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {/* TEST FIELDS */}
        {selectedTest && (
          <form onSubmit={handleSubmit(onSubmit)}>

            <Card className="bg-white dark:bg-slate-900">
              <CardContent className="p-6">

                <h2 className="font-semibold mb-4">
                  {selectedTest.name} Results
                </h2>

                {/* TABLE STYLE FORM */}
                <div className="space-y-3">

                  {selectedTest.fields.map((field) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-3 gap-4 items-center border-b pb-2"
                    >

                      {/* NAME */}
                      <div>
                        <p className="font-medium">{field.name}</p>
                        <p className="text-xs text-gray-500">
                          {field.normalRange}
                        </p>
                      </div>

                      {/* INPUT */}
                      <input
                        {...register(field.name, { required: true })}
                        className="input"
                        placeholder="Enter value"
                      />

                      {/* UNIT */}
                      <div className="text-sm text-gray-500">
                        {field.unit}
                      </div>

                    </div>
                  ))}

                </div>

              </CardContent>
            </Card>

            {/* SUBMIT */}
            <Button className="w-full mt-4 bg-blue-600 text-white">
              Save Test Result
            </Button>

          </form>
        )}

      </div>
    </main>
  );
}