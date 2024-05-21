import { ResourceContentType } from "@prisma/client";

interface IChapter {
  name: string;
  description: string;
  sequenceId: number;
  chapterId: number;
}

export interface ICourseDetial {
  edit: boolean | undefined;

  name: string;
  durationInMonths: number;
  onRefresh: () => void | undefined;

  onDeleteCourse: (courseId: number) => void | undefined;
  onUpdateCourse: (courseId: number) => void | undefined;
  courseId: number;
  description: string;
  state: string;
  sequenceId: number;
  skills: string[];
  chapter: IChapter[];
}

export interface ICourseProgressUpdateResponse {
  success: boolean;
  message: string;
  error: string;
  progress: {
    lessonsCompleted: number;
    totalLessons: number;
  };
}

export interface IAddResource {
  content: ResourceContentType;
  name: string;
  duration: number;
  assignmentFileName: string;
  chapterId: number;
}

export type LessonType = "Video" | "Assignment";

export interface ResourceDetails {
  name: string;
  resourceId: number | undefined;
  description: string;
  chapterId: number;
  contentType: LessonType;
  content: string;
  videoId: number;
  courseId?: number;
}
