import styled from "@emotion/styled";
import { Typography, Divider, Button } from "@mui/joy";
import List from "@mui/joy/List";
import { Radio, FormLabel, RadioGroup } from "@mui/joy";

import { TextField } from "../../components";
// @ts-ignore
import { ReactComponent as Logo } from "../../assets/logo.svg";
// @ts-ignore
import Background from "../../assets/background.jpg";

const Wallpaper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: 100% 100%;
  background-image: url(${Background});
`;

const Overview = styled.div`
  width: 80vw;
  height: 90vh;
  inset: 64px;
  background: rgba(42, 99, 105, 0.4);
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

const StyledDivider = styled(Divider)<{ hasMarginBottom?: boolean }>`
  background-color: #00333322;
  margin-bottom: ${(props) => (props.hasMarginBottom ? "15px" : "unset")};
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
  margin-top: 8px;
  font-size: 16px;
`;

const StyledRadioGroup = styled(RadioGroup)`
  margin-bottom: 16px;
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
  StyledRadioGroup,
};
