import SvgIcons from "@/components/SvgIcons";
import { ChapterDetail } from "@/pages/add-course";
import ProgramService from "@/services/ProgramService";
import styles from "@/styles/Preview.module.scss";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Collapse, Dropdown, Flex, MenuProps, Popconfirm, Tag } from "antd";

import { FC, ReactNode, useEffect, useState } from "react";

const Label: FC<{
  title: string;
  time: string;
  keyValue: string;
  onRender: (value: string[]) => void;
  render: string[];
  icon: ReactNode;
}> = ({ title, time, onRender, render, keyValue, icon }) => {
  const onActive = (value: string[]) => {
    if (render.includes(value[0])) {
      let currentValue = render.filter((v) => v !== value[0]);
      onRender(currentValue);
    } else {
      render.push(value[0]);
    }
  };

  return (
    <div className={styles.labelContainer}>
      <Flex justify="space-between" align="center">
        <div>
          <Flex gap={10} align="center">
            {icon}
            <div style={{ cursor: "pointer" }} onClick={() => onActive([keyValue])}>
              {title}
            </div>
          </Flex>
        </div>
        <div>
          <Tag color="#eee" className={styles.time_tag}>
            {time}
          </Tag>
        </div>
      </Flex>
    </div>
  );
};

const Preview: FC<{
  uploadUrl: {
    uploadType?: string;
    thumbnailImg?: string;
    thumbnailId?: string;
    videoUrl?: string;
    videoId?: string;
  };
  chapter: ChapterDetail[];
}> = ({ uploadUrl, chapter }) => {
  const renderKey = chapter.map((c, i) => {
    return `${i + 1}`;
  });
  const [render, setRender] = useState(renderKey);

  const items = chapter.map((content, i) => {
    return {
      key: `${i + 1}`,
      label: (
        <Label
          title={content.name}
          icon={SvgIcons.folder}
          time={""}
          onRender={setRender}
          render={render}
          keyValue={`${i + 1}`}
        />
      ),
      children: content.resource.map((res, i) => {
        return (
          <div className={styles.resContainer}>
            <Label
              title={res.name}
              icon={res.contentType === "Video" ? SvgIcons.playBtn : SvgIcons.file}
              time={res.contentType === "Video" ? `${res.videoDuration} min` : `${res.daysToSubmit} days`}
              onRender={setRender}
              render={render}
              keyValue={`${i + 1}`}
            />
          </div>
        );
      }),
      showArrow: false,
    };
  });

  return (
    <section className={styles.preview_container}>
      <div>
        <video
          className={styles.video_container}
          autoPlay
          src={`https://vz-bb827f5e-131.b-cdn.net/${uploadUrl.videoUrl}/play_720p.mp4`}
          loop
        />

        {/* <div>
          <iframe
            className={styles.video_container}
            src={`https://iframe.mediadelivery.net/embed/${uploadUrl.videoId}/${uploadUrl.videoUrl}?autoplay=true`}
            // src={`"https://vz-bb827f5e-131.b-cdn.net/${uploadUrl.videoUrl}/preview.webp"`}
            // src={`https://vz-bb827f5e-131.b-cdn.net/${uploadUrl.videoUrl}/thumbnail.jpg`}
            loading="lazy"
            // style="border: none; position: absolute; top: 0; height: 100%; width: 100%;"

            height={400}
            width={"100%"}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;loop;"
            allowFullScreen={true}
          ></iframe>
        </div> */}
      </div>

      <div className={styles.video_player_info}>
        <div>
          <h2>Code Collaboration with Git & Github</h2>
          <p>Learn to Collaborate with team using Git & Github, and work on projects that span to multiple teams ...</p>
        </div>
        <Button className={styles.save_btn}>
          <div> Enroll Now</div>
          {SvgIcons.arrowRight}
        </Button>
      </div>

      <h2>Table of Contents</h2>
      {items.map((item, i) => {
        return (
          <div key={i} className={styles.chapter_list}>
            <Collapse
              defaultActiveKey={"1"}
              size="small"
              accordion={false}
              activeKey={render}
              items={[
                {
                  key: item.key,
                  label: item.label,
                  children: item.children,
                  showArrow: false,
                },
              ]}
            />
          </div>
        );
      })}
    </section>
  );
};

export default Preview;
