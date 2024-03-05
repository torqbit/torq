import { Button, Drawer, Form, FormInstance, Input, Select, Space, message } from "antd";
import { FC, useState } from "react";
import styles from "@/styles/ProgramCourse.module.scss";
import { useRouter } from "next/router";
import AddResource from "./AddResource";
import { CloseCircleFilled } from "@ant-design/icons";

const AddCourseChapter: FC<{
  showChapterDrawer: (value: boolean) => void;
  updateChapter: (chapterId: number) => void;
  createChapter: (courseId: number) => void;
  loading: boolean | undefined;
  open: boolean;
  courseId: number;
  currentSeqIds: number[];

  form: FormInstance;
}> = ({
  showChapterDrawer,
  updateChapter,

  createChapter,
  loading,
  open,
  courseId,
  currentSeqIds,
  form,
}) => {
  const router = useRouter();

  const onClose = () => {
    showChapterDrawer(false);
    form.resetFields();
    router.replace(`/programs/${router.query.programId}/add-overview?edit=true`);
  };

  return (
    <>
      <Drawer
        className={styles.newChapterDetails}
        title={router.query.chapterId ? "Update Chapter" : "New Chapter Details"}
        placement="right"
        maskClosable={false}
        onClose={() => {
          onClose();
        }}
        open={open}
        footer={
          <Form
            form={form}
            onFinish={() => {
              router.query.chapterId ? updateChapter(Number(router.query.chapterId)) : createChapter(courseId);
            }}
          >
            <Space className={styles.footerBtn}>
              <Button loading={loading} onClick={() => {}} type="primary" htmlType="submit">
                {router.query.chapterId ? "Update" : "Save"}
              </Button>
              <Button
                type="default"
                onClick={() => {
                  onClose();
                  router.query.chapterId &&
                    router.replace(`/programs/${router.query.programId}/add-overview?edit=true`);
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form>
        }
      >
        <Form form={form} layout="vertical">
          <div className={styles.formCourseName}>
            <Form.Item label="Title" name="name" rules={[{ required: true, message: "Please Enter Title" }]}>
              <Input placeholder="Set the title of the chapter" />
            </Form.Item>
            <div>
              <div>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true, message: "Please Enter Description" }]}
                >
                  <Input.TextArea rows={4} placeholder="Brief description about the chapter" />
                </Form.Item>
              </div>
            </div>

            <div>
              <Form.Item label="Set Index" name="index" rules={[{ required: true, message: "Please Enter Index" }]}>
                <Select placeholder="Choose index">
                  {currentSeqIds.length >= 1 &&
                    currentSeqIds.map((seq) => {
                      return <Select.Option value={`${seq}`}>{seq}</Select.Option>;
                    })}
                  {!router.query.chapterId && (
                    <>
                      {currentSeqIds.length >= 1 ? (
                        <Select.Option value={`${currentSeqIds.length + 1}`}>{currentSeqIds.length + 1}</Select.Option>
                      ) : (
                        <Select.Option value="1">1</Select.Option>
                      )}
                    </>
                  )}
                </Select>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Drawer>
    </>
  );
};

export default AddCourseChapter;
