import Styles from "@/styles/Blog.module.scss";

import React, { useRef } from "react";
import { Editor, EditorProvider, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

const TiptapEditor: React.FC<{
  contentData: HTMLElement;
  setContent: (content: JSONContent) => void;
  isEditable: boolean;
  currentContentData: JSONContent;
  contentType: string;
}> = ({ contentData, setContent, isEditable, contentType }) => {
  const editor = useRef<Editor | null>(null);
  console.log(contentType, "t");

  if (!editor) {
    return;
  } else {
    return (
      <div className="tiptap-editor">
        <EditorProvider
          extensions={[
            StarterKit.configure({
              codeBlock: {
                HTMLAttributes: {
                  class: Styles.codeBlock,
                },
              },
            }),
            Placeholder.configure({
              placeholder: `Start writing your ${contentType.toLowerCase()} `,
              emptyEditorClass: Styles.emptyPlaceholder,
            }),
          ]}
          editable={isEditable}
          editorProps={{
            attributes: {
              class: Styles.editorWrapper,
            },
          }}
          content={contentData}
          onUpdate={({ editor }) => {
            const jsonData = editor.getJSON();
            setContent(jsonData);
          }}
          ref={editor}
        ></EditorProvider>
      </div>
    );
  }
};

export default TiptapEditor;
