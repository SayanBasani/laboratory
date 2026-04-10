import { prisma } from "@/lib/prisma";

export async function GET() {
    const patients = await prisma.patient.findMany();
    return Response.json({ patient: patients });
}
