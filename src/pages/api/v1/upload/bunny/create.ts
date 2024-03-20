import ProgramService from "@/services/ProgramService";
import appConstant from "@/services/appConstant";
import { message } from "antd";
import { IncomingForm } from "formidable";
import { useRouter } from "next/router";

export const createVideo = async (
  title: string,
  libraryId: number,
  accessKey: string,
  courseId: number,
  file: any,
  setLoading: (value: boolean) => void,
  onRefresh: () => void
) => {
  const fetch = require("node-fetch");
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
    .then((res: { json: () => JSON }) => res.json())
    .then((json: any) => {
      console.log(json, "va");
      let uploadedData = uploadVideo(json.guid, accessKey, libraryId, courseId, file, setLoading, onRefresh);
      return uploadedData;
    })
    .catch((err: string) => {
      console.error("error:" + err);
      setLoading(false);
    });
};

export const uploadVideo = (
  id: string,
  accessKey: string,
  libraryId: number,
  courseId: number,
  file: any,
  setLoading: (value: boolean) => void,
  onRefresh: () => void
) => {
  console.log("guid:", id, "key:", accessKey, "lib:", libraryId);
  const fetch = require("node-fetch");

  const url = `https://video.bunnycdn.com/library/${libraryId}/videos/${id}`;
  const options = {
    method: "PUT",
    headers: { accept: "application/json", AccessKey: accessKey },
    body: file,
  };

  fetch(url, options)
    .then((res: { json: () => JSON }) => res.json())
    .then((json: any) => {
      let course = {
        name: undefined,
        duration: undefined,
        state: "DRAFT",
        skills: [],
        description: undefined,
        thumbnail: undefined,
        thumbnailId: undefined,
        videoUrl: id,
        videoId: `${libraryId}`,
        programId: 0,
        authorId: 0,
        sequenceId: undefined,
        courseId: courseId,
      };
      ProgramService.updateCourse(
        course,
        (result) => {
          onRefresh();
          message.success("file uploaded");
          setLoading(false);
        },
        (error) => {
          message.error(error);
        }
      );
      console.log(json, "json value uploaded");
    })
    .catch((err: string) => {
      setLoading(false);
      console.error("error:" + err);
    });
};

export const onDeleteVideo = (id: string, libraryId: number, accessKey: string) => {
  const options = {
    method: "DELETE",
    headers: {
      accept: "application/json",
      AccessKey: accessKey,
    },
  };

  fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${id}`, options)
    .then((response) => response.json())
    .then((response) => {
      console.log(response, "dlete");
    })
    .catch((err) => console.error(err));
};

// 4f193711-8304-4183-b808-d32066332b61
// 816cf056-5536-4343-bae2-9c7971fe0431
