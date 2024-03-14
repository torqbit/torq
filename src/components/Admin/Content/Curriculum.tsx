import SvgIcons from "@/components/SvgIcons";
import styles from "@/styles/Curriculum.module.scss";
import { ArrowDownOutlined, EllipsisOutlined, FolderAddOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Collapse, Dropdown, Flex, MenuProps, Space, Tag } from "antd";

import { FC, ReactNode, useState } from "react";
export const dropdownMenu: MenuProps["items"] = [
  {
    key: "1",
    label: "Edit",
  },
  {
    key: "2",
    label: "Block",
  },
  {
    key: "3",
    label: "Delete",
  },
];
const Label: FC<{
  title: string;
  type: string;
  keyValue: string;
  onRender: (value: string[]) => void;
  render: string[];
  icon: ReactNode;
  state: string;
}> = ({ title, type, onRender, render, keyValue, icon, state }) => {
  const onActive = (value: string[]) => {
    if (render.includes(value[0])) {
      let currentValue = render.filter((v) => v !== value[0]);
      onRender(currentValue);
    } else {
      render.push(value[0]);
    }
    console.log(
      render,
      keyValue,
      render.filter((v) => v !== value[0])
    );
  };
  return (
    <div className={styles.labelContainer} onClick={() => onActive([keyValue])}>
      <Flex justify="space-between" align="center">
        <div>
          <Flex gap={10} align="center">
            {icon}
            <div> {title}</div>
          </Flex>
        </div>
        <div>
          <Flex align="center" gap={10}>
            {type === "chapter" && (
              <Button className={styles.add_btn}>
                <div>Add Content </div>
                {SvgIcons.chevronDown}
              </Button>
            )}{" "}
            <Dropdown.Button
              className={state === "Draft" ? styles.draft_btn : styles.publish_btn}
              trigger={["click"]}
              icon={SvgIcons.chevronDown}
              menu={{
                items: [
                  {
                    key: 1,
                    label: state === "Published" ? "Draft" : "Published",
                    onClick: () => {},
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

const Curriculum = () => {
  const [render, setRender] = useState(["1", "2"]);

  const git = [
    <div className={styles.resContainer}>
      <Label
        title="History to Git"
        icon={SvgIcons.playBtn}
        type=""
        onRender={setRender}
        render={render}
        keyValue="res1"
        state="Draft"
      />
    </div>,
    <div className={styles.resContainer}>
      <Label
        title="Install GIt on Mac & Windows "
        icon={SvgIcons.playBtn}
        type=""
        onRender={setRender}
        render={render}
        keyValue="res2"
        state="Draft"
      />
    </div>,
    <div className={styles.resContainer}>
      <Label
        title="Basic  Git Commands"
        icon={SvgIcons.playBtn}
        type=""
        onRender={setRender}
        render={render}
        keyValue="res3"
        state="Draft"
      />
    </div>,
    <div className={styles.resContainer}>
      <Label
        title="Test ypur Git skills "
        icon={SvgIcons.file}
        type=""
        onRender={setRender}
        render={render}
        keyValue="res4"
        state="Published"
      />
    </div>,
    <div className={styles.resContainer}>
      <Label
        title="  Git commit & logs"
        icon={SvgIcons.file}
        type=""
        onRender={setRender}
        render={render}
        keyValue="res5"
        state="Published"
      />
    </div>,
  ];
  const branch = [
    <div className={styles.resContainer}>
      <Label
        title="Feature branch"
        icon={SvgIcons.playBtn}
        type=""
        onRender={setRender}
        render={render}
        keyValue="res1"
        state="Draft"
      />
    </div>,
    <div className={styles.resContainer}>
      <Label
        title="Merging multiple branches "
        icon={SvgIcons.playBtn}
        type=""
        onRender={setRender}
        render={render}
        keyValue="res2"
        state="Draft"
      />
    </div>,
    <div className={styles.resContainer}>
      <Label
        title="  Git rebase"
        icon={SvgIcons.playBtn}
        type=""
        onRender={setRender}
        render={render}
        keyValue="res3"
        state="Draft"
      />
    </div>,
    <div className={styles.resContainer}>
      <Label
        title="Test ypur Git skills "
        icon={SvgIcons.file}
        type=""
        onRender={setRender}
        render={render}
        keyValue="res4"
        state="Published"
      />
    </div>,
    <div className={styles.resContainer}>
      <Label
        title="  Git branch commands "
        icon={SvgIcons.file}
        type=""
        onRender={setRender}
        render={render}
        keyValue="res5"
        state="Published"
      />
    </div>,
  ];
  const items = [
    {
      key: "1",
      label: (
        <Label
          title="Introduction to Git"
          icon={SvgIcons.folder}
          type="chapter"
          onRender={setRender}
          render={render}
          keyValue="1"
          state="Draft"
        />
      ),
      children: git,
      showArrow: false,
    },
    {
      key: "2",
      label: (
        <Label
          title="  Git branching"
          icon={SvgIcons.folder}
          type="chapter"
          onRender={setRender}
          render={render}
          keyValue="2"
          state="Draft"
        />
      ),
      children: branch,
      showArrow: false,
    },
  ];

  return (
    <section className={styles.curriculum}>
      <div className={styles.curriculum_container}>
        <Flex justify="space-between" align="center">
          <h1>Curriculum</h1>

          <Space>
            <Button>Discard</Button>

            <Button type="primary">
              Save Curriculum <img style={{ marginLeft: 5 }} src="/img/program/arrow-right.png" alt="arrow" />
            </Button>
          </Space>
        </Flex>
      </div>
      <div>
        <Flex justify="space-between" align="center">
          <h2>2 Chapters</h2>

          <Space>
            <Button className={styles.add_btn}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                height={20}
                width={20}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
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
