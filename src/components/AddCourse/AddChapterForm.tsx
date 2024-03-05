import { IAddChapter } from "@/pages/add-course";
import {
  Form,
  Input,
  Button,
  Space,
  Steps,
  FormInstance,
  message,
  Popconfirm,
} from "antd";
import styles from "@/styles/AddCourse.module.scss";
import { DeleteOutlined } from "@ant-design/icons";
import { FC } from "react";
import { IResponse, getFetch } from "@/services/request";
import CustomEditorJS from "../Editorjs/CustomEditorJS";
import React from "react";
import AddResourceForm from "./AddResourceForm";

const AddChapterForm: FC<{
  form: FormInstance;
  loading: boolean;
  selectedChapter: IAddChapter;
  onRefresh: () => void;
  currentStep: number;
  onCancelChapter: () => void;
  onSaveChapter: () => void;
  setCurrentStep: (v: number) => void;
  onChangeMenu: (v: string) => void;
  chapDescRef: any;
}> = ({
  form,
  loading,
  selectedChapter,
  onCancelChapter,
  onRefresh,
  currentStep,
  setCurrentStep,
  onSaveChapter,
  onChangeMenu,
  chapDescRef,
}) => {
  const onDeleteChapter = async (chapterId: number) => {
    const deleteChap = await getFetch(`/api/chapter/delete/${chapterId}`);
    const result = (await deleteChap.json()) as IResponse;
    if (deleteChap.ok && deleteChap.status === 200) {
      message.success(result.message);
      onChangeMenu("add_chapter");
      onRefresh();
    } else {
      message.error(result.error);
    }
  };

  return (
    <section className={styles.add_chapter_section}>
      <Steps
        size="small"
        current={currentStep}
        className={styles.add_course_steps}
        items={[
          {
            title: "Chapter Overview",
          },
          {
            title: "Chapter Resources",
          },
        ]}
      />

      {currentStep === 0 && (
        <>
          <Form.Item
            label="Title"
            name="chapter_title"
            rules={[{ required: true, message: "Required Title" }]}
          >
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item label="Description" name="chapter_desc">
            <CustomEditorJS
              holder="chapt_desc_editor"
              editorRef={chapDescRef}
              editorData={selectedChapter.description}
              readOnly={false}
            />
          </Form.Item>

          <Form.Item noStyle>
            <Space>
              <Button
                style={{ padding: "0 40px" }}
                type="primary"
                loading={loading}
                onClick={onSaveChapter}
              >
                {selectedChapter.name ? "Update" : "Save"}
              </Button>
              {selectedChapter.name && (
                <Button
                  style={{ padding: "0 40px" }}
                  type="default"
                  onClick={() => setCurrentStep(1)}
                >
                  Next
                </Button>
              )}
              <Button
                style={{ padding: "0 40px" }}
                type="default"
                onClick={onCancelChapter}
              >
                Cancel
              </Button>
              {selectedChapter?.chapterId && (
                <Popconfirm
                  title="Delete the Chapter"
                  description="Are you sure to delete this Chapter?"
                  onConfirm={() =>
                    onDeleteChapter(Number(selectedChapter.chapterId))
                  }
                  okText="Yes"
                  cancelText="No"
                >
                  <Button style={{ padding: "0 40px" }} type="text">
                    <DeleteOutlined rev={undefined} style={{ color: "red" }} />
                  </Button>
                </Popconfirm>
              )}
            </Space>
          </Form.Item>
        </>
      )}

      {currentStep === 1 && (
        <AddResourceForm
          form={form}
          onCancelResource={() => setCurrentStep(0)}
          chapterId={Number(selectedChapter?.chapterId)}
        />
      )}
    </section>
  );
};

export default AddChapterForm;
