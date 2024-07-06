import { useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import styles from "@/styles/Blog.module.scss";
import { Button, Dropdown, Flex, Form, Input, Popconfirm, Tooltip, Upload, UploadProps, message } from "antd";
import ImgCrop from "antd-img-crop";
import { LoadingOutlined } from "@ant-design/icons";
import SvgIcons from "@/components/SvgIcons";
import { postWithFile } from "@/services/request";
import { createSlug } from "@/lib/utils";

import { JSONContent } from "@tiptap/react";
import BlogService from "@/services/BlogService";
import { useRouter } from "next/router";
import { StateType } from "@prisma/client";
import TextEditor from "@/components/Editor/Editor";

const BlogForm: FC<{
  htmlData: HTMLElement;
  bannerImage: string;
  title: string;
  state: StateType;
  contentType: string;
}> = ({ htmlData, title, bannerImage, state, contentType }) => {
  const { data: user } = useSession();
  const [blogBanner, setBlogBanner] = useState<string>(bannerImage);
  const [blogTitle, setBlogTitle] = useState<string>(title);

  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const [currentContentData, setCurrentContentData] = useState<JSONContent>();
  const router = useRouter();
  const [currentState, setCurrentState] = useState<StateType>(state);

  const [blogBannerUploading, setBlogBannerUploading] = useState<boolean>(false);
  const [loader, setLoader] = useState<{ discard: boolean; publish: boolean }>({
    discard: false,
    publish: false,
  });

  const uploadFile = async (file: any, title: string) => {
    if (file) {
      console.log("hit");
      setBlogBannerUploading(true);
      const name = title.replace(/\s+/g, "-");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", name);
      formData.append("dir", "/blog/banners/");

      blogBanner && formData.append("existingFilePath", blogBanner);

      const postRes = await postWithFile(formData, `/api/v1/upload/file/upload`);
      if (!postRes.ok) {
        setBlogBannerUploading(false);
        throw new Error("Failed to upload file");
      }
      const res = await postRes.json();

      if (res.success) {
        setBlogBanner(res.fileCDNPath);
        BlogService.updateBlog(
          undefined,
          undefined,
          state,
          res.fileCDNPath,
          String(router.query.blogId),
          (result) => {
            messageApi.success("file uploaded");
            setBlogBannerUploading(false);
          },
          (error) => {
            messageApi.error(error);
          }
        );
      }
    }
  };
  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      // setLoading(false);
    }
  };

  const onPostBlog = (state: StateType, exit?: boolean) => {
    setLoader({ ...loader, publish: true });
    BlogService.updateBlog(
      blogTitle,
      currentContentData,
      state,
      blogBanner,
      String(router.query.blogId),
      (result) => {
        messageApi.success(result.message);
        setCurrentState(result.blog.state);
        setLoader({ ...loader, publish: false });
        if (exit) {
          router.push("/admin/content");
        }
      },
      (error) => {
        messageApi.error(error);
        setLoader({ ...loader, publish: false });
      }
    );
  };

  const onDelete = () => {
    setLoader({ ...loader, discard: true });

    BlogService.deleteBlog(
      String(router.query.blogId),
      (result) => {
        messageApi.success(result.message);
        router.push("/admin/content");
        setLoader({ ...loader, discard: false });
      },
      (error) => {
        messageApi.error(error);
        setLoader({ ...loader, discard: false });
      }
    );
  };

  return (
    <section className={styles.blogFormConatiner}>
      <Form form={form}>
        {contextHolder}
        <h2>Hello {user?.user?.name}</h2>
        <Flex className={styles.publishBtn} align="center" gap={10}>
          <Popconfirm
            title={`Delete the blog`}
            description={`Are you sure to delete this blog?`}
            onConfirm={() => onDelete()}
            okText="Yes"
            cancelText="No"
          >
            <Button loading={loader.discard}>Discard</Button>
          </Popconfirm>

          <Dropdown.Button
            loading={loader.publish}
            type="primary"
            onClick={() => {
              currentState === "DRAFT" ? onPostBlog("ACTIVE") : onPostBlog("DRAFT");
            }}
            icon={SvgIcons.chevronDown}
            menu={{
              items: [
                {
                  key: 1,

                  label: currentState === "DRAFT" ? "Save and exit" : "Publish ",
                  onClick: () => {
                    currentState === "DRAFT" ? onPostBlog("DRAFT", true) : onPostBlog("ACTIVE", true);
                  },
                },
              ],
            }}
          >
            {currentState === "DRAFT" ? "  Publish " : "Save as Draft"}
          </Dropdown.Button>
        </Flex>
        <div className={styles.formContainer}>
          <Form.Item name="title">
            <Input
              onChange={(e) => setBlogTitle(e.target.value)}
              defaultValue={blogTitle}
              placeholder="Set the title of the blog"
            />
          </Form.Item>
          <div className={styles.video_container}>
            <ImgCrop rotationSlider aspect={16 / 8}>
              <Upload
                name="avatar"
                listType="picture-card"
                className={styles.upload__thumbnail}
                showUploadList={false}
                style={{ width: 800, height: 400 }}
                beforeUpload={(file) => {
                  const bannerName = createSlug(title);
                  uploadFile(file, `${bannerName}_blog_banner`);
                }}
                onChange={handleChange}
              >
                {blogBanner ? (
                  <>
                    <img style={{ borderRadius: 4, objectFit: "cover" }} src={blogBanner} />
                    <Tooltip title="Upload course thumbnail">
                      <div className={styles.camera_btn_img}>
                        {blogBannerUploading && blogBanner ? <LoadingOutlined /> : SvgIcons.camera}
                      </div>
                    </Tooltip>
                    <div className={styles.bannerStatus}>{blogBannerUploading && "Uploading"}</div>
                  </>
                ) : (
                  <button
                    className={styles.upload_img_button}
                    style={{ border: 0, background: "none", width: 800, height: 400 }}
                    type="button"
                  >
                    {blogBannerUploading ? <LoadingOutlined /> : SvgIcons.uploadIcon}
                    {!blogBannerUploading ? (
                      <div style={{ marginTop: 8 }}>Upload banner</div>
                    ) : (
                      <div style={{ color: "#000" }}>{blogBannerUploading && "Uploading"}</div>
                    )}
                  </button>
                )}
              </Upload>
            </ImgCrop>
          </div>
        </div>
        <div className={styles.editorContainer}>
          <TextEditor
            contentData={htmlData}
            currentContentData={currentContentData as JSONContent}
            setContent={setCurrentContentData}
            isEditable={true}
            contentType={contentType}
          />
        </div>
      </Form>
    </section>
  );
};

export default BlogForm;
