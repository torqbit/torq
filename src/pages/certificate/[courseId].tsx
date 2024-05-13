import React, { FC, useEffect, useState } from "react";
import Layout2 from "@/components/Layout2/Layout2";
import styles from "@/styles/DownloadCertificate.module.scss";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import ProgramService from "@/services/ProgramService";
import { DotChartOutlined } from "@ant-design/icons";
import { Space, Skeleton, message, Button } from "antd";
import { useSession } from "next-auth/react";
import CertificateImg from "@/services/certificate/certificate5b4";
import Particles from "react-tsparticles";
import tsParticlesOptions from "@/services/confettiExplosions/particles.json";
import { tsParticles } from "tsparticles-engine";
import fs from "fs";

interface IProps {
  session: Session;
}

// export const handleImage = (e:any) => {
//     let imgB64;
//     console.log("Handle image called");
//    const bufferData = fs.readFileSync('/img/certificate/certificate-sample.png')
//    let binBuffer = Buffer.from(bufferData,'binary').toString('utf8');
//     console.log("Selected file:", selectedFile);
//     if (selectedFile) {
//         const reader = new FileReader();
//         reader.onload = (e:any) => {
//             const imageData = e.target.result;
//             console.log("imageData: ", imageData);
//             imgB64 = imageData
//             // setImage(imageData); // Store the Base64-encoded image data
//         };

//     }
// };

export const addNameAndCourse = async (courseName: string, studentName: string, authorName: string) => {
  return new Promise(async (resolve, reject) => {
    let description = `who has successfully completed the course ${courseName}, an online course </br> authored by ${authorName} and offered by Torqbit`;
    // Create a new image
    let img = new Image();

    // Set the source of the image
    img.src = `/img/certificate/certificate-sample.png`;

    // Once the image is loaded, perform the drawing operations
    img.onload = function () {
      // Create a canvas element
      let canvas = document.createElement("canvas");

      // Add Cursive font
      let fontItalic = new FontFace("fontItalic", "url(/DM_Serif_Display/DMSerifDisplay-Italic.ttf)");
      let fontRegular = new FontFace("fontRegular", "url(/DM_Serif_Display/DMSerifDisplay-Regular.ttf)");
      fontItalic.load().then(function (font) {
        document.fonts.add(font);
        console.log("Font loaded");
      });
      fontRegular.load().then(function (font) {
        document.fonts.add(font);
        console.log("Font loaded");
      });

      // Set the canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height; // Extra height for the label
      // Get the 2D context of the canvas
      let ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
      console.log(ctx, "ctx data");

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);

      ctx.font = " 45px fontRegular";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(courseName, 1188, 795);

      ctx.font = "90px  fontItalic";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(studentName, 1008, 692);

      // Convert the canvas to a data URL
      let dataURL = canvas.toDataURL("image/png");
      // Execute the callback with the data URL
      // resolve(dataURL.split(",")[1]);
      resolve(dataURL);
    };

    // Handle image loading error
    img.onerror = function (err) {
      console.log("add label err", err);
      reject(new Error("Error loading image."));
    };
  });
};

const handleDownload = (imageUrl: string) => {
  // Replace 'your-image-url.jpg' with the actual URL or path of your image

  // Create an anchor element
  const downloadLink = document.createElement("a");

  // Set the href attribute to the image URL
  downloadLink.href = imageUrl;

  // Set the download attribute to suggest a filename for the downloaded file
  downloadLink.download = "Torqbit-Certificate.png";

  // Append the anchor element to the document
  document.body.appendChild(downloadLink);

  // Trigger a click on the anchor element to start the download
  downloadLink.click();

  // Remove the anchor element from the document
  document.body.removeChild(downloadLink);
};

const SkeletonComp: FC<{ loading: boolean }> = ({ loading }) => {
  return (
    <Space direction="vertical" className={styles.skeleton_style}>
      <Skeleton.Input active={loading} size="default" block style={{ marginBottom: 20 }} />
      <Skeleton.Image active={loading} style={{ width: 900, height: 500 }} />
      {/* <Skeleton.Input active={loading} size="small" /> */}
    </Space>
  );
};

const DownloadCertificate = (props: IProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { data: user } = useSession();
  const [downCertificate, setDownCertificate] = useState<any>("");
  const router = useRouter();
  const courseId = router.query.courseId;
  const { session } = props;
  const [programState, setProgramState] = useState<{
    title: string;
  }>({
    title: "",
  });

  useEffect(() => {
    if (user?.user && courseId) {
      ProgramService.getCourses(
        Number(courseId),
        async (result) => {
          setProgramState({
            title: result.courseDetails.name,
          });
          const updatedImg = await addNameAndCourse(
            result.courseDetails.name,
            user?.user?.name as string,
            result.courseDetails.user.name
          );
          setDownCertificate(updatedImg);

          setLoading(false);
        },
        (error) => {
          setLoading(false);
          message.error(error);
        }
      );
    }
  }, [courseId, user?.user]);

  const onDownloadCertificate = async () => {
    try {
      handleDownload(downCertificate);
    } catch (err) {
      console.log("Error on image");
    }
  };

  return (
    <Layout2 className={styles.certificate_page}>
      <div id="tsparticles"></div>
      {loading ? (
        <SkeletonComp loading={loading} />
      ) : (
        <>
          <h1>Download Certificate of {programState.title}</h1>
          <div className={styles.certificate_image}>
            <img src={downCertificate} height={600} width={800} alt={session?.user?.name ?? "Certificate"} />
          </div>
          <Button type="primary" className={styles.download_btn} onClick={onDownloadCertificate}>
            Download
          </Button>
        </>
      )}
    </Layout2>
  );
};

export default DownloadCertificate;
