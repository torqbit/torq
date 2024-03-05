import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    id: number;
    role: string;
    phone: string;
    isActive: boolean;
  }

  interface User {
    id: number;
    role: string;
    isActive: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    role: string;
    isActive: boolean;
  }
}
