import * as React from "react";
import { IResponse, postWithFile } from "@/services/request";

const CustomEditorJS: React.FC<{
  placeholder: string;
  editorRef?: any;
  holder: string;
  editorData: any;
  readOnly: boolean;
  className?: string;
}> = ({ editorRef, holder, editorData, readOnly, className, placeholder }) => {
  const [isMounted, setIsMounted] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(true);

  const initializeEditor = React.useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;
    const CodeTool = (await import("@editorjs/code")).default;

    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: holder,
        readOnly: readOnly,
        onReady() {
          editorRef.current = editor;
          setLoading(false);
        },
        placeholder: placeholder,
        inlineToolbar: true,
        data: editorData,
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
          },
          linkTool: LinkTool,
          list: {
            class: List,
            inlineToolbar: true,
          },
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
          image: {
            inlineToolbar: true,
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: any) {
                  const formData = new FormData();
                  formData.append("file", file);
                  const response = await postWithFile(
                    formData,
                    `/api/upload/image/assignment`
                  );
                  const result = (await response.json()) as IResponse;

                  if (response.ok && result.data.success === 1) {
                    return result.data;
                  }
                },

                async uploadByUrl(url: string) {
                  return {
                    success: 1,
                    file: {
                      url: url,
                    },
                  };
                },
              },
            },
          },
          Code: {
            inlineToolbar: true,
            class: CodeTool,
          },
        },
      });
    }
  }, [editorData]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  React.useEffect(() => {
    if (isMounted) {
      initializeEditor();

      return () => {
        editorRef.current?.destroy();
        editorRef.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  return <div id={holder} className={readOnly ? className : "edit-editor"} />;
};

export default CustomEditorJS;
