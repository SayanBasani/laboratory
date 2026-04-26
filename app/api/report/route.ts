import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const report = await prisma.report.create({
    data: body,
  });
  return Response.json(report);
}

export async function GET() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json(reports);
}