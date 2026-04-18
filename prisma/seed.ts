import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { menuSeed } from "../src/lib/menu-seed";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@tandoorflame.test").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin1234";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: "admin", name: "Admin" },
    create: {
      email: adminEmail,
      name: "Admin",
      passwordHash,
      role: "admin",
    },
  });
  console.log(`Seeded admin user: ${adminEmail}`);

  const existingCount = await prisma.menuItem.count();
  if (existingCount === 0) {
    for (const item of menuSeed) {
      await prisma.menuItem.create({ data: item });
    }
    console.log(`Seeded ${menuSeed.length} menu items`);
  } else {
    console.log(`Skipped menu seed (found ${existingCount} existing items)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
