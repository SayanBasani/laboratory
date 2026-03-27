// async function getUsers() {
//   const res = await fetch('http://localhost:3000/api/users');
//   return res.json();
// }

// export default async function Home() {
//   const users = await getUsers();

//   return (
//     <div>
//       <h1>Users</h1>
//       {users.map((user: any) => (
//         <p key={user.id}>{user.name}</p>
//       ))}
//     </div>
//   );
// }


// app/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Activity, UserPlus, Calendar, FileText } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black dark:bg-slate-950 dark:text-white transition-colors duration-300">
      
      {/* NAVBAR */}
      <div className="flex justify-between items-center p-6">
        <h1 className="text-xl font-bold">Lab System</h1>
        <ThemeToggle />
      </div>

      {/* HERO */}
      <section className="text-center py-24 px-6">
        <h1 className="text-5xl font-bold mb-6">
          Smart Laboratory Management System
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
          Manage patients, tests, reports, and staff efficiently with a modern digital system.
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/patient/registation">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              Register Patient
            </Button>
          </Link>
          <Link href="/doctor/registation">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              Register Doctor
            </Button>
          </Link>
          <Button variant="outline">
            Go to Dashboard
          </Button>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="grid md:grid-cols-4 gap-6 px-10 pb-20">
        
        <Link href={'/patient/registation'}>
          <Card className="bg-gray-100 dark:bg-slate-900 hover:scale-105 transition">
            <CardContent className="p-6 text-center">
              <UserPlus className="mx-auto mb-4" />
              <h3 className="text-lg font-semibold">New Patient</h3>
            </CardContent>
          </Card>
        </Link>

        <Card className="bg-gray-100 dark:bg-slate-900 hover:scale-105 transition">
          <CardContent className="p-6 text-center">
            <Activity className="mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Add Test</h3>
          </CardContent>
        </Card>

        <Card className="bg-gray-100 dark:bg-slate-900 hover:scale-105 transition">
          <CardContent className="p-6 text-center">
            <Calendar className="mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Appointments</h3>
          </CardContent>
        </Card>

        <Card className="bg-gray-100 dark:bg-slate-900 hover:scale-105 transition">
          <CardContent className="p-6 text-center">
            <FileText className="mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Reports</h3>
          </CardContent>
        </Card>

      </section>

      {/* FEATURES */}
      <section className="px-10 py-20 bg-gray-100 dark:bg-slate-900 transition-colors">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          
          <Card className="p-6 bg-white dark:bg-slate-800">
            <h3 className="font-semibold mb-2">Dynamic Test Fields</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Automatically load test parameters like sugar, cholesterol, etc.
            </p>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800">
            <h3 className="font-semibold mb-2">PDF Reports</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Generate professional reports with header & footer.
            </p>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800">
            <h3 className="font-semibold mb-2">Patient History</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track all past test records in one place.
            </p>
          </Card>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 text-gray-600 dark:text-gray-400">
        © 2026 Your Lab Name | Contact: +91 XXXXX XXXXX
      </footer>

    </main>
  );
}