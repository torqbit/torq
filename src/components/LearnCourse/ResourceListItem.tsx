import { getFetch, IResponse } from "@/services/request";
import { Resource, ResourceContentType } from "@prisma/client";
import styles from "../../styles/LearnLecture.module.scss";
import { Skeleton, Space } from "antd";
import { CheckOutlined, LockOutlined } from "@ant-design/icons";
import { FC, useState, useEffect } from "react";
import ResourceTime from "./ResourceTime";
import { IResource } from "@/lib/types/learn";

const ResourceItem: FC<{
  sltResourceId: number;
  onSelectLecture: (v: number) => void;
  resourceId: number;
  name: string;
  time: number;
  contentType: string;
  refresh: boolean;
  userId: number;
  resId: number;
  currentResourceId: number;
  submitDay: number;
  loading: boolean;
}> = ({
  sltResourceId,
  contentType,
  onSelectLecture,
  name,
  time,
  resourceId,
  refresh,
  userId,
  resId,
  currentResourceId,
  loading,

  submitDay,
}) => {
  const [isCompleted, setCompleted] = useState<boolean>();
  const [loadingList, setLoading] = useState<boolean>();

  const getProgress = async () => {
    try {
      setLoading(true);
      const res = await getFetch(`/api/progress/get/${resourceId}/checkStatus`);
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        setCompleted(result.isCompleted);

        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    getProgress();
  }, [refresh]);

  return (
    <>
      {loading ? (
        <Skeleton.Button className={styles.lecture_item} />
      ) : (
        <Space
          className={`${styles.lecture_item} ${sltResourceId === resourceId && styles.slt_lecture}`}
          align="start"
          onClick={() => onSelectLecture(resourceId)}
        >
          {contentType === "Video" ? (
            <img height={30} width={30} src="/img/about-course/playcircle.svg" alt="play-icon" />
          ) : (
            <img height={30} width={30} src="/img/about-course/assignment.svg" alt="play-icon" />
          )}
          <Space direction="vertical" size={3}>
            <span className={styles.lecture_name}>{name}</span>
            {contentType === "Video" ? (
              <ResourceTime time={time} className={styles.lecture_time} />
            ) : (
              <div className={styles.lecture_time}>{submitDay} hours</div>
            )}
          </Space>
          {!loadingList && currentResourceId && resId && (
            <div style={{ position: "absolute", right: 10 }}>
              {isCompleted && currentResourceId && resId && <CheckOutlined className={styles.checked_icon} />}
              {!isCompleted && currentResourceId !== resId && (
                <img height={30} width={30} src="/img/courses/lock.svg" alt="lock-icon" />
              )}
            </div>
          )}
        </Space>
      )}
    </>
  );
};

const ResourceListItem: FC<{
  allResources: IResource[];
  onSelectResource: (id: number) => void;
  refresh: boolean;
  userId: number;
  sltResourceId: number | undefined;
  currentResourceId: number;
  loading: boolean;
}> = ({ allResources, onSelectResource, loading, sltResourceId, refresh, userId, currentResourceId }) => {
  return (
    <aside className={styles.list_resource_items}>
      {currentResourceId &&
        allResources
          ?.sort((a, b) => a.sequenceId - b.sequenceId)
          .map((l: IResource, i) => {
            return (
              <ResourceItem
                name={l.name}
                time={l.videoDuration}
                contentType={l.contentType}
                sltResourceId={sltResourceId ? sltResourceId : 0}
                onSelectLecture={onSelectResource}
                key={l.resourceId}
                refresh={refresh}
                resourceId={l.resourceId}
                userId={Number(userId)}
                submitDay={l?.daysToSubmit || 0}
                resId={l.resourceId}
                currentResourceId={currentResourceId}
                loading={loading}
              />
            );
          })}
    </aside>
  );
};

export default ResourceListItem;
