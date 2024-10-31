import { Role } from "@prisma/client";
import prisma from "@/lib/prisma";

const checkAuthorization = async (lessonId: number, userId: string): Promise<Role> => {
  return new Promise(async (resolve, reject) => {
    const lessonDetail = await prisma.resource.findUnique({
      where: {
        resourceId: lessonId,
      },

      select: {
        chapter: {
          select: {
            course: {
              select: {
                authorId: true,
              },
            },
          },
        },
      },
    });

    let authorId = String(lessonDetail?.chapter.course.authorId);
    if (userId === authorId) {
      resolve(Role.AUTHOR);
    } else {
      resolve(Role.STUDENT);
    }
  });
};

const getUserRole = async (lessonId: number, userRole?: Role, userId?: string): Promise<Role> => {
  switch (userRole) {
    case Role.AUTHOR:
      return checkAuthorization(lessonId, String(userId));
    case Role.ADMIN:
      return Role.AUTHOR;
    default:
      return Role.STUDENT;
  }
};

export default getUserRole;
