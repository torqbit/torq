import { NextApiResponse, NextApiRequest } from "next";
import prisma from "@/lib/prisma";

export default async function createQuiz(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const body = await req.body;
      const { email } = body;

      const UserExist = await prisma.userJoinWaiting.findFirst({
        where: {
          email: email,
        },
      });
      if (UserExist) {
        return res.status(208).json({ success: false, message: "The User is Already Exist" });
      }
      let sequenceId = (await prisma.userJoinWaiting.count()) + 1 || 1;

      if (body && !UserExist) {
        const User = await prisma.userJoinWaiting.create({
          data: {
            email: email,
            ip: "",
            sequenceId: sequenceId,
          },
        });
        return res.status(200).json({
          success: true,
          message: "Succesfully added the User Details",
        });
      } else {
        return res.status(400).json({ success: false, error: "something wrong" });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        body: "empty",
        error: "Something went wrong! please try again later",
      });
    }
  }
}
