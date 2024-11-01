import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";
import { submissionStatus } from "@prisma/client";
import appConstant from "@/services/appConstant";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cookieName = getCookieName();
    const query = req.query;
    const { assignmentId, lessonId } = query;
    const token = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

    const allSubmmissions = await prisma.assignmentSubmission.findMany({
      where: {
        studentId: String(token?.id),
        assignmentId: Number(assignmentId),
        lessonId: Number(lessonId),
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        status: true,
        evaluation: {
          select: {
            score: true,
            comment: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (allSubmmissions.length > 0) {
      const allSubmmissionsDetail = allSubmmissions
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

      const mapData =
        allSubmmissions.filter((f) => f.status !== submissionStatus.NOT_SUBMITTED).length > 0 &&
        new Map<string, string>(
          Object.entries(
            JSON.parse(
              String(
                allSubmmissions
                  .filter((f) => f.status !== submissionStatus.NOT_SUBMITTED)
                  .sort((a, b) => a.id - b.id)
                  .pop()?.content
              )
            )
          )
        );

      const savedCodeDetail = allSubmmissions.find((f) => f.status === submissionStatus.NOT_SUBMITTED);
      const savedMapData =
        savedCodeDetail && new Map<string, string>(Object.entries(JSON.parse(String(savedCodeDetail?.content))));

      const bestAttempt = allSubmmissions
        .filter((f) => f.status !== submissionStatus.NOT_SUBMITTED)
        .sort((a, b) => Number(b.evaluation?.score) - Number(a.evaluation?.score))
        .shift();

      const failedAttempts = allSubmmissions.filter((f) => f.status === submissionStatus.FAILED).length;

      return res.status(200).json({
        success: true,
        latestSubmissionDetail: {
          submitLimit: allSubmmissions.filter((f) => f.status !== submissionStatus.NOT_SUBMITTED).length,

          savedContent: savedMapData && Array.from(savedMapData.entries()),
          previousContent: mapData && Array.from(mapData.entries()),
          score: bestAttempt?.evaluation?.score,
          isEvaluated: allSubmmissions[0].evaluation,
          status:
            failedAttempts === appConstant.assignmentSubmissionLimit ? submissionStatus.COMPLETED : bestAttempt?.status,
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        latestSubmissionDetail: {
          allSubmmissions: [],
          previousContent: "",
          score: 0,
          isEvaluated: false,
        },
      });
    }
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
