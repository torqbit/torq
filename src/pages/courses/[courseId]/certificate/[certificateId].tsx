import Layout2 from "@/components/Layout2/Layout2";
import SvgIcons from "@/components/SvgIcons";
import ProgramService from "@/services/ProgramService";
import styles from "@/styles/CourseCertificate.module.scss";
import { Button, Flex, Skeleton, Space } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
export const SkeletonComp: FC<{ loading: boolean }> = ({ loading }) => {
  return (
    <Space direction="vertical" className={styles.skeleton_style}>
      <Skeleton.Input active={loading} size="default" block style={{ marginBottom: 20 }} />
      <Skeleton.Image active={loading} style={{ width: 900, height: 500 }} />
      {/* <Skeleton.Input active={loading} size="small" /> */}
    </Space>
  );
};

const CourseCertificate = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [certificateUrl, setCertificateUrl] = useState<string>();
  const [courseName, setCourseName] = useState<string>();
  const { data: session } = useSession();
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

  const onDownloadCertificate = async () => {
    try {
      handleDownload(certificateUrl as string);
    } catch (err) {
      console.log("Error on image");
    }
  };
  useEffect(() => {
    setLoading(true);
    ProgramService.getCertificate(
      Number(router.query.courseId),
      (result) => {
        console.log(result, "r");
        let imgPath = result.certificateDetail.getIssuedCertificate.imagePath;
        imgPath && setCertificateUrl(imgPath);
        setCourseName(result.certificateDetail.course.name);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
      }
    );
  }, [router.query.certificateId]);
  return (
    <Layout2>
      {loading ? (
        <SkeletonComp loading={loading} />
      ) : (
        <Space direction="vertical" size={"middle"} className={styles.certificate_page}>
          <div>
            <h2>Hello {session?.user?.name}</h2>

            <Flex style={{ fontSize: 20 }} className={styles.certificate_header}>
              <Link href={"/courses"}>Courses</Link> <div style={{ marginTop: 3 }}>{SvgIcons.chevronRight} </div>{" "}
              <Link href={`/courses/${router.query.courseId}`}> {courseName}</Link>
              <div style={{ marginTop: 3 }}>{SvgIcons.chevronRight} </div> Certificate
            </Flex>
          </div>
          <p className={styles.about_description}>
            Torqbit certifies the successful completion of <span>{courseName}</span> by <span>{session?.user?.name} </span>
          </p>
          <div className={styles.certificate_image}>
            <img src={certificateUrl} height={500} width={800} alt={session?.user?.name ?? "Certificate"} />

            <Button type="primary" onClick={onDownloadCertificate}>
              <Flex align="center" gap={10}>
                {" "}
                Download Certificate {SvgIcons.arrowRight}
              </Flex>
            </Button>
          </div>
        </Space>
      )}
    </Layout2>
  );
};

export default CourseCertificate;
