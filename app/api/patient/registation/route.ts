import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const body = await req.json();
    console.log(body);

    const patient = await prisma.patient.create({
        data:{
            name: body.name,
            age: parseInt(body.age),
            gender: body.gender,
            phone: body.phone,
            address: body.address,
        }
    })
    return Response.json({ message: "Patient registered successfully", id: patient.id });
}