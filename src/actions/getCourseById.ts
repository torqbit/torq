import prisma from "@/lib/prisma";
import getCurrentUser from "./getCurrentUser";

export const getTotalAssignment = async (courseId: number) => {
  const res = await prisma.course.findUnique({
    where: {
      courseId: courseId,
    },
    select: {
      chapters: {
        where: {
          isActive: true,
        },
        select: {
          resource: {
            where: {
              isActive: true,
              contentType: "Assignment",
            },
            select: {
              contentType: true,
            },
          },
        },
      },
    },
  });

  let totalAssig: any[] = [];
  res?.chapters.map((c, i) =>
    c.resource.map((r, i) => {
      totalAssig.push(r.contentType);
    })
  );

  return totalAssig;
};

export const getTotalVideoLength = async (courseId: number) => {
  const res = await prisma.course.findUnique({
    where: {
      courseId: courseId,
    },
    select: {
      chapters: {
        where: {
          isActive: true,
        },
        select: {
          resource: {
            where: {
              isActive: true,
            },
            select: {
              videos: true,
            },
          },
        },
      },
    },
  });

  let totalMin: number[] = [];
  res?.chapters.map((c, i) =>
    c.resource.map((r, i) => {
      totalMin.push(r.videos[0].videoDuration);
    })
  );

  return totalMin.reduce((total, item) => item + total, 0);
};

export const getProgramById = async (programId: number) => {
  const res = await prisma.program.findUnique({
    where: {
      id: programId,
    },
  });

  let authorId = res?.authorId;
  return authorId;
};

export const getCourseDetailById = async (courseId: number, programId: number) => {
  const res = await prisma.course.findFirst({
    where: {
      programId: programId,
      courseId: courseId,
    },
    include: {
      chapters: {
        include: {
          resource: {},
        },
      },
    },
  });

  return res;
};

export default async function getCoursById(programId: number, checkIsEnrolled = false) {
  try {
    if (checkIsEnrolled) {
      const currentUser = await getCurrentUser();
      const isEnrolled = await prisma.programRegistration.findFirst({
        where: {
          programId: programId,
          studentId: currentUser?.id,
        },
      });

      if (!isEnrolled?.programId) {
        throw new Error("Sorry, you are not enrolled in this course");
      }
    }

    let course = await prisma.program.findUnique({
      where: {
        id: programId,
      },
      include: {
        course: {
          include: {
            chapters: {
              where: {
                isActive: true,
              },
              include: {
                resource: {
                  where: {
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return course;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getProgramDetailById(programId: number, checkIsEnrolled = false) {
  try {
    if (checkIsEnrolled) {
      const currentUser = await getCurrentUser();
      const isEnrolled = await prisma.programRegistration.findFirst({
        where: {
          programId: programId,
          studentId: currentUser?.id,
        },
      });

      if (!isEnrolled?.programId) {
        throw new Error("Sorry, you are not enrolled in this course");
      }
    }
    let program = await prisma.program.findUnique({
      where: {
        id: programId,
      },
      include: {
        course: {
          where: {
            isActive: true,
            state: "ACTIVE",
          },
          include: {
            chapters: {
              where: {
                isActive: true,
              },
              include: {
                resource: {
                  where: {
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return program;
  } catch (error: any) {
    throw new Error(error);
  }
}

export const getAllCoursesById = async (id: number) => {
  const res = await prisma.course.findMany({
    where: {
      authorId: id,
    },
  });

  return JSON.stringify(res);
};
