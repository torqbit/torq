import { IResourceDetail } from "@/lib/types/learn";
import { Course, Resource, ResourceContentType, Video, VideoState, courseDifficultyType } from "@prisma/client";

export interface ChapterDetail {
  sequenceId: number;
  chapterId: number;
  courseId: number;
  createdAt: string;
  state: string;
  description: string;
  isActive: boolean;
  name: string;
  resource: IResourceDetail[];
}

export interface CourseAPIResponse {
  success: boolean;
  statusCode: number;
  message: string;
  courseDetails: CourseInfo;
}
export interface CourseData {
  name: string;
  description: string;
  expiryInDays: number;
  chapters: ChapterDetail[];
  difficultyLevel?: courseDifficultyType;
}
export interface CourseInfo {
  about: string;
  authorId: number;
  sequenceId: number;
  skills: string[];
  tvThumbnail: string;
  tvProviderId: string;
  tvState: VideoState;
  tvUrl: string;
  thumbnail: string;
  videoUrl: string;
  chapters: ChapterDetail[];
  courseId: number;
  coursePrice: number;
  courseType: string;
  createdAt: string;
  description: string;
  expiryInDays: number;
  durationInMonths: number;
  difficultyLevel: courseDifficultyType;
  name: string;
  programId: number;
  state: string;
  tags: string[];
}

export interface IVideoLesson {
  title: string;
  description: string;
  chapterId?: number;
  video?: Video;
}

export interface BasicAPIResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface VideoInfo {
  videoId: string;
  thumbnail: string;
  previewUrl: string;
  mediaProviderName: string;
  videoDuration: number;
  state: VideoState;
  videoUrl: string;
}

export interface VideoAPIResponse {
  success: boolean;
  statusCode: number;
  message: string;
  video: VideoInfo;
}

export interface FileUploadResponse {
  success: boolean;
  statusCode: number;
  message: string;
  fileCDNPath: string;
}

export type UploadVideoObjectType = "lesson" | "course";

export interface UploadedResourceDetail {
  fileName?: string;
  videoUrl?: string;
  videoId?: string;
  thumbnail?: string;
  state?: string;
  mediaProvider?: string;
  videoDuration?: number;
}
