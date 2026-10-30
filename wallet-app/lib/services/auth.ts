import "server-only";
import { db } from "../db";
import bcrypt from "bcrypt";
import { Prisma } from "@/app/generated/prisma/client";

export async function registerUser(
  name: string,
  email: string,
  password: string,
) {
  const existingUser = await db.user.findUnique({
    where: { email: email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const user = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { name, email, passwordHash },
      });

      await tx.wallet.create({
        data: { userId: newUser.id },
      });
      return newUser;
    });
    return user.id;

  } catch (error) {

    if (error instanceof Prisma.PrismaClientKnownRequestError &&error.code === "P2002") { 
      throw new Error("Email already registered");
    }
    
    throw error;
  }
}
