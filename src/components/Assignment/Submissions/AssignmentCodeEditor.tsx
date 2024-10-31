import { Flex, Tabs, TabsProps, Tree, TreeDataNode } from "antd";
import { FC, useEffect, useState } from "react";

import style from "@/styles/LearnLecture.module.scss";
import CodeEditor from "../../CodeEditor/CodeEditor";
import { arrangeAssignmentFiles, getExtension, getIcon } from "@/lib/utils";
import { truncateString } from "@/services/helper";
import { DownOutlined } from "@ant-design/icons";
import { useAppContext } from "../../ContextApi/AppContext";

const { DirectoryTree } = Tree;
const AssignmentCodeEditor: FC<{
  assignmentFiles: string[];
  fileMap: Map<string, string>;
  assignmentId?: number;
  saveAssignment?: (assignmentId: number, fileMap: Map<string, string>) => void;
  readOnly: boolean;
  updateAssignmentMap: (fileName: string, newValue: string) => void;
}> = ({ assignmentFiles, updateAssignmentMap, fileMap, readOnly, saveAssignment, assignmentId }) => {
  let selectedFile = assignmentFiles.length > 0 ? assignmentFiles[0] : "";
  const [tabKey, setTabKey] = useState<string>(selectedFile);
  const { globalState } = useAppContext();
  const items: TabsProps["items"] = arrangeAssignmentFiles(assignmentFiles).map((fileName, i) => {
    const language = getExtension(fileName);
    let splitFiles = fileName.split("/");

    return {
      key: fileName as string,
      label: (
        <Flex gap={5} align="center" className={tabKey === fileName ? style.activeTab : style.inActiveTab}>
          <span className={`${language}_icon`}>{getIcon(language)}</span>
          <div>{truncateString(splitFiles[splitFiles.length - 1], 10)}</div>
        </Flex>
      ),

      children: (
        <CodeEditor
          className={globalState.collapsed ? style.editor_collapsed_container : style.editor_container}
          defaultValue={fileMap.get(tabKey) as string}
          updateAssignmentMap={updateAssignmentMap}
          fileName={tabKey}
          readOnly={readOnly}
          assignmentId={assignmentId}
          fileMap={fileMap}
          saveAssignment={saveAssignment}
        />
      ),
    };
  });
  const transformToTreeData = (paths: string[]) => {
    return paths.reduce((tree: TreeDataNode[], path) => {
      const extension = getExtension(path);

      const parts = path.split("/");
      let currentLevel = tree;

      parts.forEach((part: string, i) => {
        let node = currentLevel.find((n) => n.key === part);
        if (!node) {
          node = part.includes(".")
            ? {
                title: (
                  <span
                    className={`${extension}_tree_title ${
                      tabKey === parts[parts.length - 1] ? style.selectedBranch : style.notSelectedBranch
                    }`}
                  >
                    {truncateString(part, i > 2 ? 5 : 10)}
                  </span>
                ),
                isLeaf: true,
                switcherIcon: <span className={`${extension}_icon`}>{getIcon(extension)}</span>,
                key: path,
              }
            : {
                title: (
                  <span
                    className={`${extension}_tree_title ${
                      tabKey === parts[parts.length - 1] ? style.selectedBranch : style.notSelectedBranch
                    }`}
                  >
                    {" "}
                    {truncateString(part, i > 2 ? 5 : 10)}
                  </span>
                ),

                key: part,
                children: [],
              };

          currentLevel.push(node);
        }

        currentLevel = node.children as TreeDataNode[];
      });
      return tree;
    }, []);
  };

  const onChange = (key: string) => {
    if (key !== "undefined" && key.includes(".")) {
      setTabKey(key);
    }
  };

  useEffect(() => {
    setTabKey(assignmentFiles[0]);
  }, [assignmentFiles]);

  const getTabwWidth = () => {
    if (globalState.collapsed && globalState.lessonCollapsed) {
      return "calc(100vw - 460px)";
    } else if (!globalState.collapsed && globalState.lessonCollapsed) {
      return "calc(100vw - 645px)";
    } else if (globalState.collapsed && !globalState.lessonCollapsed) {
      return "calc(100vw - 720px)";
    } else {
      return "calc(100vw - 900px)";
    }
  };

  return (
    <Flex align="flex-start">
      <div className={style.files_list}>
        <DirectoryTree
          className={`${style.tree_wrapper} tree_container`}
          showIcon={false}
          defaultSelectedKeys={[tabKey]}
          selectedKeys={[tabKey]}
          defaultExpandAll
          treeData={transformToTreeData(arrangeAssignmentFiles(assignmentFiles))}
          onSelect={(e) => {
            onChange(`${e[0]}`);
          }}
        />
      </div>
      <div className={globalState.collapsed ? style.collapsedFilesTab : style.filesTab}>
        <Tabs
          className={style.editorTab}
          onChange={onChange}
          style={{ width: readOnly ? "100%" : getTabwWidth(), transition: "all .4s ease" }}
          activeKey={tabKey}
          tabBarStyle={{
            padding: "0px",
            height: 30,
            margin: 0,
          }}
          items={items}
        />
      </div>
    </Flex>
  );
};

export default AssignmentCodeEditor;
