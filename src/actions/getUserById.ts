import prisma from "@/lib/prisma";

export default async function getUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  return user;
}
