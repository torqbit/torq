export const courseCompletionEmailConfig = {
  productName: "Torqbit",
  description: (course_title: string) => {
    return `
    Congratulations! You've successfully completed ${course_title}. We're thrilled to celebrate
    this ahievement with you and commend your hard work and dedication throughout the course.
    `;
  },
  linkDescription: "                You can download your certificate of completion by clicking the below image.  ",
  supportDescription: "  If you have any questions, feel free to email our support team, or even send a reply .",
  buttonText: "Learn More",
  queryDescription:
    "If you have any questions, feel free to email our support team, or even send a reply to this email. We wouuld be happy to answer any queries.",
  teamName: "Torqbit team",
  urlIssueDescription:
    "If you're having trouble with the button above, copy and paste the URL below into your web browser.",
  url: `${process.env.NEXTAUTH_URL}/courses/`,
};
