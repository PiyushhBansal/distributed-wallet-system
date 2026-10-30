import * as z from "zod";
import { RegisterSchema } from "@/lib/validation";
import { registerUser } from "@/lib/services/auth";

export async function POST(request: Request){
    let body : unknown;
    try{
        body = await request.json();
    }catch{
        return Response.json({error:"Request body must be valid JSON"},{status:400});
    }

    const result = RegisterSchema.safeParse(body);
    if(!result.success){
        return Response.json(
            {error:"Invalid input", fields: z.flattenError(result.error).fieldErrors},
            {status: 400},
        )
    }

    const { name, email, password } = result.data;

    try{
        const userId = await registerUser(name, email, password);
        return Response.json({id: userId, name , email}, {status:201});
    }catch(error){
        if(error instanceof Error && error.message === "Email already registered"){
            return Response.json({error: "An account with this email already exists"}, {status:409});
        }
        console.error(error);
        return Response.json({error: "Something went wrong"}, {status:500});
    }
}