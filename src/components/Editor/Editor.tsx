import Styles from "@/styles/Marketing/Blog/Blog.module.scss";

import React, { useRef } from "react";
import { Editor, EditorContent, EditorProvider, FloatingMenu, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
// import UploadImage from "tiptap-extension-upload-image";
import UploadImage from "./Extension/UploadExtension";
import Gapcursor from "@tiptap/extension-gapcursor";
import { postWithFile } from "@/services/request";
import { Button, Flex, message, Radio } from "antd";
import SvgIcons from "../SvgIcons";
import Image from "@tiptap/extension-image";
import ImgCrop from "antd-img-crop";

const TextEditor: React.FC<{
  contentData: HTMLElement;
  setContent: (content: JSONContent) => void;
  isEditable: boolean;
  currentContentData: JSONContent;
  contentType: string;
}> = ({ contentData, setContent, isEditable, contentType }) => {
  // const editor = useRef<Editor | null>(null);
  const uploadFn = async (file: any) => {
    // const name = file.name.replace(/\s+/g, "-");
    // const formData = new FormData();
    // formData.append("file", file);
    // formData.append("title", name);
    // formData.append("dir", `/editor/${contentType}/`);

    // const postRes = await postWithFile(formData, `/api/v1/upload/file/editor-upload`);
    // if (!postRes.ok) {
    //   throw new Error("Failed to upload file");
    // }
    // const res = await postRes.json();
    // if (res.success) {
    //   return res.fileCDNPath;
    // } else {
    //   message.error(res.error);
    // }
    return "https://torqbit-dev.b-cdn.net/static//user/profile/MD-MEHRAB-ALAM_profile-1720519287381.png";
  };
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: Styles.codeBlock,
          },
        },
      }),
      UploadImage.configure({
        uploadFn: uploadFn,
        HTMLAttributes: {
          class: Styles.uploadedImage,
        },
      }),
      Placeholder.configure({
        placeholder: `Start writing your ${contentType.toLowerCase()} `,
        emptyEditorClass: Styles.emptyPlaceholder,
      }),
      Gapcursor,
    ],
    content: contentData,
    onUpdate: ({ editor }) => {
      const jsonData = editor.getJSON();
      setContent(jsonData);
    },
    editorProps: {
      attributes: {
        class: Styles.editorWrapper,
      },
    },
    editable: isEditable,
  });

  const onHandleImage = () => {
    editor && editor.chain().focus().addImage().run();
  };

  if (!editor) {
    return;
  } else {
    return (
      <div className="tiptap-editor">
        {editor && (
          <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div className={Styles.floatingMenu}>
              <Radio.Group size="middle" className={Styles.floatButton}>
                <Radio.Button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</Radio.Button>
                <Radio.Button value="default" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                  {" "}
                  H2
                </Radio.Button>
                <Radio.Button onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullet list</Radio.Button>
                <Radio.Button onClick={onHandleImage} className={Styles.imgUploadWrapper}>
                  <Flex align="center" justify="center">
                    <i> {SvgIcons.imgUpload}</i>
                  </Flex>
                </Radio.Button>
              </Radio.Group>
            </div>
          </FloatingMenu>
        )}
        <EditorContent editor={editor} />
      </div>
    );
  }
};

export default TextEditor;
