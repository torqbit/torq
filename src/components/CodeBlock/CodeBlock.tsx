import CodeMirror from "@uiw/react-codemirror";
import React, { FC } from "react";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";

const lanExt: any = {
  html: html(),
  javascript: javascript(),
  css: css(),
};

const CodeBlock: FC<{
  value: string;
  onCodeChange: (v: string, name: string) => void;
  name: string;
  height?: string;
  editable?: boolean;
}> = ({ height = "230px", value, onCodeChange, name, editable = true }) => {
  return (
    <CodeMirror
      value={value}
      editable={editable}
      theme='dark'
      extensions={[lanExt[name]]}
      height={height}
      onChange={(value) => {
        onCodeChange(value, name);
      }}
    />
  );
};

export default CodeBlock;
