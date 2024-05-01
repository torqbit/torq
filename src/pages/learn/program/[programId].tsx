import React, { useState, useEffect } from "react";
import styles from "@/styles/LearnLecture.module.scss";
import Layout from "@/components/Layout";
import getCoursById, { getProgramById, getProgramDetailById } from "@/actions/getCourseById";
import { GetServerSidePropsContext } from "next";
import { Chapter, CourseProgress, Resource, ResourceContentType } from "@prisma/client";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import ResourceListItem from "@/components/LearnCourse/ResourceListItem";
import CourseBreadcrumb from "@/components/LearnCourse/CourseBreadcrumb";
import ResourcePlayer from "@/components/LearnCourse/ResourcePlayer/ResourcePlayer";
import ResourceTitleFooter from "@/components/LearnCourse/ResourceTitleStatus";
import AboutCourse from "@/components/LearnCourse/AboutCourse/AboutCourse";
import { useMediaPredicate } from "react-media-hook";
import { Divider, Modal, Skeleton, message } from "antd";
import ProgramService from "@/services/ProgramService";
import ResourceId from "@/pages/api/v1/discussions/get-list/[resourceId]";
import { IResponse, getFetch } from "@/services/request";
import { IResResources } from "@/components/AddCourse/AddResourceForm";
import appConstant from "@/services/appConstant";
import { IChapter, ICourse, IResource, Course, IProgram } from "@/lib/types/learn";
import useModal from "antd/es/modal/useModal";

interface IProps {
  program: IProgram;
  userId: number;
}

