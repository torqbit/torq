import React, { FC } from "react";

const SpinLoader: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className="spinner_container">
      <div className={`${className ? className : "spinner"} `}></div>
    </div>
  );
};

export default SpinLoader;
