import { IRegisteredCourses, IResourceDetail, VideoDetails } from "@/lib/types/learn";
import { ICourseDetial, IProgramDetail, ResourceDetails } from "@/lib/types/program";
import ChapterId from "@/pages/api/chapter/delete/[chapterId]";

import { ChapterDetail, CourseAPIResponse, CourseInfo } from "@/types/courses/Course";
import { AssignmentAndTask, Chapter, Course, CourseProgress, Discussion, Resource } from "@prisma/client";
import { UploadFile } from "antd";
import { number } from "zod";
import { getFetch, postFetch } from "./request";
import { ICommentInfo } from "@/lib/types/discussions";
export interface ICourseList extends Course {
  courseId: number;
  tags: string[];
  enrollCourses: string[];
}

export type ApiResponse = {
  success: boolean;
  error: string;
  newComment: Discussion;
  comment: ICommentInfo;
  allComments: ICommentInfo[];
  allReplyComments: ICommentInfo[];
  allReplyCmts: number;
  message: string;
};

type FailedApiResponse = {
  error: string;
};
class DiscussionsSerivice {
  addComment = (userId: number, onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    postFetch({}, `/api/v1/discussions/add/${userId}`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };

  deleteComment = (id: number, onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    getFetch(`/api/v1/discussions/delete/${id}`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };
  getComment = (id: number, onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    getFetch(`/api/v1/discussions/get/${id}`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };

  getCommentsList = (
    resourceId: number,
    pageSize: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/discussions/get-list/${pageSize}/${resourceId}`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };
  getReplyCount = (
    parentCmtId: number,

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/discussions/reply/count/${parentCmtId}`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };

  getAllReplyCount = (
    parentCmtId: number,

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/discussions/reply/${parentCmtId}`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };

  updateComment = (id: number, onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    postFetch({}, `/api/v1/discussions/update/${id}`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };
}

export default new DiscussionsSerivice();
