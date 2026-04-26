import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const patients = await prisma.patient.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { phone: { contains: search } },
            ],
          }
        : {},
      take: 8,
    });

    return Response.json({ patient: patients });
  } catch (err) {
    console.error(err);
    return Response.json({ patient: [] });
  }
}