import { NextApiResponse } from "next";
import fetch from "node-fetch";

export const onDeleteVideo = (id: string, libraryId: number, accessKey: string) => {
  const options = {
    method: "DELETE",
    headers: {
      accept: "application/json",
      AccessKey: accessKey,
    },
  };

  fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${id}`, options)
    .then((response: { json: () => any }) => response.json())
    .then((response: any) => {
      console.log(response, "dlete");
    })
    .catch((err: any) => console.error(err));
};

export const createVideo = async (
  title: string,
  libraryId: number,
  accessKey: string,

  file: any,
  res: NextApiResponse
) => {
  // setLoading(true);

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
  console.log(file, "my file create");

  fetch(url, options)
    .then((res) => res.json())
    .then(async (json: any) => {
      //   const uploadedData = await uploadFileToBunny(json.guid as string, file, accessKey, libraryId, res);
      //   let uploadedData = await uploadVideo(json.guid, accessKey, libraryId, file, res);
      //   return uploadedData;
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
    .then(async (json: any) => {
      console.log(json, "get video");
      return res.status(200).json({ success: true, message: "uploaded successfully", videoData: json });
    })
    .catch((err: string) => console.error("error:" + err));
};
export const uploadVideo = async (
  id: string,
  accessKey: string,
  libraryId: number,

  file: any,
  res: NextApiResponse
) => {
  console.log(file, "my file upload");

  const url = `https://video.bunnycdn.com/library/${libraryId}/videos/${id}`;
  const options = {
    method: "PUT",
    headers: { accept: "application/json", AccessKey: accessKey },
    body: file,
  };

  fetch(url, options)
    .then((res) => res.json())
    .then(async (json: any) => {
      const data = await getVideo(libraryId, accessKey, id, res);
      return data;
    })
    .catch((err: string) => {
      console.error("error:" + err);
    });
};
