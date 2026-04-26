import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const test = await prisma.testType.findUnique({
      where: { id: Number(id) },
      include: { fields: true },
    });

    if (!test) {
      return Response.json({ error: "Test not found" }, { status: 404 });
    }

    return Response.json(test);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch test" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.testType.update({
      where: { id: Number(id) },
      data: {
        name: body.name,

        fields: {
          deleteMany: {}, // 🔥 deletes all existing fields
          create: body.fields.map((f: any) => ({
            name: f.name,
            unit: f.unit,
            normalRange: f.normalRange,
          })),
        },
      },
    });

    return Response.json(updated);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to update test" }, { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try{
    const { id } = await params;
    // console.log("params.id")
    // console.log(id)
    await prisma.testResult.deleteMany({
      where: { testTypeId: Number(id) },
    });

    await prisma.testField.deleteMany({
      where: { testTypeId: Number(id) },
    });

    await prisma.testType.delete({
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

