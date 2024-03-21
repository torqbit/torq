import { ResourceContentType } from "@prisma/client";

interface IChapter {
  name: string;
  description: string;
  sequenceId: number;
  chapterId: number;
}

export interface IProgramDetail {
  id: number;
  thumbnail: string;
  durationInMonths: number;
  aboutProgram: string;
  description: string;
  title: string;
  authorId: number;
  banner: string;
  programType: string;
  state: string;
  course: ICourseDetial[];
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

export interface IAddResource {
  content: ResourceContentType;
  name: string;
  duration: number;
  assignmentFileName: string;
  chapterId: number;
}

export interface resData {
  name: string;
  resourceId: number | undefined;
  description: string;
  chapterId: number;
  sequenceId: number;
  assignmentLang: string[];
  videoDuration: number;
  daysToSubmit: number;
  thumbnail: string;
  contentType: string;
  content: string;
  videoId: string;
}

export interface allProgram {
  aboutProgram: string;
  banner: string;
  description: string;
  durationInMonths: number;
  id: number;
  skills: string[];
  state: string;
  authorId: number;
  programType: string;
  course: [
    {
      description: string;
      durationInMonths: number;
      authorId: number;
      id: number;
      programId: number;
      skills: string[];
      title: string;
      videoDuration: number;
    }
  ];
  thumbnail: string;
  title: string;
}
