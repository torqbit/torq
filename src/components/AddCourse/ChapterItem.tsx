import { Space, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "@/styles/AddCourse.module.scss";
import { FC } from "react";

const ChapterItem: FC<{
  id: number;
  onDeleteChapter: (id: number) => void;
  onEditChapter: (id: number) => void;
  name: string;
  description: string;
}> = ({ name, description, onDeleteChapter, onEditChapter, id }) => {
  return (
    <Space key={id} className={`${styles.chapter_item}`} align='start'>
      <div>
        <Button type='text' size='small' icon={id + 1} />
        <Space direction='vertical' size={0} align='start'>
          <span className={styles.chapter_name}>{name}</span>
          <p className={styles.resource_time}>{description}</p>
        </Space>
      </div>

      <Space className={styles.edit_chapter} align='center'>
        <EditOutlined onClick={() => onEditChapter(id)} rev={undefined} />
        <DeleteOutlined onClick={() => onDeleteChapter(id)} rev={undefined} />
      </Space>
    </Space>
  );
};

export default ChapterItem;
