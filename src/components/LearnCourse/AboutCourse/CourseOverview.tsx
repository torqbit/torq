import React, { FC } from "react";
import styles from "@/styles/LearnLecture.module.scss";
import CustomEditorJS from "../../Editorjs/CustomEditorJS";
import EditorJS from "@editorjs/editorjs";
import { IResource } from "@/lib/types/learn";
import { Skeleton } from "antd";

const CourseOverview: FC<{ sltResource: IResource; loading: boolean }> = ({ sltResource, loading }) => {
  const ref = React.useRef<EditorJS>();
  return (
    <div className={styles.course_overview}>
      {/* <CustomEditorJS
        holder="course_desc_readOnly"
        editorRef={ref}
        editorData={sltResource.description}
        readOnly={true}
        placeholder=""
      /> */}
      {loading ? <Skeleton.Input size="small" /> : <p>{sltResource.description}</p>}
    </div>
  );
};

export default CourseOverview;
