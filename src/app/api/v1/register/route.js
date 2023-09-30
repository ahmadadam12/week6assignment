import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import bcrypt from "bcrypt"

export async function POST(req){
    const {userName,email, password} = await req.json()
    try {
        const hashedPassword = await bcrypt.hash(password, 13)
        const createUser = await prisma.user.create({
            data:{
                userName,
                email,
                password: hashedPassword
            }
        })
        return NextResponse.json({message:"New user has been added"})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"Error happened"})
        
    }
    return NextResponse.json({data:"Failed to register"})
}