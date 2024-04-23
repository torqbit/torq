import { NextApiResponse } from "next";

export const createVideo = async (
  title: string,
  libraryId: number,
  accessKey: string,
  courseId: number,
  file: any,
  res: NextApiResponse
) => {
  // const fetch = require("node-fetch");
  const url = `https://video.bunnycdn.com/library/${Number(libraryId)}/videos`;
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      AccessKey: accessKey as string,
    },
    body: JSON.stringify({ title: title }),
  };

  fetch(url, options)
    .then((res) => res.json())
    .then(async (json: any) => {
      let uploadedData = await uploadVideo(json.guid, accessKey, libraryId, courseId, file, res);
      return uploadedData;
    })
    .catch((err: string) => {
      console.error("error:" + err);
    });
};

const uploadVideo = async (
  id: string,
  accessKey: string,
  libraryId: number,
  courseId: number,
  file: any,
  res: NextApiResponse
) => {
  const url = `https://video.bunnycdn.com/library/${libraryId}/videos/${id}`;
  const options = {
    method: "PUT",
    headers: { accept: "application/json", AccessKey: accessKey },
    body: file,
  };

  fetch(url, options)
    .then((res) => res.json())
    .then(async (uploadData: any) => {
      const uploadedVideo = await getVideo(libraryId, accessKey, id, res);
      return uploadedVideo;
    })
    .catch((err: string) => {
      console.error("error:" + err);
    });
};

export const getVideo = async (libraryId: number, accessKey: string, id: string, res: NextApiResponse) => {
  const url = `https://video.bunnycdn.com/library/${libraryId}/videos/${id}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      AccessKey: accessKey as string,
    },
  };

  fetch(url, options)
    .then((res: { json: () => any }) => res.json())
    .then(async (videoData: any) => {
      return videoData;
    })
    .catch((err: string) => console.error("error:" + err));
};

const uploadFile = async (file: any, accessKey: string, fileName: string) => {
  if (file) {
    const BASE_HOSTNAME = "storage.bunnycdn.com";

    const url = `https://storage.bunnycdn.com/torqbit-files/static/course-banners/${fileName}`;

    const options = {
      method: "PUT",
      host: BASE_HOSTNAME,
      headers: {
        AccessKey: accessKey,
        "Content-Type": "application/json",
      },
      body: file,
    };

    fetch(url, options)
      .then((res: { json: () => any }) => res.json())
      .then((uploadedData: any) => {})
      .catch((err: string) => {
        console.error("error:" + err);
      });
  }
};
