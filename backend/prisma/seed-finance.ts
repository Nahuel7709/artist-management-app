import "dotenv/config";
import { prisma } from "../db/prisma.ts";
import argon2 from "argon2";
import { createUserSchema } from "../auth/authSchemas.ts";

async function createUser() {
  const userName = process.env.FINANCE_NAME;
  const userEmail = process.env.FINANCE_EMAIL;
  const userPassword = process.env.FINANCE_PASSWORD;

  const result = createUserSchema.safeParse({
    name: userName,
    email: userEmail,
    password: userPassword,
  });

  if (!userName || !userEmail || !userPassword) {
    throw new Error("Missing FINANCE_NAME, FINANCE_EMAIL or FINANCE_PASSWORD");
  }

  if (!result.success) {
    throw new Error(
      `Invalid FINANCE_* variables: ${result.error.issues[0].message}. Nothing was changed.`,
    );
  }

  const { name, email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });

  if (user && user.role !== "FINANCE") {
    throw new Error(
      "A non-FINANCE user with this email already exists. Nothing was changed.",
    );
  }

  const hashPassword = await argon2.hash(password);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash: hashPassword },
    create: {
      email,
      name,
      passwordHash: hashPassword,
      role: "FINANCE",
    },
  });

  if (user === null) {
    console.log("Finance user created");
  } else {
    console.log("Finance user updated");
  }
}

createUser()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
