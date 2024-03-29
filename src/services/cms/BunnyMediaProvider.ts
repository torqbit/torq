import { error } from "console";
import { ContentServiceProvider } from "./ContentManagementService";
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
export class BunnyMediaProvider implements ContentServiceProvider {
  accessKey: string;
  libraryId: string;
  accessPassword: string;
  storageZone: string;
  mediaPath: string;

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

  uploadVideo(
    title: string,
    file: Buffer,
    courseId: number,
    chapterId: number
  ): Promise<{ id: string; videoId: string }> {
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
      .then((videoData: any) => {
        console.log(videoData, "video data");
        return { id: videoData.guid as string, videoId: this.libraryId };
      });
  }

  uploadFile(name: string, file: Buffer, courseId: number, chapterId?: number | undefined): Promise<any> {
    return Promise.resolve();
  }
}
