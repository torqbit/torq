import { IWelcomeEmailConfig } from "@/lib/emailConfig";

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import { Flex } from "antd";
import * as React from "react";
interface IProps {
  configData: IWelcomeEmailConfig;
}
const WelcomeEmailPage = ({ configData }: IProps) => {
  return (
    <Tailwind>
      <Html>
        <Head />

        <Preview>{`${process.env.NEXT_PUBLIC_PLATFORM_NAME}`}</Preview>

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
              <Text className="text-black text-[20px] leading-[20px]">Hey, {configData.name}!</Text>
              <Text className="text-[#888] text-[14px] leading-[20px]">
                Welcome to the {`${process.env.NEXT_PUBLIC_PLATFORM_NAME}`} Platform. we&apos;re excited to have you
                join our community. You can nowexcel in the field of software development, connect with fellow learners
                and help each other to move forward.
              </Text>
              <Text className="text-[#888] text-[14px] leading-[20px]">
                Choose from the courses below or click on the button at the bottom to view all the courses.
              </Text>
              <Section className="">
                {configData.courses.map((c, i) => {
                  return (
                    <div key={i} className="text-center bg-[#fff] min-h-[150px] p-2 mt-[32px] mb-[32px]">
                      <Img src={c.thumbnail} alt="course" height={150} className="object-cover w-full" />
                      <Flex vertical justify="space-between" className="">
                        <div>
                          <Heading className="text-[#000] text-left text-[15px] mb-1 ">{c.name}</Heading>
                          <Text className="leading-[20px] text-[#888] text-[14px] text-left m-0 mb-4">
                            If you have any questions, feel free to email our support team, or even send a reply .
                          </Text>
                        </div>
                        <Section className="flex item-center justify-start">
                          <Button
                            href={c.link}
                            className="bg-[#5b63d3] px-5 py-2 text-white text-left text-[12px]  rounded"
                          >
                            Learn More
                          </Button>
                        </Section>
                      </Flex>
                    </div>
                  );
                })}
              </Section>

              <Text className="text-[#888] text-[14px] leading-[20px]">
                If you have any questions, feel free to email our support team, or even send a reply to this email. We
                wouuld be happy to answer any queries.
              </Text>
              <Text className="text-[#000] text-[15px] m-0 ">
                Thanks & Regards <br />
              </Text>
              <Text className="text-black text-[15px] my-2">{process.env.NEXT_PUBLIC_PLATFORM_NAME} team</Text>

              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
              <Text className="text-[#888] text-[14px] leading-[20px]">
                If you're having trouble with the button above, copy and paste the URL below into your web browser.
              </Text>
              <Link href={configData.url} className="text-blue-600 cursor-pointer">
                {configData.url}
              </Link>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default WelcomeEmailPage;
