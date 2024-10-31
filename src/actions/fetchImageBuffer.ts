export const fetchImageBuffer = async (url: string): Promise<Buffer | undefined> => {
  try {
    const response = await fetch(url);
    let arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer;
  } catch (error: any) {
    let errorData = {
      status: error.status,
      statusText: error.statusText,
    };
    console.error("Error fetching the image:", errorData);
    return;
  }
};
