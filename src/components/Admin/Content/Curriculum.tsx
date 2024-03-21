import SvgIcons from "@/components/SvgIcons";
import { ChapterDetail } from "@/pages/add-course";
import ProgramService from "@/services/ProgramService";
import styles from "@/styles/Curriculum.module.scss";
import { ResourceContentType } from "@prisma/client";
import { Button, Collapse, Dropdown, Flex, Form, MenuProps, Popconfirm, Space, Tag, message } from "antd";

import { FC, ReactNode, useState } from "react";

const Label: FC<{
  title: string;
  id: number;
  deleteChapter: (id: number) => void;
  type: string;
  onEdit: (id: number) => void;

  keyValue: string;
  onRender: (value: string[]) => void;
  render: string[];
  onFindResource: (id: number, content: ResourceContentType) => void;
  deleteRes: (id: number, videoId: number, videoUrl: string, assignment_file: string, type: string) => void;

  icon: ReactNode;
  state: string;
  updateState: (id: number, state: string) => void;
}> = ({
  title,
  type,
  onRender,
  onEdit,
  render,
  keyValue,
  deleteRes,
  icon,
  onFindResource,
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
  const onDeleteRes = () => {
    ProgramService.getResource(
      id,
      (result) => {
        console.log(result, "resfddf");
        deleteRes(
          id,
          Number(result.resource.videoId),
          result.resource.thumbnail as string,
          "course-assignment",
          result.resource.contentType
        );
      },
      (error) => {}
    );
  };
  const dropdownMenu: MenuProps["items"] = [
    {
      key: "1",
      label: "Edit",
      onClick: () => {
        onEdit(id);
      },
    },

    {
      key: "2",
      label: (
        <Popconfirm
          title={`Delete the ${type}`}
          description={`Are you sure to delete this ${type}?`}
          onConfirm={() => (type === "chapter" ? deleteChapter(id) : onDeleteRes())}
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
                          onFindResource(id, "Video");
                        },
                      },
                      {
                        key: 2,
                        label: "Assignment",
                        onClick: () => {
                          onFindResource(id, "Assignment");
                        },
                      },
                    ],
                  }}
                >
                  Add Content
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
  chapter: ChapterDetail[];
  onDiscard: () => void;
  onRefresh: () => void;
  onEditResource: (id: number) => void;
  setOpen: (value: boolean) => void;
  onFindResource: (id: number, content: ResourceContentType) => void;
  deleteChapter: (id: number) => void;
  updateChapterState: (id: number, state: string) => void;
  updateResState: (id: number, state: string) => void;
  deleteRes: (id: number, videoId: number, videoUrl: string, assignment_file: string, type: string) => void;
  onSave: (value: string) => void;
}> = ({
  onSave,
  chapter,
  onRefresh,
  setOpen,
  onFindResource,
  deleteChapter,
  onEditResource,
  updateChapterState,
  updateResState,
  deleteRes,
  onDiscard,
}) => {
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
          type="chapter"
          onRender={setRender}
          deleteChapter={deleteChapter}
          updateState={updateChapterState}
          onFindResource={onFindResource}
          deleteRes={() => {}}
          id={content.chapterId}
          onEdit={() => {}}
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
              deleteChapter={() => {}}
              id={res.resourceId}
              updateState={updateResState}
              onEdit={onEditResource}
              type="resource"
              onFindResource={() => {}}
              onRender={setRender}
              deleteRes={deleteRes}
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
        </Flex>
      </div>
      <div>
        <Flex justify="space-between" align="center">
          <h2>{chapter.length ? chapter.length : 0} Chapters</h2>

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
      </div>
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

export default Curriculum;
