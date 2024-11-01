import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";
import { EventAccess, EventMode } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { eventId, email, name, phone } = req.body;
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const isAlreadyExist = await prisma.eventRegistration.findUnique({
      where: {
        eventId_email: {
          eventId: eventId,
          email: token?.email ? String(token?.email) : email,
        },
      },
      select: {
        id: true,
      },
    });
    if (isAlreadyExist) {
      return res.status(200).json({
        success: true,
        message: "You have already registered with this email",
        isRegistered: true,
        registrationId: isAlreadyExist.id,
      });
    }
    const findEvent = await prisma.events.findUnique({
      where: {
        id: eventId,
      },
      select: { eventMode: true },
    });

    if (token) {
      const registerEvent = await prisma.eventRegistration.create({
        data: {
          eventId: eventId,
          phone: String(token.phone),
          email: String(token.email),
          name: String(token.name),
          studentId: String(token.id),
          status: findEvent?.eventMode === EventMode.OFFLINE ? EventAccess.PENDING : EventAccess.ACCEPTED,
        },
        select: {
          id: true,
          status: true,
          event: {
            select: {
              eventMode: true,
            },
          },
        },
      });
      return res.status(200).json({
        success: true,
        status: registerEvent.status,
        message:
          registerEvent.event.eventMode === EventMode.OFFLINE
            ? "Your booking request has been sent"
            : "You have successfully registered for the workshop",
        registrationId: registerEvent.id,
      });
    } else {
      const findUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
        },
      });

      const registerEvent = await prisma.eventRegistration.create({
        data: {
          eventId: eventId,
          phone: String(phone),
          email: email,
          name: name,
          studentId: findUser?.id,
          status: findEvent?.eventMode === EventMode.OFFLINE ? EventAccess.PENDING : EventAccess.ACCEPTED,
        },
        select: {
          id: true,
          status: true,
          event: {
            select: { eventMode: true },
          },
        },
      });
      return res.status(200).json({
        success: true,
        status: registerEvent.status,

        message:
          registerEvent.event.eventMode === EventMode.OFFLINE
            ? "Your booking request has been sent"
            : "You have successfully registered for the workshop",
        registrationId: registerEvent.id,
      });
    }
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["POST"], handler);
