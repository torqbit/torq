import { Role } from "@prisma/client";
import prisma from "@/lib/prisma";

const checkAuthorization = async (assignmentId: number, userId: string): Promise<Role> => {
  return new Promise(async (resolve, reject) => {
    const assignmentDetail = await prisma.assignment.findUnique({
      where: {
        id: assignmentId,
      },
      select: {
        lesson: {
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
        },
      },
    });

    let authorId = String(assignmentDetail?.lesson.chapter.course.authorId);
    if (userId === authorId) {
      resolve(Role.AUTHOR);
    } else {
      resolve(Role.STUDENT);
    }
  });
};

const getUserRole = async (assignmentId: number, userRole?: Role, userId?: string): Promise<Role> => {
  switch (userRole) {
    case Role.AUTHOR:
      return checkAuthorization(assignmentId, String(userId));
    case Role.ADMIN:
      return Role.AUTHOR;
    default:
      return Role.STUDENT;
  }
};

export default getUserRole;
