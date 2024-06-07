import { Theme } from "@prisma/client";

export interface UserSession {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  theme?: Theme;
  phone?: string;
}
