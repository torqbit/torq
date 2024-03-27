import { BunnyConfig, BunnyMediaProvider, GetVideo } from "./BunnyMediaProvider";

export interface ContentServiceProvider {
  uploadVideo(
    title: string,
    file: Buffer,
    courseId: number,
    chapterId: number
  ): Promise<{ id: string; videoId: string }>;

  uploadFile(name: string, file: Buffer, courseId: number, chapterId?: number): Promise<void>;
}

export class ContentManagementService {
  getServiceProvider = (name: string, config: any): ContentServiceProvider => {
    console.log(config, "config info");
    switch (name) {
      case "bunny":
        let c = config as BunnyConfig;
        return new BunnyMediaProvider(c.accessKey, c.libraryId, c.accessPassword, c.storageZone, c.mediaPath);

      default:
        throw new Error("something went wrong");
    }
  };

  uploadVideo = (title: string, file: Buffer, courseId: number, chapterId: number, csp: ContentServiceProvider) => {
    return csp.uploadVideo(title, file, courseId, chapterId);
  };
}
