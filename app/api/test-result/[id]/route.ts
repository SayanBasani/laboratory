import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const data = await prisma.testResult.findUnique({
    where: { id: Number((await params).id) },
    include: {
      appointment: {  
        include: {
          patient: true,
          doctor: true,
        },
      },
      testType: {
        include: {
          fields: true,
        },
      },
    },
  });

  console.log(data);
  return Response.json(data);
}