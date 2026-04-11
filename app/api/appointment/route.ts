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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");
    const appointments = await prisma.appointment.findMany({
      where: doctorId ? {
        doctorId: Number(doctorId),
      } : {},
      include: {
        patient: true,
        doctor: true,
      },
      orderBy: {
        scheduledAt: "desc",
      },
    });

    return Response.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return Response.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}