import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { convertToDayMonthTime, getCookieName } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { eventId } = req.query;

    const registeredStudents = await prisma.eventRegistration.findMany({
      where: {
        eventId: Number(eventId),
      },
      select: {
        name: true,
        email: true,
        createdAt: true,
        attended: true,
        certificate: true,
        status: true,
        comment: true,
        id: true,
        event: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (registeredStudents.length > 0) {
      const registrationListInfo = registeredStudents.map((r) => {
        return {
          name: r.name,
          email: r.email,
          certificate: r.certificate ? "Yes" : "No",
          status: r.status,
          comment: r.comment,
          registrationDate: convertToDayMonthTime(r.createdAt),
          id: r.id,
          attended: r.attended,
        };
      });
      return res.status(200).json({ success: true, registrationListInfo });
    } else {
      return res.status(200).json({ success: true, registrationListInfo: [] });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(withUserAuthorized(handler)));
