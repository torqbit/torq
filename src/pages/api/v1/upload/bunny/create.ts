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
