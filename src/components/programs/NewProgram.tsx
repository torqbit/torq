import { FC, useEffect, useState } from "react";
import styles from "../../styles/AddNewProgram.module.scss";
import { Form, Input, Modal, Tag, UploadFile, Upload, Button, Dropdown, Space, message, InputNumber, Spin } from "antd";
import { useRouter } from "next/router";
import ProgramService from "@/services/ProgramService";
import ImgCrop from "antd-img-crop";
import { getFetch, postWithFile } from "@/services/request";
import appConstant from "@/services/appConstant";

const NewProgram: FC<{
  programState: {
    edit: string;
    title: string;
    duration: string;
    description: string;
    imgUrl: string;
  };
  loading: boolean;
  onFinish: (
    title: string,
    description: string,
    duration: number,
    thumbnailImg: string,
    edit: string,
    imgPath: string,
    state: string,
    action: string
  ) => void;
  onUpdateEditState: (value: string) => void;
  onUpdateProgramState: (key: string, value: string) => void;
}> = ({ programState, onFinish, onUpdateEditState, onUpdateProgramState, loading }) => {
  const [thumbnailImg, setThumbnailImg] = useState<string>("");
  const [upLoading, setUploading] = useState<boolean>(false);
  const [thumbnailId, setThumbnailId] = useState("");
  const [form] = Form.useForm();
  const [model, contextWrapper] = Modal.useModal();
  const router = useRouter();
  const [state, setState] = useState<string>("");

  const onFinishProgram = (state: string, action: string) => {
    if (router.query.edit !== "true") {
      thumbnailImg
        ? onFinish(
            form.getFieldsValue().title,
            form.getFieldsValue().description,
            form.getFieldsValue().duration,
            thumbnailImg,
            "false",
            "",
            state,
            "continue"
          )
        : model.error({
            title: "Field Missing",
            content: "Select an img first!",
          });
    } else if (router.query.edit === "true") {
      const title = form.getFieldsValue().title === undefined ? programState.title : form.getFieldsValue().title;

      const description =
        form.getFieldsValue().description === undefined ? programState.description : form.getFieldsValue().description;
      const duration =
        form.getFieldsValue().duration === undefined ? Number(programState.duration) : form.getFieldsValue().duration;

      thumbnailImg
        ? onFinish(title, description, duration, thumbnailImg, "true", programState.imgUrl, state, action)
        : onFinish(title, description, duration, programState.imgUrl, "true", "", state, action);
    }
  };

  const onBeforeUploadFile = async (file: any) => {
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("folder", appConstant.IMG_KIT_PROGRAM_FOLDER);
      setUploading(true);
      const postRes = await postWithFile(formData, `/api/upload/files`);
      if (!postRes.ok) {
        setUploading(false);
        throw new Error("Failed to upload file");
      }
      const res = await postRes.json();
      setThumbnailImg(res.upFiles[0]?.url);
      setThumbnailId(res.upFiles[0]?.fileId);
      onUpdateProgramState("imgUrl", res.upFiles[0]?.url);
      setUploading(false);
    } catch (err: any) {
      setUploading(false);
      message.error(err.message ?? appConstant.cmnErrorMsg);
    }
    return false;
  };

  const onDeleteThumbnail = async () => {
    setThumbnailImg("");
    setThumbnailId("");
    onUpdateProgramState("imgUrl", "");
    return;
    try {
      const deleteRes = await getFetch(`/api/upload/delete/${thumbnailId}`);
      if (!deleteRes.ok) {
        setUploading(false);
        throw new Error("Failed to delete uploaded file");
      }
      setThumbnailImg("");
      setThumbnailId("");
      onUpdateProgramState("imgUrl", "");
      message.success("File deleted successfully");
    } catch (err: any) {
      setUploading(false);
      message.error(err.message ?? appConstant.cmnErrorMsg);
    }
  };

  useEffect(() => {
    ProgramService.getProgram(
      Number(router.query.programId),
      (result) => {
        if (router.query.edit) {
          form.setFieldValue("title", result.getProgram?.title);
          form.setFieldValue("duration", result.getProgram.durationInMonths);
          form.setFieldValue("description", result.getProgram?.description);
          onUpdateProgramState("imgUrl", result.getProgram.thumbnail);
          setState(result.getProgram.state);
        }
      },
      (error) => {}
    );
  }, [router.query]);

  return (
    <section className={styles.addNewProgram}>
      {contextWrapper}
      <div className={styles.newProgramWrapper}>
        <h1>
          All Programs / <span>New Program</span>
        </h1>
        <Spin spinning={upLoading} tip="Uploading image " fullscreen />

        <Form
          onFinish={() => {
            onFinishProgram("ACTIVE", "continue");
          }}
          layout="vertical"
          form={form}
          className={`${styles.newProgramFormWrapper} newProgramForm`}
        >
          <div>
            <div className={styles.uploadWrapper}>
              <>
                {programState.imgUrl !== "" && (
                  <img height={160} src={programState.imgUrl} style={{ borderRadius: 8 }} alt="Thumbnail" />
                )}

                {!upLoading && (
                  <ImgCrop rotationSlider>
                    <Upload
                      showUploadList={false}
                      onChange={(value) => {}}
                      beforeUpload={async (file) => {
                        onBeforeUploadFile(file);
                        return false;
                      }}
                      className={styles.ant__upload}
                      multiple={false}
                    >
                      <div className={styles.camera__button}>
                        <img height={24} style={{ margin: "0 auto" }} src="/img/program/camera-add.svg" />
                      </div>
                    </Upload>
                  </ImgCrop>
                )}
              </>
            </div>
          </div>
          <div>
            <div className={styles.formInputsWrapper}>
              <Form.Item
                name="title"
                label="Enter Program name"
                rules={[
                  {
                    required: router.query.edit === "true" ? false : true,
                    message: "Required Title",
                  },
                ]}
              >
                <Input
                  defaultValue={router.query.edit && programState.title}
                  placeholder="add program title"
                  style={{ width: 380 }}
                  onChange={(e) => {
                    onUpdateProgramState("title", e.currentTarget.value);
                  }}
                />
              </Form.Item>
              <Form.Item
                name="duration"
                label="Enter Program duration"
                rules={[
                  {
                    required: router.query.edit === "true" ? false : true,
                    message: "Required Duration",
                  },
                ]}
              >
                <InputNumber
                  placeholder="add duration in month"
                  defaultValue={router.query.edit && Number(programState.duration)}
                  style={{ width: 380 }}
                  onChange={(e) => {
                    onUpdateProgramState("duration", String(e));
                  }}
                />
              </Form.Item>
            </div>
            <Form.Item
              name="description"
              label="Describe the Program"
              rules={[
                {
                  required: router.query.edit === "true" ? false : true,
                  message: "Required Description",
                },
              ]}
            >
              <Input.TextArea
                defaultValue={router.query.edit && programState.description}
                placeholder="add description"
                onChange={(e) => {
                  onUpdateProgramState("description", e.currentTarget.value);
                }}
              />
            </Form.Item>
            <div className={styles.actionBtnWrapper}>
              <Button
                htmlType="submit"
                type="primary"
                loading={loading}
                onClick={() => {
                  onUpdateEditState("");
                }}
              >
                {router.query.edit !== "true" ? "Save to Continue" : "Update"}
                <img style={{ marginLeft: 10 }} src="/img/program/arrow-right.png" alt="arrow" />
              </Button>
              <Dropdown.Button
                className={styles.defaultBtn}
                onClick={() => {
                  {
                    state !== "DRAFT" ? onFinishProgram("DRAFT", "") : onFinishProgram("ACTIVE", "");
                  }
                  onUpdateEditState("");
                }}
                menu={{
                  items: [
                    {
                      key: 1,
                      label: "Save as Draft and Continue",
                      onClick: () => {
                        onFinishProgram("DRAFT", "continue");
                      },
                    },
                    {
                      key: 2,
                      label: "Cancel",
                      onClick: () => {
                        router.push("/programs");
                      },
                    },
                  ],
                }}
              >
                {state !== "DRAFT" ? "Save as Draft" : "Publish"}
              </Dropdown.Button>
            </div>
          </div>

          <div></div>
        </Form>
      </div>
    </section>
  );
};

export default NewProgram;
