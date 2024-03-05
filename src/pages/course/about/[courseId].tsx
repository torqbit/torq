// "use client";

// import Layout from "@/components/Layout";
// import router from "next/router";
// import EditorJS from "@editorjs/editorjs";
// import CustomEditorJS from "@/components/Editorjs/CustomEditorJS";

// import React, { FC, useEffect, useState } from "react";
// import styles from "@/styles/AboutCourse.module.scss";
// import { Button, Modal, Segmented, Space, message } from "antd";

// import type { MenuProps } from "antd";
// import { Menu, Tabs } from "antd";
// import { IChapter, ICourse } from "../../learn/course/[courseId]";
// import { ResourceContentType } from "@prisma/client";
// import { secondsToTime } from "@/services/helper";
// import { IResponse, getFetch, postFetch } from "@/services/request";
// import { getSession, useSession } from "next-auth/react";
// import Image from "next/image";
// import ResourceTime from "@/components/LearnCourse/ResourceTime";
// import type { TabsProps } from "antd";

// type MenuItem = Required<MenuProps>["items"][number];

// export function getItem(
//   label: React.ReactNode,
//   key: React.Key,
//   icon?: React.ReactNode,
//   children?: MenuItem[],
//   type?: "group",
//   disabled?: boolean
// ): MenuItem {
//   return {
//     key,
//     icon,
//     children,
//     label,
//     type,
//     disabled,
//   } as MenuItem;
// }

// interface ISltPrv {
//   descData: any;
//   resources?: any[];
//   chapters: IChapter[];
//   selectedChIndex: number;
// }

// const LectureItems: FC<{
//   name: string;
//   time: number;
//   isIcon: boolean;
//   contentType: ResourceContentType;
//   id: number;
// }> = ({ contentType, name, time, id, isIcon }) => {
//   return (
//     <Space className={`${styles.lecture_item}`} key={id} align="start">
//       {isIcon && contentType === "Video" ? (
//         <img src="/img/about-course/playcircle.svg" alt="play-icon" />
//       ) : (
//         <img src="/img/about-course/assignment.svg" alt="play-icon" />
//       )}
//       <Space direction="vertical" size={3}>
//         <span className={styles.lecture_name}>{name}</span>
//         <ResourceTime time={time} className={styles.lecture_time} />
//       </Space>
//     </Space>
//   );
// };

// interface IProps {
//   course: ICourse;
//   totalVideoLength: number;
//   totalAssignment: number;
//   userId: number;
// }

