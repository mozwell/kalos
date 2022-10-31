import styled from "@emotion/styled";

import { Frame, TextField } from "../../components";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
`;

const LeftContainer = styled.div`
  width: 53%;
  padding-right: 2.5%;
  padding-left: 1%;
  box-sizing: border-box;
  padding-top: 30px;
  max-height: 100%;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(100, 100, 100, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
`;

const RightContainer = styled.div`
  width: 47%;
  height: 80%;
  box-sizing: border-box;
  padding: 30px;
`;

const ButtonContainer = styled.div`
  margin-top: 70px;
  display: flex;
  justify-content: center;
`;

const StyledTextField = styled(TextField)`
  label {
    font-size: 16px;
  }
`;

const StyledFrame = styled(Frame)`
  margin-top: 25px;
`;

export {
  Wrapper,
  LeftContainer,
  RightContainer,
  ButtonContainer,
  StyledTextField,
  StyledFrame,
};
