import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log("id");
    console.log(id);
    await prisma.appointment.deleteMany({
      where: { doctorId: Number(id) },
    });
    await prisma.doctor.delete({
      where: { id: Number(id) },
    });

    return Response.json({ success: true });
  }
  catch (error) {
    console.error(error);
    return Response.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const doctor = await prisma.doctor.findUnique({
      where: { id: Number(id) },
    });
    return Response.json({ doctor });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch doctor" },
      { status: 500 }
    );
  }
}