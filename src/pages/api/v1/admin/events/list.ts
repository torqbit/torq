import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { convertToDayMonthTime, getCookieName } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { Role } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cookieName = getCookieName();
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    if (token?.role === Role.ADMIN) {
      const events = await prisma.events.findMany({
        select: {
          id: true,
          title: true,
          startTime: true,
          endTime: true,
          eventMode: true,
          eventType: true,
          state: true,
          slug: true,
          attendees: {
            select: {
              name: true,
              email: true,
              phone: true,
              createdAt: true,
              attended: true,
              certificate: true,
            },
          },
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      const tableData = events.map((detail) => {
        return {
          id: detail.id,
          title: detail.title,
          startTime: detail.startTime ? convertToDayMonthTime(detail.startTime) : "N/A",
          endTime: detail.endTime ? convertToDayMonthTime(detail.endTime) : "N/A",
          mode: detail.eventMode ? detail.eventMode : "N/A",
          eventType: detail.eventType ? detail.eventType : "N/A",
          state: detail.state,
          author: detail.user.name,
          slug: detail.slug,
          attendees: detail.attendees,
        };
      });

      return res.status(200).json({ success: true, message: "All Events has been fetched", totalEvents: tableData });
    } else if (token?.role === Role.AUTHOR) {
      const events = await prisma.events.findMany({
        where: {
          authorId: String(token?.id),
        },
        select: {
          id: true,
          title: true,
          startTime: true,
          endTime: true,
          eventMode: true,
          eventType: true,
          state: true,
          slug: true,
          attendees: {
            select: {
              name: true,
              email: true,
              phone: true,
              createdAt: true,
              attended: true,
              certificate: true,
            },
          },
          user: {
            select: {
              name: true,
            },
          },
        },
      });
      const tableData = events.map((detail) => {
        return {
          id: detail.id,
          title: detail.title,
          startTime: detail.startTime ? convertToDayMonthTime(detail.startTime) : "N/A",
          endTime: detail.endTime ? convertToDayMonthTime(detail.endTime) : "N/A",
          mode: detail.eventMode ? detail.eventMode : "N/A",
          eventType: detail.eventType ? detail.eventType : "N/A",
          state: detail.state,
          author: detail.user.name,
          slug: detail.slug,
          attendees: detail.attendees,
        };
      });

      return res.status(200).json({ success: true, message: "All Events has been fetched", totalEvents: tableData });
    } else {
      return res.status(403).json({ success: false, message: "You are not authorized" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(withUserAuthorized(handler)));
