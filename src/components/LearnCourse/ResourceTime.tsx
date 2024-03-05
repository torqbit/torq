import { secondsToTime } from "@/services/helper";
import { FC } from "react";

const ResourceTime: FC<{ time: number; className: string }> = ({ time, className }) => {
  const recouceTime = secondsToTime(time);

  if (recouceTime.hrs > "00") {
    return (
      <span className={className}>
        {recouceTime.hrs}:{recouceTime.mins} hours
      </span>
    );
  } else {
    return <span className={className}>{recouceTime.mins} mins</span>;
  }
};

export default ResourceTime;
