import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const doctors = await prisma.doctor.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { specialization: { contains: search } },
            ],
          }
        : {},
      take: 8,
    });

    return Response.json(doctors);
  } catch (err) {
    console.error(err);
    return Response.json([]);
  }
}