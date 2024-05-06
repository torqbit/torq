export default {
  cmnErrorMsg: "Something went wrong. Please try again later",
  courseTags: ["HTML", "CSS", "JS", "ReactJS"],
  assignmentLang: ["html", "css", "javascript", "java", "python", "go", "nodejs", "reactjs"],
  courseType: ["FREE", "PAID"],
  privatePath: ["/add-course"],
  attachmentFileFolder: "discussion-attachment",
  assignmentFileFolder: "assignment-files",
  assignmentMaxScore: 10,
  userRole: {
    STUDENT: "STUDENT",
    AUTHOR: "AUTHOR",
    TA: "TA",
  },
  development: {
    cookieName: "next-auth.session-token",
  },
  production: {
    cookieName: "__Secure-next-auth.session-token",
  },
};
