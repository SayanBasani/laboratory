import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const appointment = await prisma.appointment.create({
    data: {
      patientId: body.patientId,
      doctorId: body.doctorId,
      problem: body.problem,
    },
  });

  return Response.json(appointment);
}