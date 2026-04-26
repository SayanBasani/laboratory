import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const report = await prisma.report.findUnique({
    where: { id: Number(id) },
  });

  return Response.json(report);
}
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
  await prisma.report.delete({
    where: { id: Number(id) },
  });

  return Response.json({ success: true });
}