const LearnLecture = (props: IProps) => {
  const program = props.program;
  const isMax415Width = useMediaPredicate("(max-width: 415px)");
  const router = useRouter();
  const { query } = router;
  const userId = props.userId;
  const [refresh, setRefresh] = useState<boolean>(false);
  const [resLocked, setResLocked] = useState<boolean>(false);
  const [currentResourceId, setCurrentResourceId] = useState<number>();

  const [sltChapter, setSltChapter] = useState<string | undefined>(program?.course[0]?.chapter[0]?.name);
  const [sltCourse, setSltCourse] = useState<string | undefined>(program?.course[0]?.name);
  const [allChapter, setAllChapter] = useState<IChapter[]>();

  const [courseId, setCourseId] = useState<number>(0);

  const [chapterId, setChapterId] = useState<number>(0);
  const [allResources, setAllResources] = useState<IResource[]>(program?.course[0]?.chapter[0]?.resource ?? []);

  const [sltResource, setSltResource] = useState<IResource>();
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, contextWrapper] = Modal.useModal();
  const [bredCrumbLoading, setBreadCrumbLoading] = useState<string>("");

  useEffect(() => {
    getProgressDetail();
  }, [router.query.programId]);

  const onSelectChapter = async (value: { key: string }) => {
    setLoading(true);

    const course = program?.course.find((c) => {
      if (c.name === sltCourse && c.programId === Number(query.programId)) {
        return c;
      }
    }) as ICourse;

    const chapter = course.chapter?.find((r, i) => {
      if (r.name === value.key) {
        return r;
      }
    }) as IChapter;

    if (chapter && course) {
      setAllResources(chapter?.resource.sort((a, b) => a.sequenceId - b.sequenceId) as IResource[]);
      setSltResource(chapter?.resource.sort((a, b) => a.sequenceId - b.sequenceId)[0] as IResource);
      setSltChapter(value.key);
      setChapterId(chapter?.chapterId);
    }
    setLoading(false);
  };

  const onSelectCourse = (value: { key: string }) => {
    setLoading(true);
    const course = program?.course?.find(
      (r, i) => r.name === value.key && r.programId === Number(query.programId)
    ) as ICourse;

    if (course) {
      setAllResources(course.chapter[0].resource.sort((a, b) => a.sequenceId - b.sequenceId));

      setSltResource(course.chapter[0]?.resource.sort((a, b) => a.sequenceId - b.sequenceId)[0]);

      setAllChapter(course.chapter);
      setSltChapter(course.chapter[0].name);
      setSltCourse(value.key);
      setCourseId(course?.courseId);
      setLoading(false);
    }
    setLoading(false);
  };
  const getProgress = async (id: number) => {
    try {
      const res = await getFetch(`/api/progress/get/${id}/checkStatus`);
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        return result.isCompleted;
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const getProgressDetail = async () => {
    try {
      setLoading(true);

      const res = await getFetch(`/api/progress/check/${query.programId}/${userId}`);
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        if (result.progress.length) {
          getCurrentStatus(result.progress);
        } else {
          const cuurentCourse = program.course.sort((a, b) => a.sequenceId - b.sequenceId);
          setAllResources(cuurentCourse[0].chapter[0].resource as IResource[]);
          const currentResource = program.course[0].chapter[0]?.resource.sort((a, b) => a.sequenceId - b.sequenceId);
          setSltResource(currentResource[0]);
          setCurrentResourceId(currentResource[0].resourceId);

          setSltChapter(cuurentCourse[0].chapter[0].name);
          setChapterId(cuurentCourse[0].chapter[0]?.chapterId);
          setSltCourse(cuurentCourse[0].name);
          setCourseId(cuurentCourse[0].courseId);
          setBreadCrumbLoading("loaded");
        }
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const getCurrentStatus = async (currentProgress: CourseProgress[]) => {
    const currentResource = currentProgress?.sort((a, b) => a.courseProgressId - b.courseProgressId).pop();
    const currResId = currentResource?.resourceId;
    const currResSeqId = currentResource?.sequenceId;

    try {
      setLoading(true);
      const res = await getFetch(`/api/resource/get/${currResId}`);
      const result = (await res.json()) as IResResources;
      if (res.ok && result.success) {
        if (currResSeqId && currResSeqId < result.chapter.resource.length) {
          let sltRes = result.chapter.resource
            .sort((a: Resource, b: Resource) => a.sequenceId - b.sequenceId)
            .find((r: Resource) => r.sequenceId === currResSeqId + 1);

          setSltResource(sltRes);
          setCurrentResourceId(sltRes?.resourceId);

          setAllResources(result.chapter.resource);
          setAllChapter(result.course.chapter);
          setSltChapter(result.chapter.name);
          setSltCourse(result.course.name);
          setCourseId(result?.courseId);
          setLoading(false);
          setBreadCrumbLoading("loaded");
        } else if (
          currResSeqId &&
          currResSeqId === result.chapter.resource.length &&
          result.chapter.sequenceId < result.course.chapter.length
        ) {
          let chapterSelected = result.course.chapter.find(
            (c: Chapter) => c.sequenceId === result.chapter.sequenceId + 1
          );
          if (chapterSelected) {
            setSltResource(
              chapterSelected?.resource.sort((a: Resource, b: Resource) => a.sequenceId - b.sequenceId)[0]
            );
            setCurrentResourceId(
              chapterSelected?.resource.sort((a: Resource, b: Resource) => a.sequenceId - b.sequenceId)[0].resourceId
            );
            setAllResources(chapterSelected.resource);
            setAllChapter(result.course.chapter);
            setSltChapter(chapterSelected.name);
            setSltCourse(result.course.name);
            setCourseId(result?.courseId);
          }
          setBreadCrumbLoading("loaded");
        } else if (
          currResSeqId &&
          currResSeqId === result.chapter.resource.length &&
          result.chapter.sequenceId === result.course.chapter.length
        ) {
          let courseSelected = program.course.find((c: Course) => c.sequenceId === result.course.sequenceId + 1);

          setSltResource(courseSelected?.chapter[0]?.resource.sort((a, b) => a.sequenceId - b.sequenceId)[0]);
          setCurrentResourceId(
            courseSelected?.chapter[0]?.resource.sort((a, b) => a.sequenceId - b.sequenceId)[0].resourceId
          );

          if (courseSelected) {
            setAllResources(courseSelected?.chapter[0]?.resource);
            setAllChapter(courseSelected?.chapter);
            setSltChapter(courseSelected?.chapter[0]?.name);
            setSltCourse(courseSelected?.name);
            setCourseId(courseSelected?.courseId);
          } else {
            const cuurentCourse = program.course.sort((a, b) => a.sequenceId - b.sequenceId);
            setAllResources(cuurentCourse[0].chapter[0].resource as IResource[]);
            const currentResource = program.course[0].chapter[0]?.resource.sort((a, b) => a.sequenceId - b.sequenceId);
            setSltResource(currentResource[0]);
            setCurrentResourceId(currentResource[0].resourceId);

            setSltChapter(cuurentCourse[0].chapter[0].name);
            setChapterId(cuurentCourse[0].chapter[0]?.chapterId);
            setSltCourse(cuurentCourse[0].name);
            setCourseId(cuurentCourse[0].courseId);
          }
          setBreadCrumbLoading("loaded");
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      message.error(appConstant.cmnErrorMsg);
    }
  };

  const onSelectResource = async (id: number) => {
    const resource = allResources?.find((r, i) => r.resourceId === id) as IResource;

    if (resource) {
      const lastCompletedResource = allResources.find(
        (r, i) => r.sequenceId === resource.sequenceId - 1 && r.chapterId === resource.chapterId
      );
      if (lastCompletedResource) {
        const isResourceCompleted = await getProgress(lastCompletedResource?.resourceId);
        isResourceCompleted ? setSltResource(resource) : setSltResource(resource); //message.warning("First complete the previous resources");
      } else {
        setSltResource(resource);
      }
    }
  };

  const onChangeResource = (mode: string) => {
    if (mode === "next" && sltResource) {
      if (sltResource?.sequenceId < allResources.length) {
        const nextRes = allResources.find((res: IResource) => res.sequenceId === sltResource.sequenceId + 1);
        if (nextRes) {
          setSltResource(nextRes);
        }
      } else if (sltResource?.sequenceId === allResources.length) {
        const course = program?.course.find((c) => {
          if (c.name === sltCourse && c.programId === Number(query.programId)) {
            return c;
          }
        }) as ICourse;
        if (course) {
          const currchapter = course.chapter.find((chapter) => chapter.name === sltChapter);
          const chapter =
            currchapter && course.chapter.find((chapter) => chapter.sequenceId === currchapter?.sequenceId + 1);
          if (chapter && chapter.sequenceId < course.chapter.length) {
            setAllResources(chapter?.resource.sort((a, b) => a.sequenceId - b.sequenceId) as IResource[]);
            setSltResource(chapter?.resource.sort((a, b) => a.sequenceId - b.sequenceId)[0] as IResource);
            setSltChapter(chapter.name);
            setChapterId(chapter?.chapterId);
          } else if (currchapter && currchapter.sequenceId === course.chapter.length) {
            const findCourse = program.course.find((c) => c.sequenceId === course.sequenceId + 1);

            if (findCourse && findCourse.sequenceId < program.course.length) {
              setAllResources(findCourse.chapter[0].resource.sort((a, b) => a.sequenceId - b.sequenceId));

              setSltResource(findCourse.chapter[0]?.resource.sort((a, b) => a.sequenceId - b.sequenceId)[0]);

              setAllChapter(findCourse.chapter);
              setSltChapter(findCourse.chapter[0].name);
              setSltCourse(findCourse.name);
              setCourseId(findCourse?.courseId);
            } else if (course.sequenceId === program.course.length) {
              const cuurentCourse = program.course.sort((a, b) => a.sequenceId - b.sequenceId);
              setAllResources(cuurentCourse[0].chapter[0].resource as IResource[]);
              const currentResource = program.course[0].chapter[0]?.resource.sort(
                (a, b) => a.sequenceId - b.sequenceId
              );
              setSltResource(currentResource[0]);
              setCurrentResourceId(currentResource[0].resourceId);

              setSltChapter(cuurentCourse[0].chapter[0].name);
              setChapterId(cuurentCourse[0].chapter[0]?.chapterId);
              setSltCourse(cuurentCourse[0].name);
              setCourseId(cuurentCourse[0].courseId);
            }
          }
        }
      }
    } else if (mode === "back" && sltResource) {
      if (sltResource?.sequenceId <= allResources.length) {
        const prevRes = allResources.find((res: IResource) => res.sequenceId === sltResource.sequenceId - 1);
        if (prevRes) {
          setSltResource(prevRes);
        }
      } else if (sltResource?.sequenceId === 1) {
        const course = program?.course.find((c) => {
          if (c.name === sltCourse && c.programId === Number(query.programId)) {
            return c;
          }
        }) as ICourse;
        if (course) {
          const currchapter = course.chapter.find((chapter) => chapter.name === sltChapter);
          const chapter =
            currchapter && course.chapter.find((chapter) => chapter.sequenceId === currchapter?.sequenceId - 1);

          if (chapter && chapter.sequenceId <= course.chapter.length) {
            setAllResources(chapter?.resource.sort((b, a) => b.sequenceId - a.sequenceId) as IResource[]);
            setSltResource(chapter?.resource.sort((b, a) => b.sequenceId - a.sequenceId)[0] as IResource);
            setSltChapter(chapter.name);
            setChapterId(chapter?.chapterId);
          } else if (chapter && chapter.sequenceId === 1) {
            const findCourse = program.course.find((c) => c.sequenceId === course.sequenceId - 1);
            if (findCourse && findCourse.sequenceId === program.course.length) {
              setAllResources(findCourse.chapter[0].resource.sort((b, a) => b.sequenceId - a.sequenceId));

              setSltResource(findCourse.chapter[0]?.resource.sort((b, a) => b.sequenceId - a.sequenceId)[0]);

              setAllChapter(findCourse.chapter);
              setSltChapter(findCourse.chapter[0].name);
              setSltCourse(findCourse.name);
              setCourseId(findCourse?.courseId);
            } else if (course.sequenceId === 1) {
              const cuurentCourse = program.course.sort((a, b) => a.sequenceId - b.sequenceId);
              setAllResources(cuurentCourse[0].chapter[0].resource as IResource[]);
              const currentResource = program.course[0].chapter[0]?.resource.sort(
                (a, b) => a.sequenceId - b.sequenceId
              );
              setSltResource(currentResource[0]);
              setCurrentResourceId(currentResource[0].resourceId);

              setSltChapter(cuurentCourse[0].chapter[0].name);
              setChapterId(cuurentCourse[0].chapter[0]?.chapterId);
              setSltCourse(cuurentCourse[0].name);
              setCourseId(cuurentCourse[0].courseId);
            }
          }
        }
      }
    }
  };

  return (
    <Layout className={styles.learn_resource_page}>
      {contextWrapper}
      <main className={styles.resource_wrapper}>
        {loading ? (
          <Skeleton.Button style={{ width: 500 }} />
        ) : (
          <>
            {bredCrumbLoading === "loaded" && (
              <CourseBreadcrumb
                program={program}
                onslectCourse={onSelectCourse}
                sltCourse={sltCourse}
                sltChapter={sltChapter}
                onSelectChapter={onSelectChapter}
                loading={loading}
              />
            )}
          </>
        )}

        <section className={styles.resource_content}>
          <article className={styles.view_resource_container}>
            {sltResource && (
              <ResourcePlayer
                sltResource={sltResource}
                courseId={courseId}
                allResources={allResources}
                userId={userId}
                program={program}
                getProgressDetail={getProgressDetail}
                setResLocked={setResLocked}
                resLocked={resLocked}
                loading={loading}
                onRefresh={() => setRefresh(!refresh)}
                onChangeResource={onChangeResource}
                setLoading={setLoading}
              />
            )}
            <ResourceTitleFooter
              onRefresh={() => setRefresh(!refresh)}
              refresh={refresh}
              sltResource={sltResource}
              programId={Number(query.programId)}
              courseId={courseId}
              userId={props.userId}
              chpaterId={chapterId}
              getProgressDetail={getProgressDetail}
              resLocked={resLocked}
              currentResourceId={currentResourceId || 0}
              setResLocked={setResLocked}
              loading={loading}
            />
            <Divider />
            <h4 className={styles.chapter_list_title}>Chapters</h4>
            {isMax415Width && (
              <ResourceListItem
                userId={props.userId}
                allResources={allResources}
                refresh={refresh}
                onSelectResource={onSelectResource}
                sltResourceId={sltResource?.resourceId}
                currentResourceId={currentResourceId || 0}
                loading={loading}
              />
            )}
            {sltResource && <AboutCourse loading={loading} sltResource={sltResource} userId={props.userId} />}
          </article>

          {!isMax415Width && (
            <ResourceListItem
              userId={props.userId}
              allResources={allResources as IResource[]}
              refresh={refresh}
              onSelectResource={onSelectResource}
              sltResourceId={sltResource?.resourceId}
              currentResourceId={currentResourceId || 0}
              loading={loading}
            />
          )}
        </section>
      </main>
    </Layout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const params = ctx?.params;
  const session = await getSession(ctx);
  let program;
  // get CourseById or check user enroll or not
  try {
    program = await getProgramDetailById(Number(params?.programId));
  } catch (err: any) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
      props: {},
    };
  }
  if (program?.course[0]?.chapters.length && program.course[0]?.chapters[0]?.resource.length) {
    return {
      props: {
        program: JSON.parse(JSON.stringify(program)),
        userId: session?.id,
      },
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: "/programs",
    },
    props: {},
  };
};

export default LearnLecture;
