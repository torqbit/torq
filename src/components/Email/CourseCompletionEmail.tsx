import { IEmailConfig } from "@/lib/types/email";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
  TailwindConfig,
} from "@react-email/components";
import { Flex } from "antd";
import * as React from "react";

export interface CourseCompletionProps {
  name: string;
  course: { name: string; thumbnail: string };
  configData: IEmailConfig;
  courseId: number;
  issuedCertificateId: string;
}

export const CourseCompletionEmail = ({
  name,
  course,
  configData,
  courseId,
  issuedCertificateId,
}: CourseCompletionProps) => {
  return (
    <Html>
      <Head />

      <Preview>{configData.productName}</Preview>
      <Tailwind
        config={
          {
            theme: {
              extend: {},

              screens: {
                sm: "640px",
                // => @media (min-width: 640px) { ... }

                md: "768px",
                // => @media (min-width: 768px) { ... }

                lg: "1024px",
                // => @media (min-width: 1024px) { ... }

                xl: "1280px",
                // => @media (min-width: 1280px) { ... }

                "2xl": "1636px",
                // => @media (min-width: 1536px) { ... }
              },
            },
          } as TailwindConfig
        }
      >
        <Head>
          <style></style>
        </Head>
        <Body className="bg-[#f5f5f5] my-auto mx-auto font-sans ">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto    max-w-[465px]">
            <Heading className="text-black   w-full  text-[20px] font-normal  my-0 text-center py-2  mx-0 bg-[#fff]">
              <Flex align="center" justify="center">
                <Img
                  height={50}
                  width={50}
                  style={{ display: "unset" }}
                  src={`https://torqbit-dev.b-cdn.net/static/torq.png`}
                />
              </Flex>
            </Heading>
            <Section className="px-[20px]">
              <Text className="text-black text-[20px] leading-[20px]">Hey, {name}!</Text>
              <Text className="text-[#888] text-[14px] leading-[20px]">{configData.description(course.name)}</Text>
              <Text className="text-[#888] text-[14px] leading-[20px]">{configData.linkDescription}</Text>
              <Section className="flex item-center gap-5">
                <Link
                  href={`${configData.url}/${configData.url}
                ${courseId}/certificate/${issuedCertificateId}`}
                >
                  <Img
                    src={`https://torqbit-dev.b-cdn.net/static/certificate-template.png`}
                    className="w-full"
                    alt="course"
                  />
                </Link>
              </Section>

              <Text className="text-[#888] text-[14px] leading-[20px]">{configData.queryDescription}</Text>
              <Text className="text-[#000] text-[15px] m-0 ">
                Thanks & Regards <br />
              </Text>
              <Text className="text-black text-[15px] my-2">{configData.productName} team</Text>

              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
              <Text className="text-[#888] text-[14px] leading-[20px]">{configData.urlIssueDescription}</Text>
              <Link className="text-blue-600 cursor-pointer">
                {configData.url}
                {courseId}/certificate/{issuedCertificateId}
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default CourseCompletionEmail;
