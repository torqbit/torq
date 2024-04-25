import { Discussion, User } from "@prisma/client";

export interface ICommentInfo extends Discussion {
  user: User;
}
