import ProgramService from "@/services/ProgramService";
import { Statistic } from "antd";
import { FC, useEffect, useState } from "react";

const CountDown: FC<{ id: number; onMarkAsCompleted: () => void }> = ({ id, onMarkAsCompleted }) => {
  const { Countdown } = Statistic;
  const [deadLine, setDeadLine] = useState<number>();
  useEffect(() => {
    ProgramService.getAssignmentDeadline(
      id,
      (result) => {
        let currentTIme = new Date().getTime();

        setDeadLine(result.deadline - currentTIme);
      },
      (error) => {}
    );
  }, []);

  return (
    <>
      {deadLine && (
        <Countdown
          value={new Date().getTime() + deadLine}
          onFinish={() => {
            onMarkAsCompleted();
          }}
        />
      )}
    </>
  );
};
export default CountDown;
