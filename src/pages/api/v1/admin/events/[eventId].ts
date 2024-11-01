import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getCookieName } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cookieName = getCookieName();
    const query = req.query;
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const eventDetails = await prisma.events.findUnique({
      where: {
        id: Number(query?.eventId),
      },
      select: {
        id: true,
        title: true,
        banner: true,
        slug: true,
        description: true,
        startTime: true,
        endTime: true,
        eventType: true,
        location: true,
        registrationEndDate: true,
        price: true,
        eventInstructions: true,
        eventLink: true,
        eventMode: true,
        state: true,
        certificate: true,
        certificateTemplate: true,
      },
    });

    if (eventDetails) {
      return res.status(200).json({
        success: true,
        eventDetails: {
          ...eventDetails,
          startTime: String(eventDetails.startTime),
          endTime: String(eventDetails.endTime),
        },
      });
    } else {
      return res.status(200).json({ success: true, eventDetails: [] });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(withUserAuthorized(handler)));
