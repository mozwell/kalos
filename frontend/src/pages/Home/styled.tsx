import styled from "@emotion/styled";
import { Typography, Divider, Button } from "@mui/joy";
import List from "@mui/joy/List";
import { Radio, FormLabel } from "@mui/joy";

import { TextField } from "../../components";
// @ts-ignore
import { ReactComponent as Logo } from "../../assets/logo.svg";

const Wallpaper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: 100% 100%;
  background-image: url("https://images.unsplash.com/photo-1495422964407-28c01bf82b0d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80");
`;

const Overview = styled.div`
  width: 80vw;
  height: 90vh;
  inset: 64px;
  background: rgba(35, 120, 130, 0.4);
  backdrop-filter: blur(31px);
  border: 1px solid rgba(35, 120, 130, 0.3);
  border-radius: 16px;
  padding: 20px;
  display: flex;
`;

const LeftRail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  height: fit-content;
`;

const StyledList = styled(List)`
  width: 250px;
`;

const TotalCount = styled(Typography)`
  margin-top: 15px;
  margin-bottom: 15px;
`;

const StyledDivider = styled(Divider)`
  margin-bottom: 15px;
`;

const StyledButton = styled(Button)`
  margin-top: 15px;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const StyledLogo = styled(Logo)`
  margin-top: 25px;
  margin-bottom: 30px;
`;

const StyledSearch = styled(TextField)`
  .JoyInput-root {
    background: #00333333;
  }
`;

const StyledRadio = styled(Radio)`
  .JoyRadio-radio {
    background: #00333333;
    &:hover {
      background: #00333377;
    }
  }
`;

const StyledFormLabel = styled(FormLabel)`
  font-size: 16px;
`;

export {
  Wallpaper,
  Overview,
  LeftRail,
  StyledList,
  TotalCount,
  StyledDivider,
  StyledButton,
  LoadingWrapper,
  StyledLogo,
  StyledSearch,
  StyledRadio,
  StyledFormLabel,
};
