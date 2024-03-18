import SvgIcons from "@/components/SvgIcons";
import { ChapterDetail } from "@/pages/add-course";
import styles from "@/styles/Preview.module.scss";
import { Button, Collapse, Dropdown, Flex, MenuProps, Popconfirm, Tag } from "antd";

import { FC, ReactNode, useState } from "react";

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
          time="5m 15s"
          onRender={setRender}
          render={render}
          keyValue={`${i + 1}`}
        />
      ),
      children: content.resource.map((res, i) => {
        console.log(res, "res");
        return (
          <div className={styles.resContainer}>
            <Label
              title={res.name}
              icon={SvgIcons.playBtn}
              time="4m 5s"
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
  // const git = [
  //   <div className={styles.resContainer}>
  //     <Label
  //       title="History to Git"
  //       icon={SvgIcons.playBtn}
  //       time="4m 5s"
  //       onRender={setRender}
  //       render={render}
  //       keyValue="res1"
  //     />
  //   </div>,
  //   <div className={styles.resContainer}>
  //     <Label
  //       title="Install GIt on Mac & Windows "
  //       icon={SvgIcons.playBtn}
  //       time="6m 25s"
  //       onRender={setRender}
  //       render={render}
  //       keyValue="res2"
  //     />
  //   </div>,
  //   <div className={styles.resContainer}>
  //     <Label
  //       title="Basic  Git Commands"
  //       icon={SvgIcons.playBtn}
  //       time="7m 25s"
  //       onRender={setRender}
  //       render={render}
  //       keyValue="res3"
  //     />
  //   </div>,
  //   <div className={styles.resContainer}>
  //     <Label
  //       title="Test ypur Git skills "
  //       icon={SvgIcons.file}
  //       time="7m 25s"
  //       onRender={setRender}
  //       render={render}
  //       keyValue="res4"
  //     />
  //   </div>,
  //   <div className={styles.resContainer}>
  //     <Label
  //       title="  Git commit & logs"
  //       icon={SvgIcons.file}
  //       time="7m 25s"
  //       onRender={setRender}
  //       render={render}
  //       keyValue="res5"
  //     />
  //   </div>,
  // ];
  // const branch = [
  //   <div className={styles.resContainer}>
  //     <Label
  //       title="Feature branch"
  //       icon={SvgIcons.playBtn}
  //       time="7m 25s"
  //       onRender={setRender}
  //       render={render}
  //       keyValue="res1"
  //     />
  //   </div>,
  //   <div className={styles.resContainer}>
  //     <Label
  //       title="Merging multiple branches "
  //       icon={SvgIcons.playBtn}
  //       time="7m 25s"
  //       onRender={setRender}
  //       render={render}
  //       keyValue="res2"
  //     />
  //   </div>,
  //   <div className={styles.resContainer}>
  //     <Label
  //       title="  Git rebase"
  //       icon={SvgIcons.playBtn}
  //       time="4m 30s"
  //       onRender={setRender}
  //       render={render}
  //       keyValue="res3"
  //     />
  //   </div>,
  //   <div className={styles.resContainer}>
  //     <Label
  //       title="Test ypur Git skills "
  //       icon={SvgIcons.file}
  //       time="4m 30s"
  //       onRender={setRender}
  //       render={render}
  //       keyValue="res4"
  //     />
  //   </div>,
  //   <div className={styles.resContainer}>
  //     <Label
  //       title="  Git branch commands "
  //       icon={SvgIcons.file}
  //       time="4m 30s"
  //       onRender={setRender}
  //       render={render}
  //       keyValue="res5"
  //     />
  //   </div>,
  // ];
  // const items = [
  //   {
  //     key: "1",
  //     label: (
  //       <Label
  //         title="Introduction to Git"
  //         icon={SvgIcons.folder}
  //         time="5m 15s"
  //         onRender={setRender}
  //         render={render}
  //         keyValue="1"
  //       />
  //     ),
  //     children: git,
  //     showArrow: false,
  //   },
  //   {
  //     key: "2",
  //     label: (
  //       <Label
  //         title="  Git branching"
  //         icon={SvgIcons.folder}
  //         time="5m 15s"
  //         onRender={setRender}
  //         render={render}
  //         keyValue="2"
  //       />
  //     ),
  //     children: branch,
  //     showArrow: false,
  //   },
  // ];

  return (
    <section className={styles.preview_container}>
      <div>
        <video className={styles.video_container} autoPlay src={uploadUrl.videoUrl} loop />
      </div>
      <div className={styles.react_player}></div>
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
      <div className={styles.play_btn}>{SvgIcons.reactPlayBtn}</div>
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
