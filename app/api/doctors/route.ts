import { prisma } from "@/lib/prisma";

export async function GET() {
  const doctors = await prisma.doctor.findMany();
  return Response.json(doctors);
}