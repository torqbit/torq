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
              video: true,
            },
          },
        },
      },
    },
  });

  let totalMin: number[] = [];

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
      const isEnrolled = await prisma.courseRegistration.findFirst({
        where: {
          courseId: programId,
          studentId: currentUser?.id,
        },
      });

      if (!isEnrolled?.courseId) {
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
      const isEnrolled = await prisma.courseRegistration.findFirst({
        where: {
          courseId: programId,
          studentId: currentUser?.id,
        },
      });

      if (!isEnrolled?.courseId) {
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

export const getAllCourses = async (id: string) => {
  const res = await prisma.course.findMany({
    select: {
      courseId: true,
      name: true,
      difficultyLevel: true,
      state: true,
      thumbnail: true,
      description: true,
      totalResources: true,
      user: {
        select: {
          name: true,
        },
      },
      chapters: {
        select: {
          resource: {
            select: {
              video: {
                select: {
                  videoDuration: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return JSON.stringify(res);
};
