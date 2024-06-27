export default {
  cmnErrorMsg: "Something went wrong. Please try again later",
  platformName: "Torqbit",
  courseTags: ["HTML", "CSS", "JS", "ReactJS"],
  assignmentLang: ["html", "css", "javascript", "java", "python", "go", "nodejs", "reactjs"],
  courseType: ["FREE", "PAID"],
  defaultPageSize: 5,
  privatePath: ["/add-course"],
  attachmentFileFolder: "discussion-attachment",
  assignmentFileFolder: "assignment-files",
  assignmentMaxScore: 10,
  certificateDirectory: "/courses/certificates/",
  supportEmail: "support@torqbit.com",

  fontDirectory: {
    dmSerif: {
      italic: "/public/fonts/DM_Serif_Display/DMSerifDisplay-Italic.ttf",
      regular: "/public/fonts/DM_Serif_Display/DMSerifDisplay-Regular.ttf",
    },
    kaushan: "/public/fonts/KaushanScript-Regular.ttf",
    kalam: "/public/fonts/Kalam-Regular.ttf",
  },
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
  lineChart: {
    graphColor: "#5b63d3",
    black: "#000",
    white: "#fff",
    grey: "#eee",
  },
};
