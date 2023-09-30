import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import bcrypt from "bcrypt"
import { sign } from "jsonwebtoken";

export async function POST(req){
    const {email,password} = await req.json()
    try {
        const findUser = await prisma.user.findUnique({
            where:{
                email,
            }           
        })

        if (findUser === false){
            return NextResponse.json({message:"User not found"})
        }

        const hashedPassword = findUser.password
        const isPasswordValid = await bcrypt.compare(password,hashedPassword)

        if(isPasswordValid === false){
            return NextResponse.json({message:"Password is wrong"})
        }

        const payLoad = {
            id: findUser.id,
            userName: findUser.userName,
            email: findUser.email
        }

        const accessToken = sign(payLoad, process.env.JWT_SECRET_KEY,{expiresIn: "1d"})
        return NextResponse.json({accessToken, data:payLoad, message:"Login Successfull!"})        
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"Error happened"})
    }
    return NextResponse.json("Failed")
}