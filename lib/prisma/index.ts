// lib/db.ts owns the one Prisma client; this module re-exports it for the
// files that import "@/lib/prisma".
import { prisma } from "@/lib/db"

export { prisma }
export default prisma
