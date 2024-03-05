import React, { useState } from "react";
import { Badge, Image, Tooltip } from "antd";
import NextImage from "next/image";
const ImagePreview: React.FC<{ imgs: string[] }> = ({ imgs }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Tooltip title='Attached Files'>
        <Badge count={imgs.length} size='small' color='#4096ff'>
          <NextImage src='/img/comment-icons/attachcircle.svg' onClick={() => setVisible(true)} alt='Attach_file' width={25} height={25} />
        </Badge>
      </Tooltip>
      <div style={{ display: "none" }}>
        <Image.PreviewGroup preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}>
          {imgs.map((img, i) => {
            return <Image src={img} key={i} />;
          })}
        </Image.PreviewGroup>
      </div>
    </>
  );
};

export default ImagePreview;
