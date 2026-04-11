import { prisma } from "@/lib/prisma";

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

