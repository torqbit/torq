import { ContentServiceProvider } from "./ContentManagementService";
import { VideoAPIResponse } from "@/types/courses/Course";
export type GetVideo = {
  guid: string;
  libraryId: number;
};
export type BunnyConfig = {
  accessKey: string;
  libraryId: string;
  accessPassword: string;
  storageZone: string;
  mediaPath: string;
};

type BunnyVideoAPIResponse = {
  videoLibraryId: number;
  guid: string;
  title: string;
  dateUploaded: Date;
  views: number;
  isPublic: boolean;
  length: number;
  status: string;
  thumbnailFileName: string;
};
export class BunnyMediaProvider implements ContentServiceProvider {
  accessKey: string;
  libraryId: string;
  accessPassword: string;
  storageZone: string;
  mediaPath: string;
  cdnHostname: string = "vz-bb827f5e-131.b-cdn.net";

  constructor(accessKey: string, libraryId: string, accessPassword: string, storageZone: string, mediaPath: string) {
    (this.accessKey = accessKey),
      (this.libraryId = libraryId),
      (this.storageZone = storageZone),
      (this.accessPassword = accessPassword),
      (this.mediaPath = mediaPath);
  }

  createVideoUrl(key: string) {
    return `https://video.bunnycdn.com/library/${key}/videos`;
  }

  getUploadUrl(id: string, libId: string) {
    return `https://video.bunnycdn.com/library/${libId}/videos/${id}`;
  }
  getVideoUrl(id: string, libId: string) {
    return `https://video.bunnycdn.com/library/${libId}/videos/${id}`;
  }

  getPostOption(title: string, key: string) {
    return {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        AccessKey: key as string,
      },
      body: JSON.stringify({ title: title }),
    };
  }
  getUploadOption(file: Buffer, key: string) {
    return {
      method: "PUT",
      headers: { accept: "application/json", AccessKey: key },
      body: file,
    };
  }

  getVideoOption(key: string) {
    return {
      method: "GET",
      headers: {
        accept: "application/json",
        AccessKey: key as string,
      },
    };
  }

  uploadVideo(title: string, file: Buffer, courseId: number, chapterId: number): Promise<VideoAPIResponse> {
    let guid: string;
    return fetch(this.createVideoUrl(this.libraryId), this.getPostOption(title, this.accessKey))
      .then((res) => res.json())
      .then((json: any) => {
        guid = json.guid;
        return fetch(this.getUploadUrl(json.guid, this.libraryId), this.getUploadOption(file, this.accessKey));
      })
      .then((res) => res.json())
      .then((uploadedData) => fetch(this.getVideoUrl(guid, this.libraryId), this.getVideoOption(this.accessKey)))
      .then((res) => res.json())
      .then((videoData: BunnyVideoAPIResponse) => {
        return {
          videoId: videoData.guid as string,
          thumbnail: `https://${this.cdnHostname}/${videoData.guid}/${videoData.thumbnailFileName}`,
          previewUrl: `https://${this.cdnHostname}/${videoData.guid}/preview.webp`,
          videoUrl: `https://iframe.mediadelivery.net/play/${this.libraryId}/${videoData.guid}`,
        };
      });
  }

  uploadFile(name: string, file: Buffer, courseId: number, chapterId?: number | undefined): Promise<any> {
    return Promise.resolve();
  }
}
