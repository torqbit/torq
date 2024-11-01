import { Flex, Tooltip } from "antd";
import Link from "next/link";
import { FC } from "react";
import SvgIcons from "../../SvgIcons";
import styles from "@/styles/AssignmentEvaluation.module.scss";
import { useAppContext } from "@/components/ContextApi/AppContext";

const PreviewAssignment: FC<{ previewUrl: string; width?: string }> = ({ previewUrl, width }) => {
  const { globalState } = useAppContext();

  const getPreviewWidth = () => {
    if (globalState.collapsed && globalState.lessonCollapsed) {
      return "calc(100vw - 320px )";
    } else if (globalState.collapsed && !globalState.lessonCollapsed) {
      return "calc(100vw - 560px)";
    } else if (!globalState.collapsed && globalState.lessonCollapsed) {
      return "calc(100vw - 500px)";
    } else {
      return "calc(100vw - 750px)";
    }
  };
  return (
    <div
      className={styles.previewContainer}
      style={{ width: width ? width : getPreviewWidth(), transition: "all .4s ease" }}
    >
      <Flex className={styles.preview_toolbar} align="center" justify="space-between">
        <div>...</div>
        <Tooltip title="Open in New Tab">
          <Link href={previewUrl} target="_blank">
            <i> {SvgIcons.newWindow}</i>
          </Link>
        </Tooltip>
      </Flex>
      <iframe
        src={previewUrl}
        style={{
          border: "none",
          height: "calc(100vh - 235px)",
          overflow: "hidden",
          width: width ? width : getPreviewWidth(),
          position: "absolute",
        }}
        title="Embedded Content"
      />
    </div>
  );
};

export default PreviewAssignment;
