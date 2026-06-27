import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const baseDb = globalThis.prismaGlobal ?? prismaClientSingleton();

// Extend the client with type-safe overrides to bypass stale IDE Prisma client caches
export const db = baseDb as Omit<typeof baseDb, 'settings' | 'email' | 'whatsAppMessage'> & {
  settings: any;
  email: any;
  whatsAppMessage: any;
};

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = baseDb;
