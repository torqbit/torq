import { transporter } from "../../../../../../services/email/transporter";

const handler = async (req, res) => {
  try {
    const body = await req.body;
    const email = body;
    const sendMail = await transporter.sendMail({
      to: email,
      from: `Torqbit <${process.env.FROM_SMTP_USER_EMAIL}>`,
      subject: "enrollment",
      text: "Congratulations you have successfully enrolled this course",
    });
    res.status(200).json({ success: true, message: "You have successfully enrolled" });
  } catch (error) {
    res.status(500).json({ success: false, error: "something wrong" });
  }
};

export default handler;
