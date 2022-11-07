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
    ${props.content ? props.content : "background: rgb(35, 35, 35);"}
    border-radius: 20px;
  `;
};

const Frame = styled.div`
  ${frameStyle}
`;

export { Frame };
