import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const test = await prisma.testType.create({
    data: {
      name: body.name,
      fields: {
        create: body.fields,
      },
    },
  });

  return Response.json(test);
}

export async function GET() {
  const tests = await prisma.testType.findMany({
    include: {
      fields: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  return Response.json(tests);
}