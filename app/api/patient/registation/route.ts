import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try{
        const body = await req.json();
        console.log(body);

        if (!body.name || !body.age || !body.gender || !body.phone) {
            return Response.json(
                { success: false, message: "All required fields must be filled" },
                { status: 400 }
            );
        }

        const age = parseInt(body.age);
        if (isNaN(age) || age <= 0) {
            return Response.json(
                { success: false, message: "Invalid age value" },
                { status: 400 }
            );
        }
        const patient = await prisma.patient.create({
            data:{
                name: body.name,
                age: parseInt(body.age),
                gender: body.gender,
                phone: body.phone,
                address: body.address,
            }
        })
        return Response.json(
            { 
                success: true,
                message: "Patient registered successfully", 
                id: patient.id 
            },
            { status: 201 }
        );
    }
    catch (error: any) {
    console.error("API ERROR:", error);

    // ✅ Handle known DB errors (optional advanced)
    if (error.code === "P2002") {
      return Response.json(
        { success: false, message: "Phone number already exists" },
        { status: 409 }
      );
    }

    // ✅ Generic error
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}