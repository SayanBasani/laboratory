"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

type Appointment = {
    id: number;
    reason: string;
    scheduledAt: string;
    status: string;
    fee?: number;
    paid: boolean;

    patient: {
        name: string;
    };

    doctor: {
        name: string;
        specialization: string;
    };
};

export default function AppointmentPage() {
    
    return (
        "Hello"
    );
}