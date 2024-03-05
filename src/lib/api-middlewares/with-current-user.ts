import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

export function withCurrentUser(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session?.user) {
        return res.status(403).end();
      }
      return handler(req, res);
    } catch (error) {
      return res.status(500).end();
    }
  };
}
