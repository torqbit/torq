import { Button, Drawer, Form, FormInstance, Input, Space } from "antd";
import { FC } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/AddChapterForm.module.scss";

const AddCourseChapter: FC<{
  showChapterDrawer: (value: boolean) => void;
  updateChapter: (chapterId: number) => void;
  createChapter: (courseId: number) => void;
  loading: boolean | undefined;
  open: boolean;
  courseId: number;
  currentSeqIds: number[];
  form: FormInstance;
  edit: boolean;
  chapterId?: number;
}> = ({
  showChapterDrawer,
  updateChapter,
  createChapter,
  loading,
  open,
  courseId,
  edit,
  currentSeqIds,
  form,
  chapterId,
}) => {
  const router = useRouter();

  const onClose = () => {
    showChapterDrawer(false);
    form.resetFields();
  };

  return (
    <>
      <Drawer
        className={styles.add_chapter_wrapper}
        title={edit ? "Update Chapter" : "New Chapter Details"}
        placement="right"
        classNames={{ header: styles.headerWrapper, body: styles.body, footer: styles.footer }}
        maskClosable={false}
        onClose={() => {
          onClose();
        }}
        open={open}
        footer={
          <Form
            form={form}
            onFinish={() => {
              edit && chapterId ? updateChapter(chapterId) : createChapter(courseId);
            }}
          >
            <Space>
              <Button onClick={() => {}} type="primary" htmlType="submit">
                {edit ? "Update" : "Save"}
              </Button>
              <Button
                type="default"
                onClick={() => {
                  onClose();
                  router.query.chapterId && router.replace(`/admin/content`);
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form>
        }
      >
        <Form form={form} layout="vertical">
          <div>
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
          </div>
        </Form>
      </Drawer>
    </>
  );
};

export default AddCourseChapter;
