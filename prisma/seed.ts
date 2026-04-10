import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import "dotenv/config";

function createClient() {
  if (process.env.TURSO_DATABASE_URL) {
    const adapter = new PrismaLibSql({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter });
  }
  return new PrismaClient();
}

const prisma = createClient();

async function main() {
  // Create default agent
  await prisma.agent.upsert({
    where: { name: "Sarah Johnson" },
    update: {},
    create: {
      name: "Sarah Johnson",
      tokens: 100,
    },
  });

  // Create leads (upsert by phone to be safe on re-runs)
  const leads = [
    {
      name: "Michael Chen",
      phone: "(555) 234-5678",
      status: "hot",
      lastContacted: new Date("2026-04-08"),
    },
    {
      name: "Emily Rodriguez",
      phone: "(555) 345-6789",
      status: "hot",
      lastContacted: new Date("2026-04-07"),
    },
    {
      name: "James Wilson",
      phone: "(555) 456-7890",
      status: "new",
      lastContacted: new Date("2026-04-09"),
    },
    {
      name: "Olivia Martinez",
      phone: "(555) 567-8901",
      status: "cold",
      lastContacted: new Date("2026-03-25"),
    },
    {
      name: "Daniel Thompson",
      phone: "(555) 678-9012",
      status: "hot",
      lastContacted: new Date("2026-04-06"),
    },
    {
      name: "Sophia Lee",
      phone: "(555) 789-0123",
      status: "new",
      lastContacted: new Date("2026-04-10"),
    },
    {
      name: "William Brown",
      phone: "(555) 890-1234",
      status: "cold",
      lastContacted: new Date("2026-03-15"),
    },
    {
      name: "Isabella Garcia",
      phone: "(555) 901-2345",
      status: "new",
      lastContacted: new Date("2026-04-05"),
    },
    {
      name: "Alexander Kim",
      phone: "(555) 012-3456",
      status: "hot",
      lastContacted: new Date("2026-04-09"),
    },
    {
      name: "Ava Patel",
      phone: "(555) 123-4567",
      status: "cold",
      lastContacted: new Date("2026-02-28"),
    },
  ];

  for (const lead of leads) {
    await prisma.lead.create({ data: lead });
  }

  console.log("Seeded: 1 agent + 10 leads");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
