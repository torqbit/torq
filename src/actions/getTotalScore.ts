import prisma from "@/lib/prisma";
import { submissionStatus } from "@prisma/client";

const sumMaxMarks = (arr: { score: number; assignmentId: number }[]) => {
  const maxMarksMap = new Map();

  arr.forEach((submission) => {
    const currentMax = maxMarksMap.get(submission.assignmentId) || 0;
    if (submission.score > currentMax) {
      maxMarksMap.set(submission.assignmentId, submission.score);
    }
  });

  let totalMaxMarks = 0;
  maxMarksMap.forEach((max) => {
    totalMaxMarks += max;
  });

  return totalMaxMarks;
};

const getTotalScore = async (courseId: number, studentId: string) => {
  try {
    let resultRows = await prisma.$queryRaw<any[]>`
  
          SELECT  eval.score as score, assign.id as assignmentId FROM CourseRegistration as cr 
          INNER JOIN Chapter as ch ON ch.courseId = cr.courseId 
          INNER JOIN Resource as re ON ch.chapterId = re.chapterId 
          INNER JOIN Assignment as assign ON assign.lessonId = re.resourceId
          LEFT OUTER  JOIN AssignmentSubmission as submission ON submission.assignmentId = assign.id 
          LEFT OUTER  JOIN AssignmentEvaluation as eval ON submission.id = eval.submissionId 
          WHERE cr.studentId = ${studentId} AND cr.courseId = ${courseId} AND submission.status <> ${submissionStatus.NOT_SUBMITTED}     
          
     `;

    return sumMaxMarks(resultRows);
  } catch (error) {
    console.log(error);
  }
};

export default getTotalScore;
