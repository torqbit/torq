export const courseRegistrionEmailConfig = {
  productName: "Torqbit",
  description: (course_title: string) => {
    return `
    We're excited to let you know that you've successfully enrolled in ${course_title}! Welcome
    abroad, and congratulations on taking this important step towards enhancing your skills.`;
  },
  linkDescription: "It's time to move forward. Click on the link below to get Start",
  supportDescription: " If you have any questions, feel free to email our support team, or even send a reply .",
  buttonText: "Start Course",
  queryDescription:
    "If you have any questions, feel free to email our support team, or even send a reply to this email. We wouuld be happy to answer any queries.",
  teamName: "Torqbit team",
  urlIssueDescription:
    "If you're having trouble with the button above, copy and paste the URL below into your web browser.",
  url: `${process.env.NEXTAUTH_URL}/courses`,
};
