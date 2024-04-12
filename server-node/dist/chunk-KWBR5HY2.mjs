// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient({
  log: ["query", "error", "info", "warn"]
});

export {
  prisma
};
