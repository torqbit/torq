import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { convertToDayMonthTime, getCookieName } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { Role, StateType } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { pageSize, skip } = req.body;

    const eventList = await prisma.events.findMany({
      where: {
        state: StateType.ACTIVE,
      },
      select: {
        id: true,
        title: true,
        startTime: true,
        banner: true,
        eventMode: true,
        eventType: true,
        location: true,
        slug: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      take: pageSize,
      skip,
    });

    const totalEventsLength = await prisma.events.count({ where: { state: StateType.ACTIVE } });

    return res
      .status(200)
      .json({ success: true, message: "All Events has been fetched", eventList, totalEventsLength });
  } catch (error) {
    errorHandler(error, res);
  }
};

export default withMethods(["POST"], handler);
