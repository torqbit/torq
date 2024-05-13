import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import jsPDF from "jspdf";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const doc = new jsPDF();

    const imgUrl = "/img/certificate/certificate-sample.png";

    const generatePDF = () => {
      doc.addImage(imgUrl, "PNG", 0, 0, 210, 297);
      doc.addPage();
    };

    // ...
    // <button onClick={() => { doc.save('ex.pdf') }}> Download PDF</button>
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));
