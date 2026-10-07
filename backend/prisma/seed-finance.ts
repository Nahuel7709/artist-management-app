import "dotenv/config";
import { prisma } from "../db/prisma.ts";
import argon2 from "argon2";

async function createUser() {
  const userName = process.env.FINANCE_NAME;
  const userEmail = process.env.FINANCE_EMAIL;
  const userPassword = process.env.FINANCE_PASSWORD;

  if (!userName || !userEmail || !userPassword) {
    throw new Error("User seed is missing name, email or password variable");
  }

  if (userPassword.length < 8 || userPassword.length > 64) {
    throw new Error("FINANCE_PASSWORD must be between 8 and 64 characters");
  }

  const normalizedEmail = userEmail.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { role: true },
  });

  if (user && user.role !== "FINANCE") {
    throw new Error(
      "A non-FINANCE user with this email already exists. Nothing was changed.",
    );
  }

  const hashPassword = await argon2.hash(userPassword);

  await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: { passwordHash: hashPassword },
    create: {
      email: normalizedEmail,
      name: userName,
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
