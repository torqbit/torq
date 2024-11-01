import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { getCookieName } from "@/lib/utils";
import { submissionStatus } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { assignmentId, lessonId } = req.query;
  try {
    const cookieName = getCookieName();

    const token = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

    const submissionHistory = await prisma.assignmentSubmission.findMany({
      where: {
        lessonId: Number(lessonId),
        assignmentId: Number(assignmentId),
        studentId: String(token?.id),
        NOT: {
          status: submissionStatus.NOT_SUBMITTED,
        },
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
        content: true,
        evaluation: {
          select: {
            comment: true,

            score: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (submissionHistory.length > 0) {
      const allSubmmissionsDetail = submissionHistory
        .filter((f) => f.status !== submissionStatus.NOT_SUBMITTED)
        .map((sub) => {
          const mapData = new Map<string, string>(Object.entries(JSON.parse(String(sub.content))));
          return {
            submissionId: sub.id,
            content: Array.from(mapData.entries()),
            comment: sub.evaluation?.comment,
            submittedDate: sub.createdAt,
            evaluated: sub.evaluation ? true : false,
            score: sub.evaluation?.score,
          };
        });
      const latestSubmissionStatus = submissionHistory[0].status;
      return res.status(200).json({ success: true, allSubmmissions: allSubmmissionsDetail, latestSubmissionStatus });
    } else {
      return res.status(200).json({ success: true, allSubmmissions: [] });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
