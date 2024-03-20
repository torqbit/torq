import { IChapter, IProgram, IResource } from "@/lib/types/learn";
import React, { FC, useEffect, useState } from "react";
import style from "@/styles/LearnLecture.module.scss";
import ReactPlayer from "react-player";
import ViewAssignment from "../Assignment/ViewAssignment";
import { IResponse, getFetch } from "@/services/request";
import { useRouter } from "next/router";
import { Chapter, Program } from "@prisma/client";
import { IResChapters } from "@/pages/add-course";
import { Button, Flex, Skeleton, message } from "antd";
import { BackwardFilled, LeftCircleOutlined, PlayCircleFilled, RollbackOutlined } from "@ant-design/icons";

const ResourcePlayer: FC<{
  sltResource: IResource;
  courseId: number;
  allResources: IResource[];
  resLocked: boolean;
  userId: number;
  program: IProgram;
  setResLocked: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  getProgressDetail: () => void;
  loading: boolean;
  onRefresh: () => void;
  onChangeResource: (mode: string) => void;
}> = ({
  sltResource,
  loading,
  courseId,
  allResources,
  resLocked,
  userId,
  program,
  getProgressDetail,
  setResLocked,
  onRefresh,
  onChangeResource,
  setLoading,
}) => {
  const router = useRouter();
  const [completed, setCompleted] = useState<boolean>();
  const getProgress = async (id: number) => {
    try {
      const res = await getFetch(`/api/progress/get/${id}/checkStatus`);
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        return result.isCompleted;
      }
    } catch (err) {}
  };

  const onChapterCheck = async () => {
    const resChap = await getFetch(`/api/chapter/get/${sltResource.chapterId}`);
    const result = (await resChap.json()) as IResChapters;
    if (resChap.ok) {
      const currCourse = program.course.find((c) => {
        if (c.courseId === result?.chapter?.courseId) {
          return c;
        }
      });

      let currChapterDetail = currCourse?.chapter.find((c: IChapter) => {
        if (c.chapterId === sltResource.chapterId) {
          return c;
        }
      });

      if (currChapterDetail && currChapterDetail?.sequenceId > 1) {
        const lastCompletedChapter = currCourse?.chapter.find((c, i) => {
          if (currChapterDetail) {
            if (c.sequenceId === currChapterDetail?.sequenceId - 1 && c.courseId === currChapterDetail?.courseId) {
              return c;
            }
          }
        });

        if (lastCompletedChapter) {
          let lastResource = lastCompletedChapter.resource.find((r) => {
            if (r.sequenceId === lastCompletedChapter.resource.length) {
              return r;
            }
          });

          if (lastResource) {
            const isResourceCompleted = await getProgress(lastResource?.resourceId).then((value) => {
              if (value === false) {
                setResLocked(true);
              } else {
                setResLocked(false);
              }
            });
          }
        }
      } else {
        // course logic

        if (currCourse) {
          const lastCompletedCourse = program?.course.find((c, i) => {
            if (c.sequenceId === currCourse?.sequenceId - 1 && c.programId === Number(router.query.programId)) {
              return c;
            }
          });

          if (lastCompletedCourse) {
            let lastChapter = lastCompletedCourse.chapter.find((c) => {
              if (c.sequenceId === lastCompletedCourse.chapter.length) {
                return c;
              }
            });
            if (lastChapter) {
              let lastResource = lastChapter.resource.find((r) => {
                if (r.sequenceId === lastChapter?.resource.length) {
                  return r;
                }
              });

              if (lastResource) {
                const isResourceCompleted = await getProgress(lastResource?.resourceId).then((value) => {
                  if (value === false) {
                    setResLocked(true);
                  } else {
                    setResLocked(false);
                  }
                });
              }
            }
          } else if (!lastCompletedCourse && currCourse.sequenceId === 1) {
          } else {
            const isResourceCompleted = await getProgress(sltResource.resourceId).then((value) => {
              if (value === false) {
                setResLocked(true);
              } else {
                setResLocked(false);
              }
            });
            // setCompleted(true);
          }
        }
      }
    }
  };

  const onResourceCheck = async () => {
    if (allResources) {
      let currResourceSelected = allResources.find((r) => {
        if (r.sequenceId === sltResource.sequenceId && r.chapterId === sltResource.chapterId) {
          return r;
        }
      });
      if (currResourceSelected?.sequenceId === 1) {
        onChapterCheck();
      } else {
        const lastCompletedResource = allResources.find(
          (r, i) => r.sequenceId === sltResource.sequenceId - 1 && r.chapterId === sltResource.chapterId
        );
        if (lastCompletedResource) {
          const isResourceCompleted = await getProgress(lastCompletedResource?.resourceId).then((value) => {
            if (value === false) {
              setResLocked(true);
            } else {
              setResLocked(false);
            }
          });
        }
      }
      setLoading(false);
    }
  };
  const checkIsCompleted = async () => {
    // setLoading(true);

    const res = await getFetch(`/api/progress/get/${sltResource?.resourceId}/checkStatus`);
    const result = (await res.json()) as IResponse;

    if (res.ok && result.success && result.isCompleted === true) {
      setCompleted(true);
      // setLoading(false);
    } else if (result.isCompleted === false) {
      setCompleted(false);
      onResourceCheck();
    }
  };

  useEffect(() => {
    checkIsCompleted();
  }, [sltResource]);

  return (
    <article className={style.resource_player}>
      {loading ? (
        <Skeleton.Avatar
          shape="square"
          style={{ width: 800 }}
          className={style.react_player_skeleton}
          size={sltResource.contentType === "Video" ? 420 : 400}
        />
      ) : (
        <>
          {sltResource.contentType === "Video" && !resLocked && (
            <>
              {sltResource?.name && sltResource.contentType === "Video" && (
                <ReactPlayer
                  controls={true}
                  className={style.react_player}
                  width="100%"
                  height="100%"
                  url={sltResource?.thumbnail}
                />
              )}
            </>
          )}

          {!completed && sltResource && resLocked && (
            <div className={style.resource_not_completed}>
              {sltResource?.name && sltResource && (
                <div className={style.assignment_completed}>
                  <div
                    onClick={() => {
                      getProgressDetail();
                    }}
                    className={style.returnText}
                  >
                    You have&apos;t completed the previous resources.
                  </div>
                  <Flex align="center" gap={20}>
                    <Button onClick={() => getProgressDetail()}>Go Back</Button>
                  </Flex>
                </div>
              )}
            </div>
          )}
          {sltResource.contentType === "Assignment" && !loading && (
            <>
              {sltResource?.name && completed ? (
                <div className={style.assignment_completed}>
                  <div
                    onClick={() => {
                      getProgressDetail();
                    }}
                    className={style.returnText}
                  >
                    Your time to complete the assignment is over{" "}
                  </div>
                  <Flex align="center" gap={20}>
                    <Button onClick={() => onChangeResource("next")} className={style.nextResBTn} type="primary">
                      Next Resource{" "}
                      <span>
                        <img src="/img/program/arrow-right.png" alt="" />
                      </span>
                    </Button>
                    <Button onClick={() => onChangeResource("back")}>Go Back</Button>
                  </Flex>
                </div>
              ) : (
                <ViewAssignment
                  getProgressDetail={getProgressDetail}
                  resLocked={resLocked}
                  sltResource={sltResource}
                  courseId={courseId}
                  onRefresh={onRefresh}
                  setCompleted={setCompleted}
                  loadingPage={loading}
                />
              )}
            </>
          )}
        </>
      )}
    </article>
  );
};

export default ResourcePlayer;
