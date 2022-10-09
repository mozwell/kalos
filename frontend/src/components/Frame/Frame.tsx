import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

type FrameSize = "small" | "medium" | "large";
type FrameProps = {
  size: FrameSize;
  content: string;
};

const frameStyle = (props: FrameProps) => css`
  width: 300px;
  height: 300px;
  ${props.content}
`;

const Frame = styled.div`
  ${frameStyle}
`;

export { Frame };
