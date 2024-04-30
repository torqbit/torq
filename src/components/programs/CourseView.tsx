import {
  Button,
  Card,
  Drawer,
  Dropdown,
  Form,
  Input,
  MenuProps,
  Modal,
  Popconfirm,
  Select,
  Space,
  Tag,
  message,
} from "antd";
import { FC, useEffect, useRef, useState } from "react";
import styles from "@/styles/ProgramCourse.module.scss";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import router from "next/router";
import ProgramService from "@/services/ProgramService";
import AddCourseChapter from "./AddCourseChapter";
import AddResource from "./AddVideoLesson";
import { Resource } from "@prisma/client";
import AddVideoLesson from "./AddVideoLesson";

const CourseHeader: FC<{
  edit: boolean | undefined;
  name: string;
  durationInMonths: number;
  skills: string[];
  state: string;
  courseId: number;
  onDeleteCourse: (courseId: number) => void;
  onUpdateCourse: (courseId: number) => void;
  onRefresh: () => void;
}> = ({ name, durationInMonths, edit, skills, state, onUpdateCourse, courseId, onDeleteCourse, onRefresh }) => {
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Edit",

      onClick: () => {
        onUpdateCourse(courseId);
      },
      style: { textAlign: "center" },
    },
    {
      key: "2",

      label: (
        <Popconfirm
          title="Delete the Course"
          description="Are you sure to delete this course?"
          onConfirm={() => onDeleteCourse(courseId)}
          okText="Yes"
          cancelText="No"
        >
          Delete
        </Popconfirm>
      ),
      onClick: () => {},
      style: { textAlign: "center" },
    },

    {
      key: "3",
      label: state === "ACTIVE" ? "Save as Draft" : "Publish",
      onClick: () => {
        state === "ACTIVE" ? onUpdateState(courseId, "DRAFT") : onUpdateState(courseId, "ACTIVE");
      },
      style: { textAlign: "center" },
    },
  ];

  const onUpdateState = (courseId: number, state: string) => {
    ProgramService.updateCourseState(
      courseId,
      state,
      (result) => {
        message.success(result.message);
        onRefresh();
      },
      (error) => {}
    );
  };

  return (
    <header>
      <div className={styles.card_title}>
        <div>{name}</div>
        <div>
          <Space>
            <div className={styles.duration}>{durationInMonths} months</div>
            <div className={styles.pipe}>|</div>
            <div>
              {skills?.map((s, index) => (
                <Tag className={styles.skillWrapper} key={index} bordered={false}>
                  {s}
                </Tag>
              ))}
            </div>
          </Space>
        </div>
      </div>

      {edit && (
        <div className={styles.__draft}>
          {state === "DRAFT" && <Tag>{state}</Tag>}
          <Dropdown menu={{ items }} trigger={["click"]} placement="bottom" arrow>
            <EllipsisOutlined className={styles.course_actionBtn_dropdown} />
          </Dropdown>
        </div>
      )}
    </header>
  );
};
