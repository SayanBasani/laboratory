import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const result = await prisma.testResult.create({
    data: {
      appointmentId: body.appointmentId,
      testTypeId: body.testTypeId,
      values: body.values,
    },
  });

  return Response.json(result);
}