import React, { FC } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { styled } from "@stitches/react";
import { Row } from "./styles";

const StyledLoader = styled(Row, {
  height: "100vh",
  ".icon": {
    fontSize: "100px",
    color: "black",
  },
});

interface props {
  size?: number;
}

export const Loader: FC<props> = ({ size = 100 }) => {
  const icon = (
    <LoadingOutlined className="icon" spin style={{ fontSize: `${size}px` }} />
  );
  return (
    <StyledLoader w={100} positioning={"centered"}>
      <Spin indicator={icon} />
    </StyledLoader>
  );
};
