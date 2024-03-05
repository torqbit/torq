import prisma from "@/lib/prisma";

export interface IListingsCourses {
  pageNo?: number;
  pageSize?: number;
}

export default async function getCourses(params: IListingsCourses) {
  try {
    const { pageNo, pageSize } = params;

    let pagination: any = {};

    let query: any = {
      isActive: true,
    };

    if (pageNo && pageSize) {
      pagination.skip = (pageNo - 1) * pageSize;
      pagination.take = pageSize;
    }

    const listings = await prisma.course.findMany({
      where: query,
      orderBy: {
        createdAt: "asc",
      },
      ...pagination,
    });

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;
  } catch (error: any) {
    throw new Error(error);
  }
}
