import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Home, Hospital } from "lucide-react";
import Link from "next/link";

export default function Header(){
    return(
      <header className="sticky top-0 z-50 w-full bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-xl font-bold flex gap-2">
            <Hospital/> Hospital System
          </h1>
        </Link>

        <nav className="flex gap-6">
          <Link href="/"><Home/></Link>
          <Link href="/patient">Patients</Link>
          <Link href="/doctor">Doctors</Link>
          <ThemeToggle />
        </nav>
      </header>
    )
}