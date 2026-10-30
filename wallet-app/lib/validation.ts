import * as z from "zod";

export const RegisterSchema = z.object({
    name: z.string().trim().min(2,{error:"Name must be atleast of 2 character"}),
    email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: "Please enter a valid email" })),
    password: z.string().min(8, { error: "Password must be at least 8 characters" })
    .max(72, { error: "Password must be at most 72 characters" })
    .regex(/[a-zA-Z]/, { error: "Password must contain a letter" })
    .regex(/[0-9]/, { error: "Password must contain a number" }),
})