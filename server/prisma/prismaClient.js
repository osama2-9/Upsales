import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log("Successfully connected to the database");
  } catch (error) {
    console.log(error);
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

export { prisma, testConnection };
