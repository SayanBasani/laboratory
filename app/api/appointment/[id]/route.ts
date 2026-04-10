import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const patient = await prisma.appointment.findMany({
      where: { patientId: Number(id) },
      include : {
        doctor: true,
        patient: true,
      }
    });
    return Response.json({appointments: patient});
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch patient" },
      { status: 500 }
    );
  }
}