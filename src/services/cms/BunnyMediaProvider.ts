import { ContentServiceProvider } from "./ContentManagementService";
import { FileUploadResponse, VideoAPIResponse } from "@/types/courses/Course";
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
  videoCDNHostname: string = "vz-bb827f5e-131.b-cdn.net";
  fileCDN: string = "torqbit-dev.b-cdn.net";

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

  getUploadFileUrl(file: string) {
    let path = this.mediaPath;
    if (path.endsWith("/")) {
      path = path.substring(0, path.length - 1);
    }
    return `https://storage.bunnycdn.com/${this.storageZone}/${path}/${file}`;
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

  async uploadVideo(title: string, file: Buffer, courseId: number, chapterId: number): Promise<VideoAPIResponse> {
    let guid: string;
    const res = await fetch(this.createVideoUrl(this.libraryId), this.getPostOption(title, this.accessKey));
    const json = await res.json();
    guid = json.guid;
    const res_1 = await fetch(this.getUploadUrl(json.guid, this.libraryId), this.getUploadOption(file, this.accessKey));
    const uploadedData = await res_1.json();
    const res_2 = await fetch(this.getVideoUrl(guid, this.libraryId), this.getVideoOption(this.accessKey));
    const videoData = await res_2.json();
    console.log(videoData);
    return {
      videoId: videoData.guid as string,
      thumbnail: `https://${this.videoCDNHostname}/${videoData.guid}/${videoData.thumbnailFileName}`,
      previewUrl: `https://${this.videoCDNHostname}/${videoData.guid}/preview.webp`,
      videoUrl: `https://iframe.mediadelivery.net/play/${this.libraryId}/${videoData.guid}`,
    };
  }

  uploadFile(
    name: string,
    file: Buffer,
    courseId: number,
    chapterId?: number | undefined
  ): Promise<FileUploadResponse> {
    return fetch(this.getUploadFileUrl(name), this.getUploadOption(file, this.accessPassword))
      .then((res) => {
        return res.json();
      })
      .then((uploadRes: any) => {
        console.log(uploadRes);
        return {
          statusCode: uploadRes.HttpCode,
          message: uploadRes.Message,
          success: uploadRes.HttpCode == 201,
          fileCDNPath: uploadRes.HttpCode == 201 ? `https://${this.fileCDN}/${this.mediaPath}/${name}` : "",
        };
      });
  }
}
