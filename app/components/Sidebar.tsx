"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  UserPlus, 
  Users, 
  Stethoscope, 
  Activity, 
  Calendar, 
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Register Patient", href: "/patient/registation", icon: UserPlus },
    { name: "Patient List", href: "/patient", icon: Users },
    { name: "Register Doctor", href: "/doctor/registation", icon: Stethoscope },
    { name: "Doctor List", href: "/doctor", icon: Users },
    { name: "Add Test", href: "/test", icon: Activity },
    { name: "Appointments", href: "/appoinment", icon: Calendar },
  ];

  return (
    <aside
      className={cn(
        "bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-all duration-300 ease-in-out relative flex flex-col h-[calc(100vh-64px)]",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="p-4 flex justify-end border-b border-gray-200 dark:border-slate-800">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                  )}
                  title={!isOpen ? item.name : undefined}
                >
                  <Icon size={24} className="min-w-[24px]" />
                  {isOpen && (
                    <span className="font-medium truncate whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
