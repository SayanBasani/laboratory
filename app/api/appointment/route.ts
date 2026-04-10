import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const appointment = await prisma.appointment.create({
    data: {
      patientId: body.patientId,
      doctorId: body.doctorId,
      reason: body.reason,
      notes: body.notes,
      scheduledAt: body.scheduledAt,
      duration: body.duration,
      status: body.status,
      mode: body.mode,
      fee: body.fee,
      paid: body.paid,
    },
  });

  return Response.json(appointment);
}
