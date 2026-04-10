import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const body = await req.json();
    console.log(body);

    const patient = await prisma.doctor.create({
        data:{
            name:           body.name,
            phone:          body.phone,
            specialization: body.specialization,
            experience:     parseInt(body.experience),
            email:          body.email,
            availability:   body.availability,
            isActive:       body.isActive,
            consultationFee:parseInt(body.consultationFee),
            createdAt:      body.createdAt,
        }
    })
    return Response.json({ message: "Patient registered successfully", id: patient.id });
}