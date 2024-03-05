import Layout from "@/components/Layout";
import React, { useEffect, useState } from "react";
import styles from "@/styles/AddCourse.module.scss";
import EditorJS from "@editorjs/editorjs";
import { Button, Form, message, Spin, Menu, MenuProps, Popconfirm } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

import CourseOverview from "@/components/AddCourse/CourseOverview";
import AddChapterForm from "@/components/AddCourse/AddChapterForm";
import { IResponse, getFetch, postFetch } from "@/services/request";
// import { getItem } from "./course/about/[courseId]";
import { CourseType } from "@prisma/client";
import { Session } from "next-auth";
import appConstant from "@/services/appConstant";
import { IContentType } from "@/components/AddCourse/AddResourceForm";
const SpinIcon = <LoadingOutlined rev={undefined} style={{ fontSize: 24 }} spin />;

export interface IAddResources {
  category?: string;
  name: string;
  description: any;
  videoDuration: number;
  contentType: IContentType;
  content: string;
  assignment?: any;
  thumbnail?: string;
  resourceId?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  daysToSubmit?: number;
  assignmentLang: string[];
}

export interface IAddChapter {
  sequenceId: number;
  objective?: string;
  name: string;
  description: any;
  resource?: IAddResources[];
  chapterId?: number | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICourseInfo {
  name: string;
  about: string;
  description: any;
  thumbnail: string;
  icon?: string;
  authorId?: number;
  tags?: string[];
  userId?: number;
  courseId?: number;
  courseType: CourseType;
  coursePrice?: number;
}

export interface IResChapters extends IResponse {
  chapters: IAddChapter[];
}

interface IProps {
  session: Session;
  query: any;
  courseOverView: ICourseInfo;
}

const AddCourse = (props: IProps) => {
  // const router = useRouter();
  // const [form] = Form.useForm();
  // const query = props.query;
  // const chapDescRef = React.useRef<EditorJS>();
  // const [refresh, setRefresh] = useState<boolean>(false);
  // const [loading, setLoading] = useState<boolean>(false);
  // const [selectedMenu, setSelectedMenu] = useState<string>("overview");
  // const [currentStep, setCurrentStep] = useState<number>(0);
  // const [selectedChapter, setSelectedChapter] = useState<IAddChapter>({
  //   name: "",
  //   description: "",
  // });
  // const [addedChapter, setAddedChapter] = useState<IAddChapter[]>([]);
  // const onChangeMenu = (value: string) => {
  //   const chapter = addedChapter.find(
  //     (c, i) => c.chapterId === Number(value)
  //   ) as IAddChapter;
  //   if (chapter) {
  //     form.setFieldValue("chapter_title", chapter.name);
  //     form.setFieldValue("chapter_desc", chapter.description);
  //     setSelectedChapter(chapter);
  //     setCurrentStep(0);
  //   }
  //   if (value === "add_chapter") {
  //     form.resetFields(["chapter_title", "chapter_desc"]);
  //     setSelectedChapter({ name: "", description: "", chapterId: null });
  //     setCurrentStep(0);
  //   }
  //   setSelectedMenu(value);
  // };
  // const fetchChapter = async (courseId: number) => {
  //   const resChap = await getFetch(`/api/chapter/${courseId}`);
  //   const result = (await resChap.json()) as IResChapters;
  //   if (resChap.ok) {
  //     setAddedChapter(result.chapters);
  //   }
  // };
  // useEffect(() => {
  //   if (query.courseId) {
  //     fetchChapter(query?.courseId);
  //   }
  // }, [refresh]);
  // useEffect(() => {
  //   if (query?.courseId) {
  //     form.setFieldValue("course_title", props.courseOverView.name);
  //     form.setFieldValue("course_about", props.courseOverView.about);
  //     form.setFieldValue("course_desc", props.courseOverView.description);
  //     form.setFieldValue("course_thumbnail", props.courseOverView.thumbnail);
  //     form.setFieldValue("course_icon", props.courseOverView.icon);
  //     form.setFieldValue("course_tags", props.courseOverView.tags);
  //     form.setFieldValue("course_type", props.courseOverView.courseType);
  //     form.setFieldValue("course_price", props.courseOverView.coursePrice);
  //   }
  // }, [query?.courseId]);
  // const items: MenuProps["items"] = [
  //   getItem(
  //     "Overview",
  //     "overview",
  //     <img src="/img/about-course/home.svg" alt="home" />
  //   ),
  //   getItem(
  //     "Chapters",
  //     "sub1",
  //     <img src="/img/about-course/chapter.svg" alt="home" />,
  //     [
  //       ...addedChapter.map((c, i) => {
  //         return getItem(c.name, `${c.chapterId}`);
  //       }),
  //       getItem(
  //         <div>+ Add Chapter</div>,
  //         "add_chapter",
  //         undefined,
  //         undefined,
  //         undefined,
  //         query.edit !== "true"
  //       ),
  //     ]
  //   ),
  // ];
  // const onSaveChapter = async () => {
  //   const chapterName = form.getFieldValue("chapter_title");
  //   const blocks = await chapDescRef.current?.save();
  //   // Validate fields
  //   form.validateFields().then(async (r) => {
  //     if (!chapterName) {
  //       form.setFields([
  //         {
  //           name: "chapter_title",
  //           errors: ["Required Title"],
  //         },
  //       ]);
  //       return false;
  //     }
  //     if (blocks?.blocks?.length === 0) {
  //       form.setFields([
  //         {
  //           name: "chapter_desc",
  //           errors: ["Required Description"],
  //         },
  //       ]);
  //       return false;
  //     }
  //     setLoading(true);
  //     // UPDATE CHAPTER IN DB
  //     if (selectedChapter && selectedChapter.name) {
  //       const res = await postFetch(
  //         {
  //           name: chapterName,
  //           description: blocks,
  //           chapterId: selectedChapter.chapterId,
  //           courseId: Number(query?.courseId),
  //         },
  //         "/api/chapter/update"
  //       );
  //       const result = (await res.json()) as IResponse;
  //       if (res.ok && res.status === 200) {
  //         message.success(result.message);
  //         setRefresh(!refresh);
  //       } else {
  //         message.error(result.error);
  //       }
  //       setLoading(false);
  //     } else {
  //       setLoading(true);
  //       // SAVE NEW CHAPTER IN DB
  //       const res = await postFetch(
  //         {
  //           name: chapterName,
  //           description: blocks,
  //           courseId: Number(query?.courseId),
  //           userId: props.session?.id,
  //         },
  //         "/api/chapter/create"
  //       );
  //       const result = (await res.json()) as IResponse;
  //       if (res.ok && res.status === 200) {
  //         message.success(result.message);
  //         setRefresh(!refresh);
  //         onChangeMenu(result.chapter.chapterId.toString());
  //         setSelectedChapter({
  //           name: result.chapter.name,
  //           description: result.chapter.description,
  //           chapterId: result.chapter.chapterId,
  //         });
  //         setCurrentStep(1);
  //       } else {
  //         message.error(result.error);
  //       }
  //       setLoading(false);
  //     }
  //   });
  // };
  // const onRefresh = () => {
  //   setRefresh(!refresh);
  // };
  // const deleteCourse = async () => {
  //   try {
  //     const deleteRes = await postFetch(
  //       {
  //         userId: Number(props.session?.id),
  //         courseId: Number(query?.courseId),
  //       },
  //       "/api/course/delete"
  //     );
  //     const result = await deleteRes.json();
  //     if (deleteRes.ok) {
  //       message.success(result.message);
  //       router.push("/courses");
  //     } else {
  //       message.error(result.error);
  //     }
  //   } catch (err) {
  //     message.error(appConstant.cmnErrorMsg);
  //   }
  // };
  // return (
  //   <Layout className={styles.add_course_page}>
  //     <Spin indicator={SpinIcon} spinning={false}>
  //       <div className={`${styles.add_course_wrapper}`}>
  //         <div className={styles.sider_wrapper}>
  //           <Menu
  //             style={{ width: 256 }}
  //             className={styles.sider_menu}
  //             defaultSelectedKeys={["overview"]}
  //             defaultOpenKeys={["sub1"]}
  //             selectedKeys={[selectedMenu]}
  //             onSelect={(v) => onChangeMenu(v.key)}
  //             mode="inline"
  //             items={items}
  //           />
  //         </div>
  //         <Form
  //           form={form}
  //           className={styles.add_course_form}
  //           layout="vertical"
  //           initialValues={{ resource_type: "Video", course_type: "FREE" }}
  //           requiredMark={false}
  //         >
  //           {selectedMenu === "overview" ? (
  //             <CourseOverview
  //               form={form}
  //               descData={props.courseOverView.description}
  //               type={props.courseOverView.courseType}
  //               onChangeMenu={onChangeMenu}
  //             />
  //           ) : (
  //             <AddChapterForm
  //               form={form}
  //               loading={loading}
  //               selectedChapter={selectedChapter}
  //               onRefresh={onRefresh}
  //               onCancelChapter={() => setSelectedMenu("overview")}
  //               currentStep={currentStep}
  //               setCurrentStep={setCurrentStep}
  //               onSaveChapter={onSaveChapter}
  //               onChangeMenu={onChangeMenu}
  //               chapDescRef={chapDescRef}
  //             />
  //           )}
  //         </Form>
  //       </div>
  //     </Spin>
  //     {query.courseId && query.edit === "true" && (
  //       <div className={styles.add_course_footer}>
  //         <div className={styles.footer_actions_btn}>
  //           <Button
  //             className={styles.btn_done}
  //             onClick={() => router.push("/")}
  //           >
  //             Done
  //           </Button>
  //           <Popconfirm
  //             title="Delete the course"
  //             description="Are you sure to delete this course?"
  //             onConfirm={deleteCourse}
  //             okText="Yes"
  //             cancelText="No"
  //           >
  //             <Button className={styles.btn_delete}>Delete</Button>
  //           </Popconfirm>
  //         </div>
  //       </div>
  //     )}
  //   </Layout>
  // );
};

// export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
//   const session = await getSession(ctx);
//   const courseId = ctx.query.courseId;
//   let courseRes: any = {};
//   if (ctx.query.edit === "true" && courseId) {
//     // courseRes = await getCoursById(Number(courseId));
//   }
//   return {
//     props: {
//       session: session,
//       query: ctx.query,
//       courseOverView: JSON.parse(JSON.stringify(courseRes)),
//     },
//   };
// };

export default AddCourse;
