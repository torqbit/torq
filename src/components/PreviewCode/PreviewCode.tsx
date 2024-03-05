import React, { FC } from "react";
import style from "@/styles/CodePreview.module.scss";

interface IContent {
  html?: string;
  css?: string;
  javascript?: string;
}

const PreviewCode: FC<{ content: IContent }> = ({ content }) => {
  const [srcDoc, setScrDoc] = React.useState<string>(`
    `);

  React.useEffect(() => {
    setScrDoc(`
        <html>
        <body>${content?.html}</body>
        <style>${content?.css}</style>
        <script>${content?.javascript}</script>
        </html>
          `);
  }, []);
  return (
    <div className={style.code_preview}>
      <iframe title='preview' width='100%' height='100%' sandbox='allow-scripts' srcDoc={srcDoc} className='view__page'></iframe>
    </div>
  );
};

export default PreviewCode;
