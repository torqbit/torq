import Styles from "@/styles/Marketing/Blog/Blog.module.scss";

import React from "react";
import { EditorContent, FloatingMenu, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import UploadImage from "./Extension/UploadExtension";
import Gapcursor from "@tiptap/extension-gapcursor";
import { postWithFile } from "@/services/request";
import { Flex, message } from "antd";
import SvgIcons from "../SvgIcons";
const TextEditor: React.FC<{
  contentData: HTMLElement;
  setContent: (content: JSONContent) => void;
  isEditable: boolean;
  currentContentData: JSONContent;
  contentType: string;
}> = ({ contentData, setContent, isEditable, contentType }) => {
  const uploadFn = async (file: any) => {
    const name = file.name.replace(/\s+/g, "-");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", name);
    formData.append("dir", `/editor/${contentType}/`);

    const postRes = await postWithFile(formData, `/api/v1/upload/file/editor-upload`);
    if (!postRes.ok) {
      throw new Error("Failed to upload file");
    }
    const res = await postRes.json();
    if (res.success) {
      return res.fileCDNPath;
    } else {
      message.error(res.error);
    }
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
              <div className={Styles.floatButton}>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
                <button onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullet list</button>
                <button onClick={onHandleImage} className={Styles.imgUploadWrapper}>
                  <Flex align="center" justify="center">
                    <i> {SvgIcons.imgUpload}</i>
                  </Flex>
                </button>
              </div>
            </div>
          </FloatingMenu>
        )}
        <EditorContent editor={editor} />
      </div>
    );
  }
};

export default TextEditor;
