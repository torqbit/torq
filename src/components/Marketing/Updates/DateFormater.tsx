import { parseISO, format } from "date-fns";
import { FC } from "react";

const DateFormater: FC<{ dateString: string }> = ({ dateString }) => {
  console.log(dateString, "str");
  const date = parseISO(dateString);
  return <time dateTime={dateString}>{format(date, "mm/dd/yyyy")}</time>;
  return <></>;
};

export default DateFormater;
