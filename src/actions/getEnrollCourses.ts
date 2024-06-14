import prisma from "@/lib/prisma";

export interface IListingsCourses {
  userId?: string;
  pageNo?: number;
  pageSize?: number;
}

export const getUserEnrolledUserId = async (userId: string) => {
  try {
    const coursesId = await prisma.courseRegistration.findMany({
      where: {
        studentId: userId,
      },
      select: {
        courseId: true,
      },
    });

    return coursesId.map((c, i) => c.courseId.toString());
  } catch (error: any) {
    throw new Error(error);
  }
};
export const getUserEnrolledCoursesId = async (courseId: number, userId: string) => {
  try {
    const course = await prisma.courseRegistration.findUnique({
      where: {
        studentId_courseId: {
          studentId: userId,
          courseId: courseId,
        },
      },
      select: {
        courseId: true,
      },
    });

    if (course?.courseId) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

export default async function getEnrollCourses(params: IListingsCourses) {
  try {
    const { userId, pageNo, pageSize } = params;

    let pagination: any = {};

    let query: any = {
      isActive: true,
    };

    if (userId) {
      query.studentId = userId;
    }

    if (pageNo && pageSize) {
      pagination.skip = pageNo * pageSize;
      pagination.take = pageSize;
    }

    const enrollCourses = await prisma.courseRegistration.findMany({
      where: query,
      include: {
        course: {
          include: {
            chapter: {
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
      orderBy: {
        createdAt: "desc",
      },
      ...pagination,
    });

    return enrollCourses;
  } catch (error: any) {
    throw new Error(error);
  }
}
