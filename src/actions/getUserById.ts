import prisma from "@/lib/prisma";

export default async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  return user;
}
