import SvgIcons from "@/components/SvgIcons";
import { ChapterDetail } from "@/types/courses/Course";
import styles from "@/styles/Curriculum.module.scss";
import { ResourceContentType } from "@prisma/client";
import { Button, Collapse, Dropdown, Flex, Form, MenuProps, Popconfirm, Space, Tag, message } from "antd";

import { FC, ReactNode, useState } from "react";

const Label: FC<{
  title: string;
  id: number;
  deleteChapter: (id: number) => void;
  type: string;
  keyValue: string;
  onRender: (value: string[]) => void;
  render: string[];

  onAddResource: (id: number, content: ResourceContentType) => void;
  onEditResource: (id: number) => void;
  icon: ReactNode;
  state: string;
  updateState: (id: number, state: string) => void;
}> = ({
  title,
  type,
  onRender,
  render,
  keyValue,
  onEditResource,
  icon,
  onAddResource,
  state,
  deleteChapter,
  id,
  updateState,
}) => {
  const onActive = (value: string[]) => {
    if (render.includes(value[0])) {
      let currentValue = render.filter((v) => v !== value[0]);
      onRender(currentValue);
    } else {
      render.push(value[0]);
    }
  };
  const dropdownMenu: MenuProps["items"] = [
    {
      key: "1",
      label: "Edit",
      onClick: () => {
        onEditResource(id);
      },
    },

    {
      key: "2",
      label: (
        <Popconfirm
          title={`Delete the ${type}`}
          description={`Are you sure to delete this ${type}?`}
          onConfirm={() => deleteChapter(id)}
          okText="Yes"
          cancelText="No"
        >
          Delete
        </Popconfirm>
      ),
    },
  ];
  return (
    <div className={styles.labelContainer}>
      <Flex justify="space-between" align="center">
        <div>
          <Flex gap={10} align="center">
            {icon}
            <div style={{ cursor: "pointer" }} onClick={() => type === "chapter" && onActive([keyValue])}>
              {" "}
              {title}
            </div>
          </Flex>
        </div>
        <div>
          <Flex align="center" gap={10}>
            <div>
              {type === "chapter" && (
                <Dropdown.Button
                  icon={SvgIcons.chevronDown}
                  menu={{
                    items: [
                      {
                        key: 1,
                        label: "Video",
                        onClick: () => {
                          onAddResource(id, "Video");
                        },
                      },
                      {
                        key: 2,
                        label: "Assignment",
                        onClick: () => {
                          onAddResource(id, "Assignment");
                        },
                        disabled: true,
                      },
                    ],
                  }}
                >
                  Add Lesson
                </Dropdown.Button>
              )}
            </div>
            <Dropdown.Button
              className={state === "Draft" ? styles.draft_btn : styles.publish_btn}
              icon={SvgIcons.chevronDown}
              menu={{
                items: [
                  {
                    key: 1,
                    label: state === "Published" ? "Draft" : "Published",
                    onClick: () => {
                      updateState(id, state === "Published" ? "DRAFT" : "ACTIVE");
                    },
                  },
                ],
              }}
            >
              {state}
            </Dropdown.Button>
            <div>
              <Dropdown menu={{ items: dropdownMenu }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
                <div style={{ rotate: "90deg" }}>{SvgIcons.threeDots}</div>
              </Dropdown>
            </div>
          </Flex>
        </div>
      </Flex>
    </div>
  );
};

const Curriculum: FC<{
  chapters: ChapterDetail[];
  onDiscard: () => void;
  onRefresh: () => void;
  onEditResource: (id: number) => void;
  setOpen: (value: boolean) => void;
  onAddResource: (id: number, content: ResourceContentType) => void;
  handleEditChapter: (chapterId: number) => void;
  deleteChapter: (id: number) => void;
  updateChapterState: (id: number, state: string) => void;
  updateResState: (id: number, state: string) => void;
  deleteRes: (id: number) => void;
  onSave: (value: string) => void;
}> = ({
  onSave,
  chapters,
  onRefresh,
  setOpen,
  onAddResource,
  handleEditChapter,
  deleteChapter,
  updateChapterState,
  updateResState,
  deleteRes,
  onEditResource,
  onDiscard,
}) => {
  const renderKey = chapters.map((c, i) => {
    return `${i + 1}`;
  });
  const [render, setRender] = useState(renderKey);

  const items = chapters.map((content, i) => {
    return {
      key: `${i + 1}`,
      label: (
        <Label
          title={content.name}
          icon={SvgIcons.folder}
          type="chapter"
          onRender={setRender}
          onEditResource={handleEditChapter}
          deleteChapter={deleteChapter}
          updateState={updateChapterState}
          onAddResource={onAddResource}
          id={content.chapterId}
          render={render}
          keyValue={`${i + 1}`}
          state={content.state === "ACTIVE" ? "Published" : "Draft"}
        />
      ),
      children: content.resource.map((res, i) => {
        return (
          <div className={styles.resContainer}>
            <Label
              title={res.name}
              icon={res.contentType === "Video" ? SvgIcons.playBtn : SvgIcons.file}
              deleteChapter={deleteRes}
              id={res.resourceId}
              updateState={updateResState}
              type="resource"
              onEditResource={onEditResource}
              onAddResource={() => {}}
              onRender={setRender}
              render={render}
              keyValue={`${i + 1}`}
              state={res.state === "ACTIVE" ? "Published" : "Draft"}
            />
          </div>
        );
      }),
      showArrow: false,
    };
  });
  return (
    <section className={styles.curriculum}>
      <div className={styles.curriculum_container}>
        <Flex justify="space-between" align="center">
          <h1>Curriculum</h1>

          {chapters.length > 0 && (
            <Space>
              <Popconfirm
                title={`Delete this course`}
                description={`Are you sure to delete this entire course?`}
                onConfirm={() => onDiscard()}
                okText="Yes"
                cancelText="No"
              >
                <Button>Discard</Button>
              </Popconfirm>

              <Button
                type="primary"
                onClick={() => {
                  onRefresh();
                  onSave("3");
                }}
              >
                Save Curriculum <img style={{ marginLeft: 5 }} src="/img/program/arrow-right.png" alt="arrow" />
              </Button>
            </Space>
          )}
        </Flex>
      </div>
      <div>
        {chapters.length > 0 && (
          <Flex justify="space-between" align="center">
            <h2>{chapters.length ? chapters.length : 0} Chapters</h2>
            <Space>
              <Button className={styles.add_btn} onClick={() => setOpen(true)}>
                {SvgIcons.plusBtn}
                <div> Add Chapter</div>
              </Button>

              <Button className={styles.add_btn} onClick={() => setRender([""])}>
                {SvgIcons.barsArrowDown}Collapse All
              </Button>
            </Space>
          </Flex>
        )}
      </div>
      {chapters.length > 0 ? (
        <div>
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
        </div>
      ) : (
        <div className={styles.no_chapter_btn}>
          <img src="/img/common/empty.svg" alt="" />
          <h4>No chapters were found</h4>
          <p>Start creating chapters and lessons to build your course curriculum</p>
          <Button onClick={() => setOpen(true)} type="primary">
            Add Chapter
          </Button>
        </div>
      )}
    </section>
  );
};

export default Curriculum;
