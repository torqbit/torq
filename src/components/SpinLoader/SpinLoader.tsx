import React, { FC } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Result, Spin } from "antd";

export const SpinIcon = <LoadingOutlined style={{ fontSize: 64 }} spin />;

const SpinLoader: FC<{ title?: string }> = ({ title = "Please wait..." }) => {
  return (
    <div className='spin_loader'>
      <Result icon={<Spin indicator={SpinIcon} />} title={title} />
    </div>
  );
};

export default SpinLoader;
