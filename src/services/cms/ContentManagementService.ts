import { FileUploadResponse, VideoAPIResponse } from "@/types/courses/Course";
import { BunnyConfig, BunnyMediaProvider, GetVideo } from "./BunnyMediaProvider";

export interface ContentServiceProvider {
  uploadVideo(title: string, file: Buffer, courseId: number, chapterId: number): Promise<VideoAPIResponse>;

  uploadFile(name: string, file: Buffer, courseId: number, chapterId?: number): Promise<FileUploadResponse>;
}

export class ContentManagementService {
  getServiceProvider = (name: string, config: any): ContentServiceProvider => {
    console.log(config, "config info");
    switch (name) {
      case "bunny":
        let c = config as BunnyConfig;
        return new BunnyMediaProvider(
          c.accessKey,
          c.libraryId,
          c.streamCDNHostname,
          c.storagePassword,
          c.connectedCDNHostname,
          c.storageZone,
          c.mediaPath
        );

      default:
        throw new Error("something went wrong");
    }
  };

  uploadVideo = (title: string, file: Buffer, courseId: number, chapterId: number, csp: ContentServiceProvider) => {
    return csp.uploadVideo(title, file, courseId, chapterId);
  };

  uploadFile = (fileName: string, file: Buffer, courseId: number, chapterId: number, csp: ContentServiceProvider) => {
    return csp.uploadFile(fileName, file, courseId, chapterId);
  };
}
