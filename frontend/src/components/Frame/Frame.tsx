import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

type FrameProps = {
  content: string;
};

const frameStyle = (props: FrameProps) => {
  return css`
    height: 100%;
    width: 100%;
    ${props.content}
    border-radius: 20px;
  `;
};

const Frame = styled.div`
  ${frameStyle}
`;

export { Frame };