const AboutCourse = () => {
  //   const course: ICourse = props.course;
  //   const ref = React.useRef<EditorJS>();
  //   const { data: session } = useSession();
  //   const [loading, setLoading] = React.useState<boolean>(false);
  //   const [refresh, setRefresh] = useState<boolean>(false);
  //   const [isEnrolled, setEnrolled] = useState<boolean>(false);
  //   const [sltPrv, setSltPrv] = React.useState<ISltPrv>({
  //     descData: course.description,
  //     chapters: [],
  //     selectedChIndex: 0,
  //   });
  //   const items: MenuProps["items"] = [
  //     getItem(
  //       "Overview",
  //       "overview",
  //       <img src="/img/about-course/home.svg" alt="home" />
  //     ),
  //     getItem(
  //       "Chapters",
  //       "sub1",
  //       <img src="/img/about-course/chapter.svg" alt="home" />,
  //       course?.chapter?.map((c, i) => {
  //         return getItem(c.name, c.chapterId);
  //       })
  //     ),
  //   ];
  //   const onEnrollCourse = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await postFetch(
  //         {
  //           userId: session?.id,
  //           courseId: course.courseId,
  //           courseType: course.courseType,
  //         },
  //         "/api/course/enroll"
  //       );
  //       const result = (await res.json()) as IResponse;
  //       if (res.ok && result.success) {
  //         if (result.already) {
  //           Modal.info({
  //             title: result.message,
  //           });
  //           setRefresh(!refresh);
  //         } else {
  //           if (course.courseType === "PAID") {
  //           } else {
  //             Modal.info({
  //               title: result.message,
  //             });
  //             setRefresh(!refresh);
  //           }
  //         }
  //       } else {
  //         message.error(result.error);
  //       }
  //       setLoading(false);
  //     } catch (err: any) {
  //       message.error("Error while enrolling course ", err?.message);
  //       setLoading(false);
  //     }
  //   };
  //   const getEnrolledStatus = async () => {
  //     const res = await getFetch(
  //       `/api/course/get-enrolled/${course.courseId}/${props.userId}`
  //     );
  //     const result = (await res.json()) as IResponse;
  //     if (res.ok && result.success) {
  //       setEnrolled(result.isEnrolled);
  //     }
  //   };
  //   useEffect(() => {
  //     getEnrolledStatus();
  //   }, [refresh]);
  //   const time = secondsToTime(props.totalVideoLength);
  //   const onSelectMenu = (e: any) => {
  //     if (e.key === "overview") {
  //       setSltPrv({
  //         ...sltPrv,
  //         descData: course?.description,
  //       });
  //     } else {
  //       const chapter = course.chapter.find(
  //         (c, i) => c.chapterId === Number(e.key)
  //       );
  //       setSltPrv({
  //         ...sltPrv,
  //         descData: chapter?.description,
  //         resources: chapter?.resource,
  //       });
  //     }
  //   };
  //   const onSegmentChange = (value: number | string) => {
  //     if (value === "Overview") {
  //       setSltPrv({
  //         ...sltPrv,
  //         descData: course?.description,
  //         chapters: [],
  //       });
  //     } else {
  //       setSltPrv({
  //         ...sltPrv,
  //         descData: course.chapter[0].description,
  //         resources: course.chapter[0].resource,
  //         chapters: course.chapter,
  //       });
  //     }
  //   };
  //   const onSelectChapter = (index: number) => {
  //     const chapter = course.chapter.find((c, i) => i === index);
  //     setSltPrv({
  //       ...sltPrv,
  //       descData: chapter?.description,
  //       resources: chapter?.resource,
  //       selectedChIndex: index,
  //     });
  //   };
  //   return (
  //     <Layout>
  //       <div className={styles.about_course_page}>
  //         <section className={styles.course_header}>
  //           <div className={styles.center_content}>
  //             <div className={styles.course_icon}>
  //               <img src={props.course.icon as string} alt="Torqbit - ReactJS" />
  //             </div>
  //             <div>
  //               <h3 className={styles.course_title}>{props.course.name}</h3>
  //               <p className={styles.course_desc}>{props.course.about}</p>
  //               <Space direction="vertical" size={20} style={{ width: "100%" }}>
  //                 <Space
  //                   size={50}
  //                   className={styles.course_stats}
  //                   style={{ width: "100%" }}
  //                 >
  //                   <Space size="small">
  //                     <img
  //                       src="/img/about-course/playcircle.svg"
  //                       alt="Play Icon"
  //                     />
  //                     <span className={styles.label}>
  //                       {time.hrs}:{time.mins} hours of video
  //                     </span>
  //                   </Space>
  //                   <Space size="small">
  //                     <img
  //                       src="/img/about-course/assignment.svg"
  //                       alt="Play Icon"
  //                     />
  //                     <span className={styles.label}>
  //                       {props.totalAssignment} assignments
  //                     </span>
  //                   </Space>
  //                 </Space>
  //                 {isEnrolled ? (
  //                   <Button
  //                     type="primary"
  //                     onClick={() =>
  //                       router.push(`/learn/course/${course.courseId}`)
  //                     }
  //                     style={{ padding: "0 60px" }}
  //                   >
  //                     <Space align="center" size={3}>
  //                       <Image
  //                         src="/img/about-course/playcircle.svg"
  //                         alt="Play"
  //                         width={25}
  //                         height={25}
  //                       />{" "}
  //                       <span>Play</span>
  //                     </Space>
  //                   </Button>
  //                 ) : (
  //                   <Button
  //                     type="primary"
  //                     className={styles.enrolled_btn}
  //                     loading={loading}
  //                     onClick={onEnrollCourse}
  //                   >
  //                     {course.courseType === "FREE" ? (
  //                       "Enroll Free"
  //                     ) : (
  //                       <span style={{ fontSize: "20px" }}>
  //                         &#8377; {course.coursePrice}
  //                       </span>
  //                     )}
  //                   </Button>
  //                 )}
  //               </Space>
  //             </div>
  //           </div>
  //         </section>
  //         <section className={styles.course_content}>
  //           <div className={styles.center_content}>
  //             <div className={styles.side_navigaton}>
  //               <Segmented
  //                 defaultValue="Overview"
  //                 onChange={onSegmentChange}
  //                 className={styles.course_info_segment}
  //                 block
  //                 options={["Overview", "Chapter"]}
  //               />
  //               <Menu
  //                 style={{ width: 256 }}
  //                 className={styles.side_nav_menu}
  //                 defaultSelectedKeys={["overview"]}
  //                 defaultOpenKeys={["sub1"]}
  //                 onSelect={onSelectMenu}
  //                 mode="inline"
  //                 items={items}
  //               />
  //             </div>
  //             {sltPrv.chapters.length > 0 && (
  //               <div className={styles.list_of_chapters}>
  //                 {sltPrv.chapters.map((chp, i) => {
  //                   return (
  //                     <div
  //                       onClick={() => onSelectChapter(i)}
  //                       className={`${styles.chapter_item} ${
  //                         sltPrv.selectedChIndex === i
  //                           ? styles.selected_chapter
  //                           : styles.notselected_chapter
  //                       }`}
  //                     >
  //                       Chapter 1
  //                     </div>
  //                   );
  //                 })}
  //               </div>
  //             )}
  //             <div className={styles.side_nav_content}>
  //               <CustomEditorJS
  //                 editorRef={ref}
  //                 editorData={sltPrv.descData}
  //                 readOnly={true}
  //                 holder="course_desc_readOnly2"
  //                 placeholder=""
  //               />
  //               {sltPrv?.resources?.length && (
  //                 <>
  //                   <h3 className={styles.resource_label}>Resources</h3>
  //                   <div className={styles.chapter_resources}>
  //                     {sltPrv.resources.map((r, i) => {
  //                       return (
  //                         <LectureItems
  //                           isIcon={true}
  //                           name={r.name}
  //                           key={i}
  //                           id={i}
  //                           contentType={r.contentType}
  //                           time={r.videoDuration}
  //                         />
  //                       );
  //                     })}
  //                   </div>
  //                 </>
  //               )}
  //             </div>
  //           </div>
  //         </section>
  //       </div>
  //     </Layout>
  //   );
};

// export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
//   const session = await getSession(ctx);
//   const params = ctx?.params;
//   // const course = await getCoursById(Number(params?.courseId));
//   const totalVideoLength = await getTotalVideoLength(Number(params?.courseId));
//   const totalAssignment = await getTotalAssignment(Number(params?.courseId));
//   if (!course) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: "/courses",
//       },
//       props: {},
//     };
//   }
//   return {
//     props: {
//       course: JSON.parse(JSON.stringify(course)),
//       totalVideoLength: JSON.stringify(totalVideoLength),
//       totalAssignment: JSON.stringify(totalAssignment.length),
//       userId: JSON.parse(JSON.stringify(session?.id)),
//     },
//   };
// };
export default AboutCourse;
